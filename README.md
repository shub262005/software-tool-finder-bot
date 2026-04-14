# 🤖 Software Tool Finder Bot

A conversational AI assistant that helps developers and designers discover the right software tools based on their specific requirements — budget, platform, and category — powered by **Google Dialogflow ES** and built with **Next.js 16**.

> Skip generic, SEO-optimized articles. Just ask the bot.

---

## ✨ Overview

**Software Tool Finder Bot** is a full-stack NLP-powered web application that acts as an intelligent tool discovery assistant. Instead of sifting through endless blog posts and curated lists, users can have a natural conversation with the bot to get tailored software tool recommendations retrieved directly from a structured database.

The application features a modern dark-themed chat UI, rich tool cards with images and links, and quick-reply chips for seamless navigation.

---

## 🚀 Features

- **Natural Language Understanding** — Powered by Dialogflow ES with custom intents (`Find.Tool`, `Tool.Alternatives`, `List.Categories`, etc.) to understand conversational context.
- **Entity Extraction** — Automatically identifies `@budget` (free/paid), `@category` (e.g., API Testing, UI Design), and `@platform` (Web, Windows, macOS) from user messages.
- **Webhook Fulfillment** — A Google Apps Script webhook queries a Google Sheets database with fuzzy matching and returns rich structured data.
- **Rich Tool Cards** — Bot responses include tool name, logo image, category, platform, budget badge, description, and a direct link to the official website.
- **Quick Reply Chips** — Contextual action buttons (e.g., "More free tools", "Show alternatives") allow multi-turn conversations.
- **Session Management** — Each user visit gets a unique session ID to maintain conversational context across multiple turns.
- **Streaming Markdown** — Bot text responses are rendered with full Markdown support (links, bold, images).

---

## 🏗️ Architecture

```
User Browser
    │
    ▼
Next.js Frontend (React + TailwindCSS)
    │  /bot  → ChatWindow.tsx (React Client Component)
    │
    ▼
Next.js API Route  (/api/chat)
    │  Forwards user message + sessionId to Dialogflow ES
    │
    ▼
Google Dialogflow ES Agent
    │  NLP intent parsing + entity extraction
    │  Webhook enabled for fulfillment
    │
    ▼
Google Apps Script Webhook
    │  Queries Google Sheets tool database
    │  Returns custom JSON payload (ToolName, Description, Image, Link, Budget...)
    │
    ▼
API Route decodes Protobuf payload → sends JSON to Frontend
    │
    ▼
ChatWindow renders Text + Rich Tool Card + Quick Reply Chips
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | Next.js 16 (App Router) |
| **UI Language** | TypeScript + React 19 |
| **Styling** | TailwindCSS v4 |
| **Icons** | Lucide React |
| **Markdown Rendering** | `react-markdown` |
| **NLP Engine** | Google Dialogflow ES |
| **Dialogflow SDK** | `@google-cloud/dialogflow` v7 |
| **Tool Database** | Google Sheets (via Google Apps Script) |

---

## 📁 Project Structure

```
SoftwareToolFinderBot/
├── src/
│   └── app/
│       ├── page.tsx              # Landing page (hero, objectives, architecture)
│       ├── layout.tsx            # Root layout
│       ├── globals.css           # Global styles
│       ├── bot/
│       │   └── page.tsx          # Chat interface page (/bot route)
│       ├── components/
│       │   └── ChatWindow.tsx    # Full chat UI component (messages, input, cards)
│       └── api/
│           └── chat/
│               └── route.ts      # Next.js API Route — Dialogflow ES proxy
├── next.config.ts
├── package.json
└── .env.local                    # Environment variables (not committed)
```

---

## ⚙️ Setup & Installation

### Prerequisites

- Node.js `>= 18`
- A Google Cloud project with **Dialogflow ES** enabled
- A Google Cloud service account with the `Dialogflow API Client` role
- A deployed **Google Apps Script** webhook connected to your tool database (Google Sheet)

### 1. Clone the Repository

```bash
git clone https://github.com/shub262005/software-tool-finder-bot.git
cd software-tool-finder-bot
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
DIALOGFLOW_PROJECT_ID=your-gcp-project-id
DIALOGFLOW_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
DIALOGFLOW_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----\n"
```

> **Important:** The `DIALOGFLOW_PRIVATE_KEY` must have literal `\n` characters (not actual newlines). The API route handles the conversion automatically.

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 💬 How It Works

1. **User sends a message** in the chat interface (e.g., *"Find me a free API testing tool for Windows"*).
2. The message is sent to the `/api/chat` Next.js API route along with the user's session ID.
3. The API route forwards the request to **Dialogflow ES** using the official Node.js SDK.
4. Dialogflow parses the intent (e.g., `Find.Tool`) and extracts entities (`budget: free`, `category: api-testing`, `platform: windows`).
5. The Dialogflow agent calls the **Google Apps Script webhook**, which queries the Google Sheets tool database and returns a structured JSON payload.
6. The API route decodes the Protobuf response and forwards both `text` and `payload` to the frontend.
7. The `ChatWindow` component renders the text response and a **rich tool card** with the tool's image, description, tags, and a visit link.
8. **Quick reply chips** are rendered if the payload includes follow-up suggestions.

---

## 🤖 Dialogflow Agent Intents

| Intent | Description |
|---|---|
| `Find.Tool` | Main intent: finds a tool based on category, budget, and platform |
| `Tool.Alternatives` | Suggests alternative tools in the same category |
| `List.Categories` | Lists all available tool categories |
| `More.Results` | Continues pagination of results for the same query |
| `Default Welcome Intent` | Greets the user |
| `Default Fallback Intent` | Handles unrecognized queries |

---

## 🌐 Deployment

This project is designed to be deployed on **Vercel**.

1. Push your code to GitHub.
2. Import the repository on [Vercel](https://vercel.com/new).
3. Add the three environment variables (`DIALOGFLOW_PROJECT_ID`, `DIALOGFLOW_CLIENT_EMAIL`, `DIALOGFLOW_PRIVATE_KEY`) in the Vercel project settings.
4. Deploy. Vercel will automatically run `npm run build`.

---

## 📄 License

This project is a technical implementation demonstration. All rights reserved.
