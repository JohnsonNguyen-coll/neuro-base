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
        <div className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[#5EE7DF]">
          <Monitor size={14} /> System Preferences
        </div>
        <h2 className="text-4xl font-semibold tracking-[-0.045em] text-[#F2F2F5]">Security Settings</h2>
        <p className="text-[#9A9AA5] max-w-xl leading-[1.7]">Manage your profile, API keys, and decentralized storage preferences for your NeuroBase instance.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
         {/* Settings Navigation Navigation */}
         <div className="lg:col-span-1 space-y-2">
            <button className="w-full flex items-center gap-3 p-3 rounded-[10px] bg-[#7B5CFA]/12 border border-[#7B5CFA]/30 text-[#F2F2F5] font-semibold transition-all text-sm">
               <User size={18} className="text-[#C8BEFF]" /> Profile Details
            </button>
            <button className="w-full flex items-center gap-3 p-3 rounded-[10px] hover:bg-white/[0.045] text-[#9A9AA5] hover:text-[#F2F2F5] font-semibold transition-all text-sm text-left">
               <Key size={18} /> API & Integration
            </button>
            <button className="w-full flex items-center gap-3 p-3 rounded-[10px] hover:bg-white/[0.045] text-[#9A9AA5] hover:text-[#F2F2F5] font-semibold transition-all text-sm text-left">
               <Database size={18} /> AI Model Config
            </button>
            <button className="w-full flex items-center gap-3 p-3 rounded-[10px] hover:bg-white/[0.045] text-[#9A9AA5] hover:text-[#F2F2F5] font-semibold transition-all text-sm text-left">
               <Globe size={18} /> Network & Storage
            </button>
            <button className="w-full flex items-center gap-3 p-3 rounded-[10px] hover:bg-white/[0.045] text-[#9A9AA5] hover:text-[#F2F2F5] font-semibold transition-all text-sm text-left">
               <Bell size={18} /> Notifications
            </button>
         </div>

         {/* Settings Content */}
         <div className="lg:col-span-3 space-y-8">
            <div className="glass-card p-8 border border-white/5 space-y-8">
               <div className="flex items-center gap-4 border-b border-white/[0.08] pb-6">
                  <div className="w-20 h-20 rounded-[10px] bg-gradient-to-br from-[#7B5CFA]/20 to-[#5EE7DF]/10 border border-white/[0.08] flex items-center justify-center">
                     <span className="text-2xl font-semibold text-[#F2F2F5]">{connected ? "NB" : "??"}</span>
                  </div>
                  <div>
                     <h3 className="text-2xl font-semibold tracking-[-0.035em]">{connected ? getShortAddress(String(account?.address)) : "Guest User"}</h3>
                     <p className="text-[#9A9AA5] text-sm">{connected ? "NeuroBase Member" : "Please connect wallet"}</p>
                     {connected && (
                       <button className="text-[#C8BEFF] hover:text-[#F2F2F5] text-xs font-semibold mt-2 transition-colors">
                          Change Avatar
                       </button>
                     )}
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                     <label className="font-mono text-xs font-semibold text-[#9A9AA5] uppercase tracking-[0.18em]">Display Name</label>
                     <input 
                        type="text" 
                        defaultValue={connected ? "My Agent Profile" : ""}
                        disabled={!connected}
                        className="w-full bg-white/[0.035] border border-white/[0.08] rounded-[10px] px-4 py-3 text-[#F2F2F5] outline-none focus:border-[#7B5CFA]/55 focus:ring-2 focus:ring-[#7B5CFA]/20 transition-all font-medium disabled:opacity-50"
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="font-mono text-xs font-semibold text-[#9A9AA5] uppercase tracking-[0.18em]">Aptos Address</label>
                     <input 
                        type="text" 
                        value={connected ? getFullAddress(String(account?.address)) : "Not connected"} 
                        disabled
                        className="w-full bg-white/[0.025] border border-white/[0.08] rounded-[10px] px-4 py-3 text-[#696974] outline-none cursor-not-allowed font-medium font-mono text-xs"
                     />
                  </div>
               </div>

               <div className="space-y-2">
                 <label className="font-mono text-xs font-semibold text-[#9A9AA5] uppercase tracking-[0.18em]">Bio & Expertise</label>
                 <textarea 
                    rows={4}
                    defaultValue={connected ? "Decentralized app developer bridging the gap between LLMs and on-chain verified data sources." : ""}
                    disabled={!connected}
                    className="w-full bg-white/[0.035] border border-white/[0.08] rounded-[10px] px-4 py-3 text-[#F2F2F5] outline-none focus:border-[#7B5CFA]/55 focus:ring-2 focus:ring-[#7B5CFA]/20 transition-all font-medium resize-none leading-[1.7] disabled:opacity-50"
                 ></textarea>
                 <p className="text-xs text-[#696974]">This will be displayed on your custom memory marketplace packs.</p>
               </div>
            </div>

            <div className={`glass-card p-8 border border-white/5 space-y-6 ${!connected ? 'opacity-50 grayscale pointer-events-none' : ''}`}>
               <div className="flex items-center gap-3 mb-2">
                  <Shield size={20} className="text-[#5EE7DF]" />
                  <h3 className="text-xl font-semibold tracking-[-0.025em]">Access Controls</h3>
               </div>
               <p className="text-sm text-[#9A9AA5] leading-[1.7] mb-6">
                 Determine who holds permission to query your decentralized Memory Blobs. 
                 Agent purchases through the marketplace will bypass these restrictions automatically.
               </p>

               <div className="space-y-4">
                  <label className="flex items-center justify-between p-4 bg-white/[0.035] rounded-[10px] border border-white/[0.08] cursor-pointer hover:bg-white/[0.06] transition-all">
                     <div>
                        <p className="font-semibold text-[#F2F2F5]">Publicly Indexable</p>
                        <p className="text-xs text-[#696974] mt-1">Allow any agent or platform to discover your packs.</p>
                     </div>
                     <div className="w-12 h-6 bg-[#7B5CFA]/20 rounded-full flex items-center p-1 border border-[#7B5CFA]/45 relative">
                        <div className="w-4 h-4 rounded-full bg-[#C8BEFF] absolute right-1 shadow-[0_0_16px_rgba(123,92,250,0.55)]"></div>
                     </div>
                  </label>

                  <label className="flex items-center justify-between p-4 bg-white/[0.035] rounded-[10px] border border-white/[0.08] cursor-pointer hover:bg-white/[0.06] transition-all">
                     <div>
                        <p className="font-semibold text-[#F2F2F5]">Require KYC Agent Signatures</p>
                        <p className="text-xs text-[#696974] mt-1">Only verified AI bots can purchase access.</p>
                     </div>
                     <div className="w-12 h-6 bg-[#0A0A0B]/70 rounded-full flex items-center p-1 border border-white/[0.08] relative">
                        <div className="w-4 h-4 rounded-full bg-[#696974] absolute left-1"></div>
                     </div>
                  </label>
               </div>
            </div>

            <div className="flex justify-end gap-4 mt-8">
               <button className="px-6 py-3 rounded-[10px] border border-white/[0.08] text-[#9A9AA5] font-semibold hover:text-[#F2F2F5] hover:bg-white/[0.045] transition-all text-sm disabled:opacity-50" disabled={!connected}>
                  Cancel Changes
               </button>
               <button className="neuro-btn px-8 py-3 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed" disabled={!connected}>
                  Save Preferences
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
