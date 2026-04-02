import { Search, SlidersHorizontal, ExternalLink, Bot, Database, MessageSquare, Target } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-indigo-500/30 overflow-x-hidden">
      {/* Background gradients */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/30 via-slate-950 to-slate-950"></div>
      
      {/* Navbar space */}
      <header className="absolute top-0 w-full p-6 sm:px-10 flex justify-between items-center z-20">
        <div className="flex items-center gap-2 text-xl font-bold tracking-tighter">
          <Bot className="w-8 h-8 text-indigo-400" />
          <span>ToolFinder AI</span>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative pt-32 pb-16 sm:pt-40 sm:pb-24 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-sm font-medium mb-8 border border-indigo-500/20">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          Powered by Google Dialogflow ES
        </div>
        
        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-8 max-w-4xl text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400">
          A Conversational Interface for Software Discovery.
        </h1>
        
        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mb-12 leading-relaxed">
          Skip generic, SEO-optimized articles. Chat directly with a Natural Language Processing (NLP) assistant that interprets your platform constraints, budget, and exact project needs to fetch verified tools from our database.
        </p>

        <Link 
          href="/bot"
          className="group relative px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-semibold text-lg transition-all duration-300 shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)] hover:shadow-[0_0_60px_-15px_rgba(99,102,241,0.7)] overflow-hidden inline-flex items-center"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
          <span className="relative flex items-center gap-2">
            Open Chat Interface 
            <MessageSquare className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </span>
        </Link>
      </main>

      {/* Objectives Section */}
      <section className="relative py-20 px-6 max-w-7xl mx-auto z-10 border-t border-slate-800/50">
        <div className="text-center mb-16 px-4">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-100 mb-4">
            Bot Objectives
          </h2>
          <p className="text-slate-400 max-w-3xl mx-auto text-lg leading-relaxed">
            The core objective of the Software Tool Finder is to streamline the developer and designer workflow. 
            Rather than browsing endless lists, the bot guarantees unbiased results based entirely on logical database matches. 
            It aims to reduce tool-discovery time from minutes to milliseconds seamlessly without intrusive form filling.
          </p>
        </div>
      </section>

      {/* Functionality Section */}
      <section className="relative py-12 px-6 max-w-7xl mx-auto z-10 mb-20 bg-slate-900/40 rounded-3xl border border-slate-800/60 p-8 sm:p-12">
        <div className="mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-slate-100 mb-2">
            Core Functionality
          </h2>
          <p className="text-slate-400">How the Dialogflow Agent processes your requests under the hood.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="group">
            <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-5 border border-indigo-500/20">
              <MessageSquare className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-100 mb-2">1. NLP Intent Parsing</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              When you type a message, Dialogflow ES processes the natural language through custom intents to recognize conversational context (e.g., distinguishing "Find Tool" vs "Tool Alternatives").
            </p>
          </div>

          <div className="group">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-5 border border-blue-500/20">
              <Target className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-100 mb-2">2. Entity Extraction</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              The agent uses machine learning to automatically extract parameters from your sentence, classifying them into defined entities like <code>@budget</code>, <code>@category</code>, and <code>@platform</code>.
            </p>
          </div>

          <div className="group">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-5 border border-emerald-500/20">
              <Database className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-100 mb-2">3. Webhook Fulfillment</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Once extracted, the parameters are sent to a secure Google Apps Script webhook which maps the data to our spreadsheet database, running fuzzy matching, retrieving images, and streaming a rich JSON payload back to the UI.
            </p>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="w-full p-8 pb-12 mt-12 bg-slate-950/80 border-t border-slate-900">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-slate-500 gap-4">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-indigo-500" />
            <span className="font-semibold text-slate-300 tracking-tight">Software Tool Finder</span>
          </div>
          <p className="text-sm">Technical Implementation Demonstration</p>
        </div>
      </footer>
    </div>
  );
}
