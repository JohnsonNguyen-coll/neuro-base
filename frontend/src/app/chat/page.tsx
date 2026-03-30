"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Zap, Lock, RefreshCw, MoreHorizontal } from "lucide-react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

export default function LiveChat() {
  const { connected } = useWallet();
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      content: "Hello! I am your NeuroBase Personal AI. I can access your decentralized memories via the Shelby Protocol to answer questions based on your verified knowledge. What would you like to explore today?",
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim() || !connected) return;

    // Add user message
    const userMsg = { id: Date.now(), role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response utilizing MCP
    setTimeout(() => {
      const aiMsg = { 
        id: Date.now() + 1, 
        role: "assistant", 
        content: "I am securely fetching that context from the decentralized memory. Since this is an un-monetized internal query, I can confirm that based on your stored packs, the information aligns perfectly with Web3 principles." 
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700 h-[calc(100vh-80px)] flex flex-col">
      <header className="space-y-2 shrink-0">
        <div className="flex items-center gap-2 text-green-400 font-bold tracking-tighter capitalize text-xs">
          <Zap size={14} /> AI Interaction Layer
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight">Personal <span className="text-green-500">Live Chat</span></h2>
        <p className="text-gray-400 text-sm max-w-xl">
          Test your memory packs. This AI Agent relies on Model Context Protocol (MCP) to read your uploaded decentralized data on the fly.
        </p>
      </header>

      {/* Chat Container */}
      <div className="flex-1 glass-card border border-white/5 rounded-2xl flex flex-col overflow-hidden relative">
         {!connected && (
           <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-white/10 m-4 rounded-xl">
              <Lock size={48} className="text-gray-500 mb-6" />
              <h3 className="text-2xl font-black mb-2">Wallet Disconnected</h3>
              <p className="text-gray-400 font-medium">Please connect your Aptos wallet via the sidebar to access your secure AI interaction layer.</p>
           </div>
         )}

         {/* Messages Area */}
         <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
            {messages.map((msg) => (
               <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center border ${
                     msg.role === 'user' ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'bg-white/5 border-white/10 text-white'
                  }`}>
                     {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                  </div>
                  
                  <div className={`max-w-[75%] p-4 rounded-2xl text-sm leading-relaxed ${
                     msg.role === 'user' 
                       ? 'bg-green-500 text-black font-medium rounded-tr-sm' 
                       : 'bg-white/5 border border-white/10 text-gray-300 rounded-tl-sm'
                  }`}>
                     {msg.content}
                  </div>
               </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
               <div className="flex gap-4">
                  <div className="w-10 h-10 shrink-0 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center">
                     <Bot size={20} />
                  </div>
                  <div className="px-5 py-4 rounded-2xl bg-white/5 border border-white/10 rounded-tl-sm flex items-center gap-2">
                     <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                     <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-.3s]"></div>
                     <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-.5s]"></div>
                  </div>
               </div>
            )}
            <div ref={endOfMessagesRef} />
         </div>

         {/* Input Area */}
         <div className="p-4 border-t border-white/5 shrink-0 bg-black/40">
            <div className="relative flex items-center">
               <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask your AI to decrypt and read your mind..." 
                  disabled={!connected || isTyping}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-5 pr-32 py-4 text-white placeholder-gray-500 outline-none focus:border-green-500/50 focus:bg-white/10 transition-all font-medium disabled:opacity-50"
               />
               <div className="absolute right-2 flex items-center gap-2">
                  <button className="p-2 text-gray-400 hover:text-white transition-colors" title="Tool Settings">
                     <MoreHorizontal size={20} />
                  </button>
                  <button 
                    onClick={handleSend}
                    disabled={!connected || isTyping || !input.trim()}
                    className="p-2 bg-green-500 hover:bg-green-400 text-black rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                     <Send size={18} />
                  </button>
               </div>
            </div>
            <div className="text-center mt-3">
               <p className="text-[10px] uppercase tracking-widest text-gray-600 font-bold">
                 Queries are securely routed via Model Context Protocol (MCP) <span className="text-green-500">&bull; End-to-End Local</span>
               </p>
            </div>
         </div>
      </div>
    </div>
  );
}
