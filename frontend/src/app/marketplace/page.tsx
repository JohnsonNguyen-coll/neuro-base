"use client";

import { ShoppingBag, Star, User, Unlock, Tag, Search, TrendingUp, Database, Zap, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { ShelbyClient } from "@shelby-protocol/sdk/browser";

export default function Marketplace() {
  const [memories, setMemories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { connected, account, signAndSubmitTransaction } = useWallet();
  const [purchasing, setPurchasing] = useState<string | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const OWNER_ADDR = "0xbbccc9904b0303aada1eeaa2876a27545a79384e3a0914e59bb5d8118d3163fe"; // Admin / Global Registry Addr for now

  const fetchMemories = async () => {
    setLoading(true);
    try {
      const res = await fetch(`https://api.shelbynet.shelby.xyz/v1/accounts/${OWNER_ADDR}/resource/${OWNER_ADDR}::neurobase::Registry`);
      if (res.ok) {
        const data = await res.json();
        const parsedBlobs = data.data.blobs.map((blob: any) => {
          let hex = blob.blob_id;
          if (hex.startsWith('0x')) hex = hex.slice(2);
          let name = "";
          for (let i = 0; i < hex.length; i += 2) {
            name += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
          }
          const cleanName = name.split('/').pop() || name;
          const rawPrice = parseInt(blob.price_per_read) / 100000000;
          return {
            id: blob.blob_id,
            fullName: name,
            name: cleanName,
            price: rawPrice === 0 ? "Free" : rawPrice.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 5 }) + " APT",
            rawPrice: rawPrice,
            accessed: blob.access_count,
            author: OWNER_ADDR.slice(0, 6) + "..." + OWNER_ADDR.slice(-4),
            category: "Knowledge",
            image_color: "bg-[#7B5CFA]/10"
          };
        });
        setMemories(parsedBlobs);
      }
    } catch (err) {
      console.error("Failed to fetch marketplace packs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemories();
  }, []);

  const handleBuy = async (pack: any) => {
    if (!connected || !account) {
      alert("Please connect your wallet first");
      return;
    }

    try {
      setPurchasing(pack.id);
      let amountInOctas = Math.floor(pack.rawPrice * 100000000);

      const payload = {
        data: {
          function: "0x1::aptos_account::transfer",
          typeArguments: [],
          functionArguments: [
            OWNER_ADDR,
            amountInOctas
          ]
        }
      };

      const response = await signAndSubmitTransaction(payload as any);
      alert(`Payment successful! TX: ${response.hash}\nYou can now access this pack.`);
    } catch (error: any) {
      console.error("Payment failed", error);
      alert("Payment failed: " + (error?.message || "User rejected"));
    } finally {
      setPurchasing(null);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(memories.length / itemsPerPage);
  const currentMemories = memories.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Marketplace Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[#5EE7DF]">
            <TrendingUp size={14} /> Global Registry
          </div>
          <h2 className="text-4xl font-semibold tracking-[-0.045em] text-[#F2F2F5]">Encrypted Memory Marketplace</h2>
          <p className="text-[#9A9AA5] max-w-xl leading-[1.7]">Enrich your AI agent by purchasing access to verified, high-quality memory packs.</p>
        </div>

        <div className="flex bg-white/[0.035] p-1 rounded-[10px] border border-white/[0.08] w-full md:w-80 focus-within:border-[#7B5CFA]/45 focus-within:ring-2 focus-within:ring-[#7B5CFA]/15 transition">
          <div className="p-2 text-[#696974]">
             <Search size={20} />
          </div>
          <input 
            type="text" 
            placeholder="Search expertise..." 
            className="bg-transparent border-none outline-none text-sm w-full py-2 pr-4 text-[#F2F2F5] placeholder-[#696974]"
          />
        </div>
      </header>

      {/* Featured Packs Grid */}
      <section className="space-y-8">
        {loading && <div className="text-[#9A9AA5] font-semibold animate-pulse flex items-center gap-2"><Zap size={16} className="text-[#5EE7DF]" /> Fetching on-chain memories...</div>}
        {!loading && memories.length === 0 && <div className="text-[#696974] text-sm">No memory packs found on chain.</div>}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentMemories.map((pack, index) => (
            <div key={`${pack.id}-${index}`} className="glass-card flex flex-col group overflow-hidden border border-white/[0.08] hover:border-[#7B5CFA]/35 transition-all duration-300">
               {/* Card Cover */}
               <div className={`h-40 ${pack.image_color} relative overflow-hidden`}>
                  <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:scale-110 transition-all duration-700">
                     <Database size={80} />
                  </div>
                  <div className="absolute top-4 left-4">
                     <span className="bg-[#0A0A0B]/70 backdrop-blur-md px-3 py-1 rounded-full font-mono text-[10px] font-semibold text-[#F2F2F5] capitalize tracking-widest border border-white/[0.08]">
                      {pack.category}
                     </span>
                  </div>
               </div>

               {/* Card Body */}
               <div className="p-6 space-y-4 flex-1 flex flex-col">
                  <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-[#9A9AA5]">
                         <User size={12} /> {pack.author}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-[#5EE7DF] font-semibold">
                         Accessed {pack.accessed} times
                      </div>
                  </div>

                  <div className="space-y-2 flex-1">
                     <h4 className="text-xl font-semibold tracking-[-0.025em] group-hover:text-[#C8BEFF] transition-all truncate">{pack.name}</h4>
                     <p className="font-mono text-xs text-[#9A9AA5] break-all">{pack.fullName}</p>
                  </div>

                  <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
                     <div>
                        <p className="font-mono text-[10px] text-[#696974] uppercase font-semibold tracking-widest mb-1">Access Fee</p>
                        <p className="text-lg font-semibold text-[#F2F2F5]">{pack.price}</p>
                     </div>
                     <button 
                       onClick={() => handleBuy(pack)}
                       disabled={purchasing === pack.id}
                       className="neuro-btn !p-3 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                        <Unlock size={18} /> {purchasing === pack.id ? 'Buying...' : 'Buy Access'}
                     </button>
                  </div>
               </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 pt-6">
             <button 
               onClick={prevPage} 
               disabled={currentPage === 1}
               className="p-3 rounded-[10px] bg-white/[0.035] border border-white/[0.08] text-[#F2F2F5] hover:bg-white/[0.06] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
             >
               <ChevronLeft size={20} />
             </button>
             <div className="text-sm font-semibold text-[#9A9AA5]">
                Page <span className="text-[#F2F2F5]">{currentPage}</span> of <span className="text-[#F2F2F5]">{totalPages}</span>
             </div>
             <button 
               onClick={nextPage} 
               disabled={currentPage === totalPages}
               className="p-3 rounded-[10px] bg-white/[0.035] border border-white/[0.08] text-[#F2F2F5] hover:bg-white/[0.06] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
             >
               <ChevronRight size={20} />
             </button>
          </div>
        )}
      </section>

      {/* Sell Your Own Hint */}
      <section className="glass-card p-10 bg-[#7B5CFA]/[0.06] border border-[#7B5CFA]/25 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-white/[0.035] flex items-center justify-center mx-auto text-[#5EE7DF] border border-white/[0.08]">
             <Tag size={28} />
          </div>
          <h3 className="text-2xl font-semibold tracking-[-0.035em]">Have Expertise to Share?</h3>
          <p className="text-[#9A9AA5] max-w-lg mx-auto leading-[1.7]">Upload your files via the My Brain dashboard. They will automatically be listed here for AI agents to query.</p>
      </section>
    </div>
  );
}
