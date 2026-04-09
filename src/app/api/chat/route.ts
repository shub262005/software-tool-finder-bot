import { NextResponse } from "next/server";
import * as dialogflow from "@google-cloud/dialogflow";

const projectId = process.env.DIALOGFLOW_PROJECT_ID || "";
const clientEmail = process.env.DIALOGFLOW_CLIENT_EMAIL || "";
let privateKey = process.env.DIALOGFLOW_PRIVATE_KEY || "";

// Ensure newlines are correctly parsed from the environment variable (important for RSA keys)
if (privateKey) {
  privateKey = privateKey.replace(/\\n/g, '\n');
}

// Create the session client globally
let sessionClient: dialogflow.SessionsClient | null = null;

try {
  if (projectId && clientEmail && privateKey) {
    sessionClient = new dialogflow.SessionsClient({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
      projectId,
    });
  }
} catch (error) {
  console.error("Failed to initialize Dialogflow client", error);
}

// Helper to decode Google Protobuf Structs into standard JS Objects
function decodeStruct(struct: any): any {
  if (!struct || !struct.fields) return null;
  const result: any = {};
  for (const [key, val] of Object.entries<any>(struct.fields)) {
    if (val.stringValue !== undefined) result[key] = val.stringValue;
    else if (val.numberValue !== undefined) result[key] = val.numberValue;
    else if (val.boolValue !== undefined) result[key] = val.boolValue;
    else if (val.structValue !== undefined) result[key] = decodeStruct(val.structValue);
    else if (val.listValue !== undefined && val.listValue.values) {
      result[key] = val.listValue.values.map((v: any) => v.stringValue ?? v.numberValue ?? v.boolValue);
    } else result[key] = val;
  }
  return result;
}

export async function POST(req: Request) {
  if (!sessionClient) {
    return NextResponse.json({ error: "Dialogflow credentials are not properly configured on the server." }, { status: 500 });
  }

  try {
    const body = await req.json();
    const { sessionId, message } = body;

    if (!sessionId || !message) {
      return NextResponse.json({ error: "Missing sessionId or message" }, { status: 400 });
    }

    const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: message,
          languageCode: 'en-US',
        },
      },
    };

    // Send request to Dialogflow ES
    const [response] = await sessionClient.detectIntent(request);
    const result = response.queryResult;

    if (!result) {
      return NextResponse.json({ error: "No response from Dialogflow" }, { status: 500 });
    }

    let fulfillmentText = result.fulfillmentText || "";
    let customPayload: any = null;

    // Search for text and custom payloads in fulfillment messages
    if (result.fulfillmentMessages && result.fulfillmentMessages.length > 0) {
      let extractedTexts: string[] = [];
      for (const msg of result.fulfillmentMessages) {
        // Extract text from text messages
        if (msg.text && msg.text.text && msg.text.text.length > 0) {
          extractedTexts.push(msg.text.text.join('\n'));
        }
        
        // Extract custom payloads
        if (msg.payload && msg.payload.fields) {
          const decoded = decodeStruct(msg.payload);
          if (!customPayload) {
            customPayload = decoded;
          } else {
            customPayload = { ...customPayload, ...decoded };
          }
        }
      }

      // If fulfillmentText is empty but we matched text in fulfillmentMessages, use it
      if (!fulfillmentText && extractedTexts.length > 0) {
        fulfillmentText = extractedTexts.join('\n\n');
      }
    }

    return NextResponse.json({ 
      text: fulfillmentText,
      payload: customPayload
    });

  } catch (error: any) {
    console.error("Dialogflow Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
