"use client";

import { Wallet, Activity, RefreshCcw, DollarSign, Database, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

export default function Earnings() {
  const [loading, setLoading] = useState(false);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [totalCalls, setTotalCalls] = useState(0);
  const [incomeStreams, setIncomeStreams] = useState<any[]>([]);

  const { connected, account } = useWallet();
  const MODULE_ADDR = "0xbbccc9904b0303aada1eeaa2876a27545a79384e3a0914e59bb5d8118d3163fe";

  const fetchEarningsData = async () => {
    if (!connected || !account) {
        setIncomeStreams([]);
        setTotalEarnings(0);
        setTotalCalls(0);
        return;
    }

    setLoading(true);
    const userAddress = account.address;

    try {
      const res = await fetch(`https://api.shelbynet.shelby.xyz/v1/accounts/${userAddress}/resource/${MODULE_ADDR}::neurobase::Registry`);
      if (res.ok) {
        const data = await res.json();
        let totalVal = 0;
        let calls = 0;
        const streams = data.data.blobs.map((blob: any) => {
          let hex = blob.blob_id;
          if (hex.startsWith('0x')) hex = hex.slice(2);
          let name = "";
          for (let i = 0; i < hex.length; i += 2) {
            name += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
          }
          const cleanName = name.split('/').pop() || name;
          const rawPrice = parseInt(blob.price_per_read) / 100000000;
          const accessed = parseInt(blob.access_count);
          
          const earned = rawPrice * accessed;
          totalVal += earned;
          calls += accessed;

          return {
            id: blob.blob_id,
            name: cleanName,
            price: rawPrice,
            accessed: accessed,
            earned: earned
          };
        }).filter((s: any) => s.accessed >= 0); // Include all blobs but highlight ones with calls

        setTotalEarnings(totalVal);
        setTotalCalls(calls);
        setIncomeStreams(streams);
      } else {
        setIncomeStreams([]);
        setTotalEarnings(0);
        setTotalCalls(0);
      }
    } catch (err) {
      console.error("Failed to fetch earnings", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarningsData();
  }, [connected, account]);

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <header className="space-y-4">
        <div className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[#5EE7DF]">
          <Activity size={14} /> Revenue Tracking
        </div>
        <h2 className="text-4xl font-semibold tracking-[-0.045em] text-[#F2F2F5]">Confidential Revenue</h2>
        <p className="text-[#9A9AA5] max-w-xl leading-[1.7]">Monitor your on-chain revenue generated from AI agents accessing your verifiable memory packs.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 flex flex-col justify-between border border-white/5 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#7B5CFA]/12 rounded-full blur-2xl group-hover:bg-[#7B5CFA]/18 transition-all"></div>
          <div className="flex items-center gap-3 text-[#9A9AA5] mb-4">
             <div className="p-2 bg-white/[0.035] rounded-[8px] border border-white/[0.08]">
                <Wallet size={20} className="text-[#C8BEFF]" />
             </div>
             <span className="font-bold text-sm tracking-widest capitalize">Available Balance</span>
          </div>
          <div className="space-y-1">
             <p className="text-4xl font-semibold tracking-[-0.04em]">{totalEarnings.toFixed(4)} <span className="text-base text-[#696974] font-semibold">APT</span></p>
             <p className="text-xs text-[#C8BEFF] flex items-center gap-1 font-semibold">Accumulated from packs</p>
          </div>
        </div>

        <div className="glass-card p-6 flex flex-col justify-between border border-white/5 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#5EE7DF]/10 rounded-full blur-2xl group-hover:bg-[#5EE7DF]/16 transition-all"></div>
          <div className="flex items-center gap-3 text-[#9A9AA5] mb-4">
             <div className="p-2 bg-white/[0.035] rounded-[8px] border border-white/[0.08]">
                <RefreshCcw size={20} className="text-[#5EE7DF]" />
             </div>
             <span className="font-bold text-sm tracking-widest capitalize">Total Volume</span>
          </div>
          <div className="space-y-1">
             <p className="text-4xl font-semibold tracking-[-0.04em]">{totalEarnings.toFixed(4)} <span className="text-base text-[#696974] font-semibold">APT</span></p>
             <p className="text-xs text-[#5EE7DF] flex items-center gap-1 font-semibold">Lifetime processed</p>
          </div>
        </div>

        <div className="glass-card p-6 flex flex-col justify-between border border-white/5 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#7B5CFA]/12 rounded-full blur-2xl group-hover:bg-[#7B5CFA]/18 transition-all"></div>
          <div className="flex items-center gap-3 text-[#9A9AA5] mb-4">
             <div className="p-2 bg-white/[0.035] rounded-[8px] border border-white/[0.08]">
                <Activity size={20} className="text-[#C8BEFF]" />
             </div>
             <span className="font-bold text-sm tracking-widest capitalize">Agent Calls</span>
          </div>
          <div className="space-y-1">
             <p className="text-4xl font-semibold tracking-[-0.04em]">{totalCalls}</p>
             <p className="text-xs text-[#C8BEFF] flex items-center gap-1 font-semibold">Total queries to your knowledge</p>
          </div>
        </div>
      </div>

      {/* Transaction History & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xl font-bold tracking-tight">Revenue Streams</h3>
            <div className="glass-card border border-white/5 overflow-hidden min-h-[200px]">
               {loading && <div className="p-8 text-center text-[#9A9AA5] font-semibold flex items-center justify-center gap-2"><Zap size={16} className="animate-pulse text-[#5EE7DF]" /> Consulting on-chain data...</div>}
               {!loading && incomeStreams.length === 0 && (
                  <div className="p-8 text-center text-[#696974] text-sm">No active earnings yet. Upload packs and share them to start earning APT.</div>
               )}
               <div className="divide-y divide-white/5">
                  {incomeStreams.map((stream) => (
                    <div key={stream.id} className="p-4 md:p-6 flex items-center justify-between hover:bg-white/5 transition-all group">
                       <div className="flex items-center gap-4">
                          <div className={'p-3 rounded-[10px] border border-white/[0.08] bg-[#7B5CFA]/12 text-[#5EE7DF] group-hover:scale-110 transition-transform'}>
                             <Database size={20} />
                          </div>
                          <div>
                             <p className="font-semibold text-sm md:text-base text-[#F2F2F5]">{stream.name}</p>
                             <p className="text-xs text-[#696974] flex items-center gap-2">
                                <span className="text-[#9A9AA5]">Memory Pack</span> &bull; {stream.accessed} accesses
                             </p>
                          </div>
                       </div>
                       <div className={'font-semibold tracking-tight text-[#C8BEFF] flex flex-col items-end'}>
                          <span>+{stream.earned.toFixed(4)} APT</span>
                          <span className="font-mono text-[10px] text-[#696974] font-normal">({stream.price} APT / query)</span>
                       </div>
                    </div>
                  ))}
               </div>
               {incomeStreams.length > 0 && (
                 <div className="p-4 bg-white/5 text-center text-sm font-bold text-gray-400 hover:text-white cursor-pointer transition-colors border-t border-white/5">
                    View Full History on Account Explorer
                 </div>
               )}
            </div>
         </div>

         <div className="space-y-6">
            <h3 className="text-xl font-bold tracking-tight">Quick Actions</h3>
            <div className="glass-card p-6 border border-white/5 space-y-6">
               <div className="space-y-2">
                  <label className="font-mono text-xs font-semibold text-[#696974] tracking-[0.18em] uppercase">Withdraw Amount</label>
                  <div className="flex bg-white/[0.035] p-1 rounded-[10px] border border-white/[0.08] relative focus-within:border-[#7B5CFA]/45 focus-within:ring-2 focus-within:ring-[#7B5CFA]/15">
                     <div className="p-3 text-[#696974]">
                        <DollarSign size={20} />
                     </div>
                     <input 
                        type="number" 
                        placeholder="0.00" 
                        className="bg-transparent border-none outline-none text-xl font-semibold w-full py-2 pr-16 text-[#F2F2F5] placeholder-[#696974]"
                     />
                     <button className="absolute right-2 top-2 bottom-2 bg-white/10 hover:bg-white/20 px-3 rounded-lg text-xs font-bold transition-all">
                        MAX
                     </button>
                  </div>
               </div>
               <button className="neuro-btn w-full flex items-center justify-center gap-2 py-4">
                  <Wallet size={18} /> Withdraw to Aptos Wallet
               </button>
               <p className="text-xs text-center text-gray-500 leading-relaxed">
                 Withdrawals are processed instantly via Shelby Protocol smart contracts. Minimal gas fees apply.
               </p>
            </div>
         </div>
      </div>
    </div>
  );
}
