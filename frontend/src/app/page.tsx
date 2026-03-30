"use client";

import Link from "next/link";
import { Brain, ArrowRight, Database, Server, Zap, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-black/90">
      {/* Background Effects */}
      <div className="absolute top-[20%] left-[20%] w-96 h-96 bg-green-500/20 rounded-full blur-[120px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-[20%] right-[20%] w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] -z-10 animate-pulse animation-delay-2000"></div>
      
      {/* Navigation */}
      <nav className="absolute top-0 w-full p-6 lg:px-12 flex items-center justify-between z-50">
         <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.3)]">
              <Brain className="text-white w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tighter">Neuro<span className="text-green-500">Base</span></h1>
         </div>
         <Link href="/dashboard" className="px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-white font-bold text-sm tracking-widest uppercase hover:bg-white/10 transition-all backdrop-blur-md">
            Enter App
         </Link>
      </nav>

      {/* Hero Content */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 w-full max-w-5xl mx-auto z-10 pt-20">
         <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold capitalize tracking-widest mb-8 animate-in slide-in-from-bottom-4 duration-700">
            <Zap size={14} className="animate-pulse" /> Live on Shelby Protocol
         </div>
         
         <h2 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.1] mb-8 animate-in slide-in-from-bottom-8 duration-700 delay-100 text-white">
            Monetize Your <br className="hidden md:block"/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">Cognitive Assets</span>
         </h2>
         
         <p className="text-lg md:text-xl text-gray-400 max-w-2xl font-medium leading-relaxed mb-12 animate-in slide-in-from-bottom-8 duration-700 delay-200">
            Upload your personal knowledge bases to scalable decentralized storage. Earn instant APT micropayments every time an AI agent queries your mind.
         </p>

         <div className="flex flex-col sm:flex-row items-center gap-6 animate-in slide-in-from-bottom-8 duration-700 delay-300">
            <Link 
               href="/dashboard" 
               className="group relative inline-flex items-center justify-center gap-3 bg-green-500 px-10 py-5 rounded-2xl text-black font-black text-lg tracking-widest uppercase overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(34,197,94,0.4)]"
            >
               <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform"></div>
               <span className="relative z-10">Start Earning</span> 
               <ArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <a 
               href="/docs" 
               className="px-10 py-5 rounded-2xl text-white font-bold text-lg tracking-widest border border-white/10 hover:bg-white/5 transition-all flex items-center gap-2 group"
            >
               Learn More <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-y-1 group-hover:-rotate-45 transition-all" />
            </a>
         </div>

         {/* Feature Highlights Grid */}
         <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 w-full text-left animate-in fade-in duration-1000 delay-500 pb-20">
            <div className="glass-card p-8 border border-white/5 hover:border-green-500/30 transition-colors">
               <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center text-green-400 mb-6">
                  <Database size={24} />
               </div>
               <h3 className="text-xl font-bold text-white mb-3">On-Chain Memory</h3>
               <p className="text-sm text-gray-400 leading-relaxed font-medium">Your data is erasure-coded and permanently stored on the Shelby Protocol, verifiable via Aptos smart contracts.</p>
            </div>
            
            <div className="glass-card p-8 border border-white/5 hover:border-blue-500/30 transition-colors">
               <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 mb-6">
                  <Server size={24} />
               </div>
               <h3 className="text-xl font-bold text-white mb-3">Agent Compatibility</h3>
               <p className="text-sm text-gray-400 leading-relaxed font-medium">Connect external AI bots and assistants instantly via our MCP layer to retrieve your verified knowledge packs.</p>
            </div>
            
            <div className="glass-card p-8 border border-white/5 hover:border-purple-500/30 transition-colors">
               <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400 mb-6">
                  <ShieldCheck size={24} />
               </div>
               <h3 className="text-xl font-bold text-white mb-3">Instant Royalties</h3>
               <p className="text-sm text-gray-400 leading-relaxed font-medium">Smart contracts enforce strict access controls. You receive automated Aptos payouts directly to your wallet on every read.</p>
            </div>
         </div>
      </main>
    </div>
  );
}
