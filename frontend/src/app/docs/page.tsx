"use client";

import Link from "next/link";
import { Brain, ArrowLeft, BookOpen, Layers, Zap, ShieldCheck, FileJson, Link as LinkIcon, Database } from "lucide-react";

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-black/95 text-white animate-in fade-in duration-700">
      {/* Background Effects */}
      <div className="fixed top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-green-500/10 rounded-full blur-[150px] -z-10"></div>
      
      {/* Header */}
      <header className="fixed top-0 w-full border-b border-white/10 bg-black/50 backdrop-blur-xl z-50">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
             <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center">
               <Brain className="text-white w-6 h-6" />
             </div>
             <h1 className="text-xl font-bold tracking-tighter">Neuro<span className="text-green-500">Base</span> Docs</h1>
          </div>
          <Link href="/" className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-white transition-colors">
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>
      </header>

      {/* Docs Content */}
      <main className="pt-32 pb-24 max-w-4xl mx-auto px-6 space-y-16">
        
        {/* Intro */}
        <section className="space-y-6">
           <div className="inline-flex items-center gap-2 text-green-400 font-bold tracking-tighter capitalize text-xs bg-green-500/10 px-3 py-1.5 rounded-full border border-green-500/20">
              <BookOpen size={14} /> Documentation & Technical Overview
           </div>
           <h2 className="text-4xl md:text-5xl font-black tracking-tighter">Introduction to NeuroBase</h2>
           <p className="text-xl text-gray-400 leading-relaxed max-w-2xl font-medium">
             NeuroBase is a decentralized cognitive asset marketplace and storage layer, built on top of the 
             <span className="text-white font-bold ml-1">Shelby Protocol</span> and 
             <span className="text-white font-bold ml-1">Aptos Blockchain</span>.
           </p>
        </section>

        <hr className="border-white/10" />

        {/* Core Concepts */}
        <section className="space-y-10">
           <h3 className="text-3xl font-bold tracking-tighter flex items-center gap-3">
              <Layers className="text-green-500" /> Core Concepts
           </h3>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="glass-card p-8 border border-white/10 space-y-4 hover:border-green-500/50 transition-colors">
                 <Database className="w-8 h-8 text-green-400" />
                 <h4 className="text-xl font-bold">Verifiable Memory Blobs</h4>
                 <p className="text-gray-400 text-sm leading-relaxed">
                   Instead of relying on centralized databases (AWS, GCP), user files (JSON, PDF, Text) are erasure-coded and written to decentralised nodes via Shelby Protocol. This makes your AI memory fault-tolerant and censorship-resistant.
                 </p>
              </div>
              <div className="glass-card p-8 border border-white/10 space-y-4 hover:border-blue-500/50 transition-colors">
                 <LinkIcon className="w-8 h-8 text-blue-400" />
                 <h4 className="text-xl font-bold">MCP Layer (Model Context Protocol)</h4>
                 <p className="text-gray-400 text-sm leading-relaxed">
                   NeuroBase natively supports Anthropic's emerging MCP standard. AI agents can seamlessly "hook" into your decentralized brain and retrieve specific context only when an on-chain payment is completed.
                 </p>
              </div>
           </div>
        </section>

        {/* Workflow */}
        <section className="space-y-8">
           <h3 className="text-3xl font-bold tracking-tighter flex items-center gap-3">
              <Zap className="text-yellow-500" /> The Workflow
           </h3>
           <div className="glass-card p-8 border border-white/10">
              <ol className="space-y-8 relative before:absolute before:inset-y-0 before:left-4 before:w-0.5 before:bg-white/10">
                 <li className="relative pl-12">
                    <div className="absolute left-0 w-8 h-8 bg-black border-2 border-green-500 rounded-full flex items-center justify-center text-xs font-bold text-green-500 z-10">1</div>
                    <h4 className="text-lg font-bold mb-2">Upload & Commit</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">A user uploads an expertise file (e.g. `trading_strategies.json`). The web app generates an erasure-coding commitment and registers the Blob Merkle Root on Aptos (Shelby L1).</p>
                 </li>
                 <li className="relative pl-12">
                    <div className="absolute left-0 w-8 h-8 bg-black border-2 border-green-500 rounded-full flex items-center justify-center text-xs font-bold text-green-500 z-10">2</div>
                    <h4 className="text-lg font-bold mb-2">Marketplace Registration</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">The file is registered on the NeuroBase `Registry` smart contract, assigning a query price (e.g., 0.1 APT / Read).</p>
                 </li>
                 <li className="relative pl-12">
                    <div className="absolute left-0 w-8 h-8 bg-black border-2 border-green-500 rounded-full flex items-center justify-center text-xs font-bold text-green-500 z-10">3</div>
                    <h4 className="text-lg font-bold mb-2">Agent Query & Payment</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">An Agent discovers the Knowledge Pack on the Marketplace, signs a Move Transfer transaction via the SDK, and decrypts the memory natively into its context window.</p>
                 </li>
              </ol>
           </div>
        </section>

        {/* API Reference */}
        <section className="space-y-8">
           <h3 className="text-3xl font-bold tracking-tighter flex items-center gap-3">
              <FileJson className="text-purple-500" /> MCP Toolkit (For Bots)
           </h3>
           <p className="text-gray-400 font-medium">Any compliant AI bot can utilize the NeuroBase MCP API:</p>
           
           <div className="bg-black border border-white/10 rounded-2xl overflow-hidden font-mono text-sm">
              <div className="bg-white/5 px-4 py-2 border-b border-white/10 text-gray-400 flex justify-between">
                <span>POST /api/mcp/query</span>
                <span>TypeScript Interface</span>
              </div>
              <pre className="p-6 text-green-400/90 overflow-x-auto leading-relaxed">
{`interface MCPQueryRequest {
  agent_id: string;
  blob_id: string;
  signature: string; // Payload signed with Agent's Aptos Wallet
  query_context: string;
}

// Response
{
  "status": "success",
  "tx_hash": "0xabc...",
  "data": "Decrypted contents of the memory blob..."
}`}
              </pre>
           </div>
        </section>

        {/* Footer actions */}
        <section className="pt-8 border-t border-white/10 flex items-center justify-between">
            <Link href="/dashboard" className="neuro-btn px-8 py-4 font-bold tracking-widest text-sm flex items-center gap-2">
               Try NeuroBase Now <ArrowLeft className="rotate-180 w-4 h-4" />
            </Link>
            <a href="https://github.com/JohnsonNguyen-coll/neuro-base" target="_blank" className="text-gray-500 hover:text-white transition-colors font-bold text-sm tracking-widest">
               View on GitHub
            </a>
        </section>
        
      </main>
    </div>
  );
}
