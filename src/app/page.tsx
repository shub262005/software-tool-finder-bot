import { Search, SlidersHorizontal, ExternalLink, Bot } from "lucide-react";
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
          Next-Gen AI Assistant
        </div>
        
        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-8 max-w-4xl text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400">
          Find the Perfect Software Tool in Seconds.
        </h1>
        
        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mb-12 leading-relaxed">
          Say goodbye to endless Googling. Software Tool Finder is your AI-powered companion that helps developers, designers, and creators discover, filter, and choose the best tools for their next project.
        </p>

        <Link 
          href="/bot"
          className="group relative px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-semibold text-lg transition-all duration-300 shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)] hover:shadow-[0_0_60px_-15px_rgba(99,102,241,0.7)] overflow-hidden inline-flex items-center"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
          <span className="relative flex items-center gap-2">
            Try the Bot 
            <ExternalLink className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </span>
        </Link>
      </main>

      {/* Features Section */}
      <section className="relative py-24 px-6 max-w-7xl mx-auto z-10 border-t border-slate-800/50 mt-10">
        <div className="text-center mb-16 px-4">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-100 mb-4">
            Smarter Search.<br/>Better Tools.
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Our AI understands your specific needs to cut through the noise <br className="hidden sm:block" /> and deliver exactly what you're looking for.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="group bg-slate-900/40 backdrop-blur-sm border border-slate-800/60 rounded-3xl p-8 hover:bg-slate-800/60 hover:border-slate-700 transition-all duration-300">
            <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:-translate-y-1 group-hover:bg-indigo-500/20 transition-all">
              <Search className="w-7 h-7 text-indigo-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-100 mb-3">Instant Searches</h3>
            <p className="text-slate-400 leading-relaxed">
              Describe what you need in natural language. We analyze thousands of tools instantly to bring you highly relevant choices tailored to you.
            </p>
          </div>

          <div className="group bg-slate-900/40 backdrop-blur-sm border border-slate-800/60 rounded-3xl p-8 hover:bg-slate-800/60 hover:border-slate-700 transition-all duration-300">
            <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:-translate-y-1 group-hover:bg-blue-500/20 transition-all">
              <SlidersHorizontal className="w-7 h-7 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-100 mb-3">Smart Filtering</h3>
            <p className="text-slate-400 leading-relaxed">
              Narrow down results instantly by specifying budget constraints, platform availability, team sizes, and specific integrations.
            </p>
          </div>

          <div className="group bg-slate-900/40 backdrop-blur-sm border border-slate-800/60 rounded-3xl p-8 hover:bg-slate-800/60 hover:border-slate-700 transition-all duration-300">
            <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:-translate-y-1 group-hover:bg-emerald-500/20 transition-all">
              <ExternalLink className="w-7 h-7 text-emerald-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-100 mb-3">Direct Links</h3>
            <p className="text-slate-400 leading-relaxed">
              Skip the SEO spam and long review articles. Get one-click direct access to official websites, pricing pages, and documentation.
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
          <p className="text-sm">© 2026. Made with intelligence.</p>
        </div>
      </footer>
    </div>
  );
}
