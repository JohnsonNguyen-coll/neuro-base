"use client";

import { User, Key, Database, Shield, Monitor, Globe, Bell } from "lucide-react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

export default function Settings() {
  const { connected, account } = useWallet();

  const getShortAddress = (addr: string | undefined) => {
    if (!addr) return "Not connected";
    return addr.slice(0, 6) + "..." + addr.slice(-4);
  };

  const getFullAddress = (addr: string | undefined) => {
    if (!addr) return "Not connected";
    return addr;
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <header className="space-y-4">
        <div className="flex items-center gap-2 text-green-400 font-bold tracking-tighter capitalize text-xs">
          <Monitor size={14} /> System Preferences
        </div>
        <h2 className="text-4xl font-extrabold tracking-tight">Account <span className="text-green-500">Settings</span></h2>
        <p className="text-gray-400 max-w-xl">Manage your profile, API keys, and decentralized storage preferences for your NeuroBase instance.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
         {/* Settings Navigation Navigation */}
         <div className="lg:col-span-1 space-y-2">
            <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold transition-all text-sm">
               <User size={18} className="text-green-400" /> Profile Details
            </button>
            <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white font-bold transition-all text-sm text-left">
               <Key size={18} /> API & Integration
            </button>
            <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white font-bold transition-all text-sm text-left">
               <Database size={18} /> AI Model Config
            </button>
            <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white font-bold transition-all text-sm text-left">
               <Globe size={18} /> Network & Storage
            </button>
            <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white font-bold transition-all text-sm text-left">
               <Bell size={18} /> Notifications
            </button>
         </div>

         {/* Settings Content */}
         <div className="lg:col-span-3 space-y-8">
            <div className="glass-card p-8 border border-white/5 space-y-8">
               <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center">
                     <span className="text-2xl font-black text-white">{connected ? "NB" : "??"}</span>
                  </div>
                  <div>
                     <h3 className="text-2xl font-bold">{connected ? getShortAddress(String(account?.address)) : "Guest User"}</h3>
                     <p className="text-gray-400 text-sm">{connected ? "NeuroBase Member" : "Please connect wallet"}</p>
                     {connected && (
                       <button className="text-green-400 hover:text-green-300 text-xs font-bold mt-2 transition-colors">
                          Change Avatar
                       </button>
                     )}
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                     <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Display Name</label>
                     <input 
                        type="text" 
                        defaultValue={connected ? "My Agent Profile" : ""}
                        disabled={!connected}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-green-500/50 transition-all font-medium disabled:opacity-50"
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Aptos Address</label>
                     <input 
                        type="text" 
                        value={connected ? getFullAddress(String(account?.address)) : "Not connected"} 
                        disabled
                        className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-gray-500 outline-none cursor-not-allowed font-medium font-mono text-xs"
                     />
                  </div>
               </div>

               <div className="space-y-2">
                 <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Bio & Expertise</label>
                 <textarea 
                    rows={4}
                    defaultValue={connected ? "Decentralized app developer bridging the gap between LLMs and on-chain verified data sources." : ""}
                    disabled={!connected}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-green-500/50 transition-all font-medium resize-none leading-relaxed disabled:opacity-50"
                 ></textarea>
                 <p className="text-xs text-gray-500">This will be displayed on your custom memory marketplace packs.</p>
               </div>
            </div>

            <div className={`glass-card p-8 border border-white/5 space-y-6 ${!connected ? 'opacity-50 grayscale pointer-events-none' : ''}`}>
               <div className="flex items-center gap-3 mb-2">
                  <Shield size={20} className="text-green-400" />
                  <h3 className="text-xl font-bold">Access Controls</h3>
               </div>
               <p className="text-sm text-gray-400 leading-relaxed mb-6">
                 Determine who holds permission to query your decentralized Memory Blobs. 
                 Agent purchases through the marketplace will bypass these restrictions automatically.
               </p>

               <div className="space-y-4">
                  <label className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 cursor-pointer hover:bg-white/10 transition-all">
                     <div>
                        <p className="font-bold text-white">Publicly Indexable</p>
                        <p className="text-xs text-gray-500 mt-1">Allow any agent or platform to discover your packs.</p>
                     </div>
                     <div className="w-12 h-6 bg-green-500/20 rounded-full flex items-center p-1 border border-green-500/50 relative">
                        <div className="w-4 h-4 rounded-full bg-green-400 absolute right-1"></div>
                     </div>
                  </label>

                  <label className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 cursor-pointer hover:bg-white/10 transition-all">
                     <div>
                        <p className="font-bold text-white">Require KYC Agent Signatures</p>
                        <p className="text-xs text-gray-500 mt-1">Only verified AI bots can purchase access.</p>
                     </div>
                     <div className="w-12 h-6 bg-black/50 rounded-full flex items-center p-1 border border-white/10 relative">
                        <div className="w-4 h-4 rounded-full bg-gray-500 absolute left-1"></div>
                     </div>
                  </label>
               </div>
            </div>

            <div className="flex justify-end gap-4 mt-8">
               <button className="px-6 py-3 rounded-xl border border-white/10 text-gray-400 font-bold hover:text-white hover:bg-white/5 transition-all text-sm disabled:opacity-50" disabled={!connected}>
                  Cancel Changes
               </button>
               <button className="neuro-btn px-8 py-3 text-sm font-bold shadow-lg shadow-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed" disabled={!connected}>
                  Save Preferences
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
