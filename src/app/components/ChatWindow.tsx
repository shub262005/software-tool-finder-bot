"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, Send, User } from "lucide-react";
import ReactMarkdown from "react-markdown";

type Message = {
  id: string;
  role: "user" | "bot";
  text: string;
  payload?: any;
};

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Generate a random stable session ID per user visit
    setSessionId(Math.random().toString(36).substring(2, 10));
    setMessages([
      {
        id: "1",
        role: "bot",
        text: "Hi there! What kind of software tool are you looking for today? I can analyze your requirements, budget, and platform to find the perfect match."
      }
    ]);
  }, []);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendText = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userText = textToSend.trim();
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      text: userText,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText, sessionId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch");
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        text: data.text || "",
        payload: data.payload // Capture rich JSON payload
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error: any) {
      console.error(error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        text: "Sorry, I am having trouble connecting to the server. Please check your API credentials.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const textToSend = input;
    setInput("");
    await sendText(textToSend);
  };

  return (
    <div className="w-full h-full bg-slate-900 rounded-2xl border border-slate-800 shadow-inner z-20 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-slate-950/50 p-4 border-b border-slate-800 flex items-center gap-3 backdrop-blur-md">
        <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
          <Bot className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-slate-100 font-semibold text-sm sm:text-base">ToolFinder AI</h2>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-slate-400 text-xs font-medium">Online</span>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 sm:gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex flex-shrink-0 items-center justify-center mt-1 ${
                msg.role === "bot"
                  ? "bg-indigo-500/20 text-indigo-400"
                  : "bg-slate-800 text-slate-400"
              }`}
            >
              {msg.role === "bot" ? <Bot className="w-4 h-4 sm:w-5 sm:h-5" /> : <User className="w-4 h-4 sm:w-5 sm:h-5" />}
            </div>

            {/* Bubble Container */}
            <div className={`flex flex-col max-w-[85%] sm:max-w-[75%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
              
              {/* Text context (if any) */}
              {msg.text && (
                <div
                  className={`p-4 rounded-2xl text-sm sm:text-base leading-relaxed break-words ${
                    msg.role === "user"
                      ? "bg-indigo-600 text-white rounded-tr-sm shadow-md"
                      : "bg-slate-800 text-slate-200 rounded-tl-sm shadow-sm"
                  }`}
                >
                  <ReactMarkdown
                    components={{
                      a: ({ node, ...props }: any) => (
                        <a 
                          {...props} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="font-medium text-indigo-300 hover:text-indigo-200 underline decoration-indigo-400/30 underline-offset-2 transition-colors" 
                        />
                      ),
                      p: ({ node, ...props }: any) => <p {...props} className="mb-2 last:mb-0" />,
                      strong: ({ node, ...props }: any) => <strong {...props} className="font-semibold text-slate-100" />,
                      img: ({ node, ...props }: any) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img 
                          {...props} 
                          className="max-w-full h-auto rounded-lg my-3 border border-slate-700/50 shadow-md object-contain" 
                          alt={props.alt || "Bot provided image"} 
                        />
                      )
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                </div>
              )}

              {/* Rich Payload Card attached if detected */}
              {msg.payload && msg.payload.ToolName && (
                <div className="mt-3 bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-lg w-full max-w-sm">
                  {msg.payload.Image && (
                    <div className="w-full h-40 bg-white relative">
                      <img 
                        src={msg.payload.Image} 
                        alt={msg.payload.ToolName} 
                        className="w-full h-full object-contain p-4" 
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                       <h3 className="text-lg font-bold text-slate-100">{msg.payload.ToolName}</h3>
                       {msg.payload.Budget && (
                         <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold capitalize border border-emerald-500/20">
                           {msg.payload.Budget}
                         </span>
                       )}
                    </div>
                    
                    <div className="flex gap-2 mb-4 text-xs font-medium">
                      {msg.payload.Category && (
                         <span className="text-indigo-300 bg-indigo-500/10 px-2 py-1 rounded">
                           {msg.payload.Category.replace(/-/g, ' ')}
                         </span>
                      )}
                      {msg.payload.Platform && (
                         <span className="text-blue-300 bg-blue-500/10 px-2 py-1 rounded">
                           {msg.payload.Platform.replace(/-/g, ' ')}
                         </span>
                      )}
                    </div>

                    <p className="text-slate-400 text-sm mb-5 leading-relaxed">
                      {msg.payload.Description}
                    </p>

                    {msg.payload.Link && (
                      <a 
                        href={msg.payload.Link} 
                        target="_blank" 
                        rel="noreferrer"
                        className="block w-full text-center py-2.5 bg-indigo-600 hover:bg-indigo-500 transition-colors text-white text-sm font-semibold rounded-lg"
                      >
                        Visit Official Website
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Quick Replies Action Chips */}
              {msg.payload && msg.payload.quickReplies && msg.payload.quickReplies.length > 0 && (
                 <div className="mt-3 flex flex-wrap gap-2">
                   {msg.payload.quickReplies.map((qr: string, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => sendText(qr)}
                        disabled={isLoading}
                        className="px-4 py-1.5 rounded-full bg-slate-800 hover:bg-indigo-600 disabled:opacity-50 text-indigo-300 hover:text-white border border-slate-700 hover:border-indigo-500 transition-all text-xs sm:text-sm font-medium shadow-sm hover:shadow-md cursor-pointer"
                      >
                         {qr}
                      </button>
                   ))}
                 </div>
              )}
            </div>
          </div>
        ))}
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="flex gap-3 sm:gap-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex flex-shrink-0 items-center justify-center bg-indigo-500/20 text-indigo-400 mt-1">
              <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="p-4 rounded-2xl bg-slate-800 text-slate-200 rounded-tl-sm shadow-sm flex items-center h-[52px]">
               <div className="flex gap-1.5 items-center">
                  <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></span>
                </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-slate-900 border-t border-slate-800 p-4">
        <form onSubmit={handleSend} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder="Type your message..."
            className="w-full bg-slate-950 border border-slate-800 rounded-full pl-5 pr-14 py-3 sm:py-4 text-sm sm:text-base text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium disabled:opacity-50"
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-2 sm:p-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white rounded-full transition-colors flex items-center justify-center"
          >
            <Send className="w-4 h-4 sm:w-5 sm:h-5 ml-1" />
          </button>
        </form>
      </div>
    </div>
  );
}
