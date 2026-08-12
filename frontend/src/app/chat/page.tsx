"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Zap, Lock, MoreHorizontal } from "lucide-react";
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
        <div className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[#5EE7DF]">
          <Zap size={14} /> AI Interaction Layer
        </div>
        <h2 className="text-3xl font-semibold tracking-[-0.04em] text-[#F2F2F5]">Secure Agent Session</h2>
        <p className="text-[#9A9AA5] text-sm max-w-xl leading-[1.7]">
          Test your memory packs. This AI Agent relies on Model Context Protocol (MCP) to read your uploaded decentralized data on the fly.
        </p>
        <p className="text-xs font-medium leading-5 text-[#C8BEFF]">
          Demo mode: MCP retrieval is prepared, but live AI responses require a configured model API key before production use.
        </p>
      </header>

      {/* Chat Container */}
      <div className="flex-1 glass-card border border-white/[0.08] rounded-[10px] flex flex-col overflow-hidden relative">
         {!connected && (
           <div className="absolute inset-0 bg-[#0A0A0B]/82 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-8 text-center border border-dashed border-white/[0.08] m-4 rounded-[10px]">
              <Lock size={48} className="text-[#7B5CFA] mb-6" strokeWidth={1.7} />
              <h3 className="text-2xl font-semibold tracking-[-0.035em] mb-2">Wallet Disconnected</h3>
              <p className="text-[#9A9AA5] font-light leading-[1.7]">Please connect your Aptos wallet via the sidebar to access your secure AI interaction layer.</p>
           </div>
         )}

         {/* Messages Area */}
         <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
            {messages.map((msg) => (
               <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center border ${
                     msg.role === 'user' ? 'bg-[#7B5CFA]/15 border-[#7B5CFA]/35 text-[#C8BEFF]' : 'bg-white/[0.035] border-white/[0.08] text-[#F2F2F5]'
                  }`}>
                     {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                  </div>
                  
                  <div className={`max-w-[75%] p-4 rounded-[10px] text-sm leading-[1.65] ${
                     msg.role === 'user' 
                       ? 'bg-gradient-to-r from-[#7B5CFA] to-[#4C2FCB] text-white font-medium rounded-tr-sm' 
                       : 'bg-white/[0.035] border border-white/[0.08] text-[#D7D7DE] rounded-tl-sm'
                  }`}>
                     {msg.content}
                  </div>
               </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
               <div className="flex gap-4">
                  <div className="w-10 h-10 shrink-0 rounded-full bg-white/[0.035] border border-white/[0.08] text-[#F2F2F5] flex items-center justify-center">
                     <Bot size={20} />
                  </div>
                  <div className="px-5 py-4 rounded-[10px] bg-white/[0.035] border border-white/[0.08] rounded-tl-sm flex items-center gap-2">
                     <div className="w-2 h-2 bg-[#5EE7DF] rounded-full animate-bounce"></div>
                     <div className="w-2 h-2 bg-[#7B5CFA] rounded-full animate-bounce [animation-delay:-.3s]"></div>
                     <div className="w-2 h-2 bg-[#5EE7DF] rounded-full animate-bounce [animation-delay:-.5s]"></div>
                  </div>
               </div>
            )}
            <div ref={endOfMessagesRef} />
         </div>

         {/* Input Area */}
         <div className="p-4 border-t border-white/[0.08] shrink-0 bg-[#0A0A0B]/62">
            <div className="relative flex items-center">
               <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask your AI to decrypt and read your mind..." 
                  disabled={!connected || isTyping}
                  className="w-full bg-white/[0.035] border border-white/[0.08] rounded-[10px] pl-5 pr-32 py-4 text-[#F2F2F5] placeholder-[#696974] outline-none focus:border-[#7B5CFA]/55 focus:ring-2 focus:ring-[#7B5CFA]/20 focus:bg-white/[0.055] transition-all font-medium disabled:opacity-50"
               />
               <div className="absolute right-2 flex items-center gap-2">
                  <button className="p-2 text-[#9A9AA5] hover:text-[#F2F2F5] transition-colors" title="Tool Settings">
                     <MoreHorizontal size={20} />
                  </button>
                  <button 
                    onClick={handleSend}
                    disabled={!connected || isTyping || !input.trim()}
                    className="p-2 bg-gradient-to-r from-[#7B5CFA] to-[#4C2FCB] text-white rounded-[8px] disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.03] hover:shadow-[0_0_24px_rgba(123,92,250,0.35)]"
                  >
                     <Send size={18} />
                  </button>
               </div>
            </div>
            <div className="text-center mt-3">
               <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#696974] font-semibold">
                 MCP-ready local chat <span className="text-[#C8BEFF]">&bull; Live model API key not configured</span>
               </p>
            </div>
         </div>
      </div>
    </div>
  );
}
