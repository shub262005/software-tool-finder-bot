import ChatWindow from "../components/ChatWindow";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function BotPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col items-center pt-8 sm:pt-24 px-4 sm:px-6 relative overflow-hidden">
      {/* Background gradients */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/30 via-slate-950 to-slate-950"></div>
      
      <div className="w-full max-w-2xl mb-6 z-10 flex-shrink-0">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors font-medium">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>

      <div className="w-full max-w-2xl relative flex-1 flex flex-col mb-4 sm:mb-8">
        <div className="absolute inset-0 bg-indigo-500/10 blur-3xl -z-10 rounded-full"></div>
        {/* We use the ChatWindow here as the main focus */}
        <ChatWindow />
      </div>
    </div>
  );
}
