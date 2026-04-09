function doPost(e) {
    const request = JSON.parse(e.postData.contents);
    const intentName = request.queryResult.intent.displayName;
    const parameters = request.queryResult.parameters;

    const SHEET_ID = "1X99lXSfvgiyrF1XoSgdslbkTw1-oTxC6B9nu59bwSWY";
    const TAB_NAME = "ToolsDB";

    const cache = CacheService.getScriptCache();
    let cachedData = cache.get("tools_df_cache");
    let data;

    if (cachedData) {
        data = JSON.parse(cachedData);
    } else {
        const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
        const sheet = spreadsheet.getSheetByName(TAB_NAME);
        data = sheet.getDataRange().getValues();
        cache.put("tools_df_cache", JSON.stringify(data), 21600);
    }

    const headers = data.shift(); // Remove the header row
    let reply = "";
    let fulfillmentMessages = [];

    // Fuzzy matching algorithm (Levenshtein Distance)
    function fuzzyMatch(str1, str2) {
        if (!str1 || !str2) return false;
        let root = str1.toLowerCase().trim();
        let target = str2.toLowerCase().trim();
        // Exact substring check
        if (target.includes(root) || root.includes(target)) return true;
        // Levenshtein
        var matrix = [];
        for (var i = 0; i <= target.length; i++) { matrix[i] = [i]; }
        for (var j = 0; j <= root.length; j++) { matrix[0][j] = j; }
        for (i = 1; i <= target.length; i++) {
            for (j = 1; j <= root.length; j++) {
                if (target.charAt(i - 1) == root.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1));
                }
            }
        }
        let distance = matrix[target.length][root.length];
        return distance <= 2; // Allowing small typos
    }

    const normalize = (str) => String(str || "").toLowerCase().replace(/-/g, ' ').trim();

    // =============== INTENT: Find.Tool ===============
    if (intentName === 'Find.Tool') {
        let category = normalize(Array.isArray(parameters.category) ? parameters.category[0] : parameters.category);
        let budget = normalize(Array.isArray(parameters.budget) ? parameters.budget[0] : parameters.budget) || "any";
        let platform = normalize(Array.isArray(parameters.platform) ? parameters.platform[0] : parameters.platform) || "any";

        let foundTools = [];

        data.forEach(row => {
            let rowName = row[0];
            let rowCategory = normalize(row[1]);
            let rowBudget = normalize(row[2]);
            let rowPlatform = normalize(row[3]);
            let rowLink = row[5];

            let categoryMatch = (rowCategory === category);
            let budgetMatch = (budget === 'any' || rowBudget === budget);
            let platformMatch = (platform === 'any' || rowPlatform === 'cross platform' || rowPlatform === platform);

            if (categoryMatch && budgetMatch && platformMatch) {
                let budgetIcon = rowBudget === 'free' ? '🆓' : '💰';
                foundTools.push(`${budgetIcon} [**${rowName}**](${rowLink})`);
            }
        });

        if (foundTools.length > 0) {
            reply = `Here are the tools I found for **${category}**:\n\n`;
            reply += foundTools.join('\n');
            fulfillmentMessages.push({ "text": { "text": [reply] } });

            fulfillmentMessages.push({
                "payload": {
                    "quickReplies": ["More free tools", `Find ${category} alternatives`]
                }
            });
        } else {
            reply = `I couldn't find an exact match for that criteria right now. Want to search for something broader?`;
            fulfillmentMessages.push({ "text": { "text": [reply] } });
            fulfillmentMessages.push({
                "payload": {
                    "quickReplies": ["Show me Web Development", "Show me Data Science"]
                }
            });
        }
    }

    // =============== INTENT: Tool.Details ===============
    else if (intentName === 'Tool.Details') {
        let rawTool = Array.isArray(parameters['tool-name']) ? parameters['tool-name'][0] : parameters['tool-name'];
        let activeRow = null;

        for (let i = 0; i < data.length; i++) {
            if (fuzzyMatch(rawTool, data[i][0])) {
                activeRow = data[i];
                break;
            }
        }

        if (activeRow) {
            reply = `Here is what I know about **${activeRow[0]}**!`;
            fulfillmentMessages.push({ "text": { "text": [reply] } });
            fulfillmentMessages.push({
                "payload": {
                    "ToolName": activeRow[0],
                    "Category": activeRow[1],
                    "Budget": activeRow[2],
                    "Platform": activeRow[3],
                    "Description": activeRow[4],
                    "Link": activeRow[5],
                    "Image": activeRow[6] || "",
                    "quickReplies": [`What's an alternative to ${activeRow[0]}?`]
                }
            });
        } else {
            reply = `I haven't learned enough about ${rawTool} just yet to give you the deep dive.`;
            fulfillmentMessages.push({ "text": { "text": [reply] } });
        }
    }

    // =============== INTENT: Tool.Alternatives ===============
    else if (intentName === 'Tool.Alternatives') {
        let rawTool = Array.isArray(parameters['tool-name']) ? parameters['tool-name'][0] : parameters['tool-name'];
        let originalTool = null;

        for (let i = 0; i < data.length; i++) {
            if (fuzzyMatch(rawTool, data[i][0])) {
                originalTool = data[i];
                break;
            }
        }

        if (originalTool) {
            let catMatch = normalize(originalTool[1]);
            let diffBaseTools = data.filter(row => normalize(row[1]) === catMatch && row[0] !== originalTool[0]);

            if (diffBaseTools.length > 0) {
                reply = `If you want to move away from ${originalTool[0]}, here are some other solid ${originalTool[1]} tools:\n\n`;
                diffBaseTools.forEach(r => reply += `- [**${r[0]}**](${r[5]})\n`);
                fulfillmentMessages.push({ "text": { "text": [reply] } });

                let altReplies = diffBaseTools.slice(0, 2).map(r => `Tell me about ${r[0]}`);
                fulfillmentMessages.push({
                    "payload": { "quickReplies": altReplies }
                });
            } else {
                reply = `Currently, ${originalTool[0]} is the only ${originalTool[1]} tool I know inside out!`;
                fulfillmentMessages.push({ "text": { "text": [reply] } });
            }
        } else {
            reply = `I'm not quite sure which base tool you want alternatives to!`;
            fulfillmentMessages.push({ "text": { "text": [reply] } });
        }
    }

    return ContentService.createTextOutput(JSON.stringify({
        "fulfillmentText": reply || "I didn't catch that correctly.",
        "fulfillmentMessages": fulfillmentMessages.length > 0 ? fulfillmentMessages : undefined
    })).setMimeType(ContentService.MimeType.JSON);
}