"use client";

import { Upload, PieChart, Shield, History, Plus, MoreVertical, Database, Zap, ExternalLink, Brain, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { ShelbyClient, createDefaultErasureCodingProvider, generateCommitments, ShelbyBlobClient } from "@shelby-protocol/sdk/browser";

interface ModalState {
  isOpen: boolean;
  title: string;
  message: string;
  type: "success" | "error" | "info";
}

export default function Home() {
  const [modal, setModal] = useState<ModalState>({ isOpen: false, title: "", message: "", type: "info" });
  const [memories, setMemories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { connected, account, signAndSubmitTransaction } = useWallet();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [hasRegistry, setHasRegistry] = useState(true); // Default to true until checked
  const [initializing, setInitializing] = useState(false);

  const MODULE_ADDR = "0xbbccc9904b0303aada1eeaa2876a27545a79384e3a0914e59bb5d8118d3163fe";

  const fetchMemories = async () => {
    if (!connected || !account) {
        setMemories([]);
        setLoading(false);
        return;
    }
    
    setLoading(true);
    const userAddress = account.address;
    
    try {
      // Check if Registry exists for this user
      const res = await fetch(`${process.env.NEXT_PUBLIC_APTOS_RPC_URL || 'https://api.shelbynet.shelby.xyz/v1'}/accounts/${userAddress}/resource/${MODULE_ADDR}::neurobase::Registry`);
      
      if (res.ok) {
        setHasRegistry(true);
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
            price: "Free", // Since dashboard only shows owner's memories, it's free for them
            originalPrice: rawPrice === 0 ? "0 APT" : rawPrice.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 5 }) + " APT",
            accessed: blob.access_count + " times",
            owner: String(userAddress) 
          };
        });
        setMemories(parsedBlobs);
      } else if (res.status === 404) {
        setHasRegistry(false);
        setMemories([]);
      }
    } catch (err) {
      console.error("Failed to fetch memories from chain", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (connected && account) {
      fetchMemories();
    } else {
        setMemories([]);
    }
  }, [connected, account]);

  const handleInitRegistry = async () => {
    if (!connected || !account) return;
    setInitializing(true);
    try {
      const payload = {
        data: {
          function: `${MODULE_ADDR}::neurobase::init_registry`,
          typeArguments: [],
          functionArguments: []
        }
      };
      const response = await signAndSubmitTransaction(payload as any);
      console.log(`[NeuroBase UI] Registry Initialized: ${response.hash}`);
      
      setModal({
        isOpen: true,
        title: "Registry Initialized",
        message: "Your personal NeuroBase registry is now live on-chain.",
        type: "success"
      });
      
      // Refresh memory list
      setTimeout(fetchMemories, 3000);
    } catch (error: any) {
      console.error("Initialization failed", error);
      setModal({
        isOpen: true,
        title: "Initialization Failed",
        message: error?.message || "Failed to initialize registry.",
        type: "error"
      });
    } finally {
      setInitializing(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!connected || !account) {
      setModal({
        isOpen: true,
        title: "Connection Required",
        message: "Please connect your wallet first via the Sidebar.",
        type: "error"
      });
      return;
    }

    if (!hasRegistry) {
        setModal({
          isOpen: true,
          title: "Registry Required",
          message: "Please initialize your NeuroBase registry before uploading memories.",
          type: "info"
        });
        return;
    }

    setUploading(true);
    try {
      // 1. Prepare Data and Generate Commitments
      console.log(`[NeuroBase UI] Generating erasure coding commitments for ${file.name}...`);
      
      const fileBuffer = await file.arrayBuffer();
      const blobData = new Uint8Array(fileBuffer);
      const shelbyClient = new ShelbyClient({
         network: "shelbynet" as any,
      });

      const provider = await createDefaultErasureCodingProvider();
      const blobCommitments = await generateCommitments(provider, blobData);

      // 2. Register Blob on Shelby L1 Registry
      console.log("[NeuroBase UI] Asking user to sign Shelby L1 registration transaction...");
      
      const userAddressStr = String(account.address);
      
      const payload = ShelbyBlobClient.createRegisterBlobPayload({
         account: userAddressStr as any,
         blobName: file.name,
         blobSize: blobData.length,
         blobMerkleRoot: blobCommitments.blob_merkle_root,
         numChunksets: blobCommitments.chunkset_commitments.length,
         expirationMicros: Date.now() * 1000 + (365 * 24 * 60 * 60 * 1000 * 1000), // 1 year
         encoding: provider.config.enumIndex,
      });

      const response = await signAndSubmitTransaction({ data: payload } as any);
      console.log(`[NeuroBase UI] Shelby L1 Trx Hash: ${response.hash}. Waiting for confirmation...`);

      await shelbyClient.aptos.waitForTransaction({ transactionHash: response.hash });
      
      console.log(`[NeuroBase UI] Waiting for Shelby Indexer to synchronize...`);
      await new Promise(r => setTimeout(r, 4000));

      // 3. Upload actual data to Shelby Node
      console.log(`[NeuroBase UI] Uploading actual data to Shelby Node...`);
      await shelbyClient.rpc.putBlob({
         account: userAddressStr as any,
         blobName: file.name,
         blobData: blobData,
      });
      console.log(`[NeuroBase UI] File uploaded to Shelby node successfully!`);

      // 4. Register on NeuroBase Contract (Our Custom DB)
      const identifier = `${userAddressStr}/${file.name}`;
      const textEncoder = new TextEncoder();
      const identifierBytes = textEncoder.encode(identifier);
      const identifierHex = Array.from(identifierBytes).map(b => b.toString(16).padStart(2, '0')).join('');

      const nbPayload = {
        data: {
          function: `${MODULE_ADDR}::neurobase::register_blob`,
          typeArguments: [],
          functionArguments: [
            `0x${identifierHex}`, // hex representation of blob_id bytes
            100000 // 0.001 APT default fee (10^5 Octas)
          ]
        }
      };
      
      console.log("[NeuroBase UI] Asking user to sign NeuroBase metadata transaction...");
      const nbResponse = await signAndSubmitTransaction(nbPayload as any);
      
      setModal({
        isOpen: true,
        title: "Upload Successful",
        message: `Knowledge Pack registered!\nTX: ${nbResponse.hash.slice(0, 10)}...`,
        type: "success"
      });
      setTimeout(fetchMemories, 3000);
    } catch (error: any) {
      console.error("Upload failed", error);
      if (error?.message?.includes('User has rejected the request') || error?.name === 'UserRejectedRequestError' || error === 'User rejected the request') {
        console.log("Upload cancelled: User rejected the request.");
      } else {
        setModal({
          isOpen: true,
          title: "Upload Failed",
          message: error?.message || "An unexpected error occurred during upload.",
          type: "error"
        });
      }
    } finally {
      setUploading(false);
      event.target.value = ''; // Reset input
    }
  };

  const handleRecall = async (memory: any) => {
    if (!connected || !account) {
      setModal({
        isOpen: true,
        title: "Action Required",
        message: "Please connect your wallet first via the Sidebar.",
        type: "info"
      });
      return;
    }

    try {
      const userAddressStr = String(account.address);
      const isOwner = memory.owner === userAddressStr;

      if (!isOwner) {
        console.log(`[NeuroBase UI] Purchasing access to memory: ${memory.name}`);
        let priceFloat = parseFloat(memory.price.replace(" APT", ""));
        let amountInOctas = Math.floor(priceFloat * 100000000);

        const payload = {
          data: {
            function: "0x1::aptos_account::transfer",
            typeArguments: [],
            functionArguments: [
              memory.owner,
              amountInOctas
            ]
          }
        };

        console.log("[NeuroBase UI] Asking user to sign payment transaction...");
        const response = await signAndSubmitTransaction(payload as any);
        console.log(`[NeuroBase UI] Payment successful, hash: ${response.hash}`);
      } else {
        console.log(`[NeuroBase UI] Accessing self-owned memory: ${memory.name}`);
      }
      
      console.log(`[NeuroBase UI] Retrieving data for ${memory.name} from Shelby Protocol...`);
      
      try {
        const shelbyClient = new ShelbyClient({
          network: "shelbynet" as any,
        });

        let rawIdentifier = memory.fullName || memory.name;
        if (rawIdentifier.startsWith('0x')) {
          let hex = rawIdentifier.slice(2);
          let str = "";
          for (let i = 0; i < hex.length; i += 2) {
            str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
          }
          rawIdentifier = str;
        }
        
        // Splitting logic: if identifier is '0xabc123/file.txt', we split it
        let downloadedAccount = memory.owner;
        let downloadedBlobName = rawIdentifier;
        if (rawIdentifier.includes('/')) {
            const parts = rawIdentifier.split('/');
            downloadedAccount = parts[0];
            downloadedBlobName = parts.slice(1).join('/');
        }

        const downloadParams = {
          account: downloadedAccount as any,
          blobName: downloadedBlobName,
        };
        
        let blobObj = await shelbyClient.download(downloadParams);
        const reader = blobObj.readable.getReader();
        const chunks = [];
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(value);
        }
        const blob = new Blob(chunks);
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");

        setModal({
          isOpen: true,
          title: "Recall Successful",
          message: isOwner ? `Memory retrieved. Opening file...` : `Access purchased & memory retrieved. Opening file...`,
          type: "success"
        });
      } catch (shelbyErr: any) {
        console.error("Shelby download failed", shelbyErr);
        setModal({
          isOpen: true,
          title: "Retrieval Error",
          message: `Connection to Shelby Node failed: ${shelbyErr.message}`,
          type: "error"
        });
      }
      
    } catch (error: any) {
      console.error("Recall failed", error);
      if (error?.message?.includes('User has rejected the request') || error?.name === 'UserRejectedRequestError' || error === 'User rejected the request') {
        console.log("Recall cancelled by user.");
      } else {
        setModal({
          isOpen: true,
          title: "Recall Failed",
          message: error?.message || "Transaction or retrieval failed.",
          type: "error"
        });
      }
    }
  };

  const totalPages = Math.ceil(memories.length / itemsPerPage);
  const currentMemories = memories.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const stats = [
    { name: "Global Knowledge", value: loading ? "..." : memories.length + " Blobs", icon: Database, change: "Ready" },
    { name: "My Earnings", value: "0.0 APT", icon: PieChart, change: "No access yet" },
    { name: "Shelbynet Status", value: "Online", icon: Zap, change: "Network OK" },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Welcome & Global Stats */}
      <header className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-[#5EE7DF] font-mono text-[11px] font-semibold uppercase tracking-[0.2em] mb-2">
           <Zap size={14} className="animate-pulse" /> Live on Shelbynet
        </div>
        <h2 className="text-5xl font-semibold tracking-[-0.055em] leading-tight text-[#F2F2F5]">
            Secure Memory Dashboard
        </h2>
        <p className="text-[#9A9AA5] max-w-2xl text-lg font-light leading-[1.7]">Your decentralized memory surface, stored on Shelby and verifiable on-chain.</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="glass-card p-6 overflow-hidden relative group transition-all hover:-translate-y-1">
             <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-[10px] bg-white/[0.035] border border-white/[0.08] flex items-center justify-center text-[#5EE7DF]">
                  <stat.icon size={24} />
                </div>
                <span className="font-mono text-[10px] font-semibold text-[#C8BEFF] border border-[#7B5CFA]/30 px-2 py-1 rounded capitalize tracking-widest">{stat.change}</span>
             </div>
             <div>
                <p className="font-mono text-[10px] text-[#696974] font-semibold uppercase tracking-[0.18em] mb-1">{stat.name}</p>
                <h3 className="text-3xl font-semibold tracking-[-0.035em] text-[#F2F2F5]">{stat.value}</h3>
             </div>
          </div>
        ))}
      </section>

      {/* Upload Hub */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black tracking-widest flex items-center gap-3">
               Recent Memories
            </h3>
          </div>

           <div className="space-y-4">
             {loading && <div className="text-center p-4">Loading real memories from Shelbynet...</div>}
             {currentMemories.map((memory: any, index: number) => (
               <div key={`${memory.id}-${index}`} className="glass-card p-5 flex items-center justify-between hover:bg-white/[0.045] border border-white/[0.08] hover:border-[#7B5CFA]/35 transition-all cursor-pointer group">
                  <div className="flex items-center gap-5 flex-1 min-w-0 pr-4">
                     <div className="w-12 h-12 shrink-0 rounded-full bg-[#7B5CFA]/10 flex items-center justify-center text-[#5EE7DF] group-hover:bg-[#7B5CFA] group-hover:text-white transition-all">
                        <Database size={20} />
                     </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-lg font-semibold text-[#F2F2F5] tracking-[-0.025em] truncate">{memory.name}</h4>
                        <p className="text-xs text-[#9A9AA5] flex items-center gap-2 truncate">
                           Owner: {String(memory.owner).slice(0,6)}...{String(memory.owner).slice(-4)} 
                           <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                           Decentralized <span className="w-1 h-1 rounded-full bg-gray-600"></span> 
                           Accessed: {memory.accessed}
                        </p>
                      </div>
                  </div>
                  <div className="flex items-center gap-6">
                     <div className="text-right sr-only md:not-sr-only">
                        <p className="font-mono text-[10px] text-[#696974] uppercase font-semibold tracking-widest">Price</p>
                        <p className="font-semibold text-[#C8BEFF] tracking-tight">{memory.price}</p>
                     </div>
                     <button onClick={() => handleRecall(memory)} className="neuro-btn-small flex items-center gap-2 capitalize cursor-pointer">
                        Recall <ExternalLink size={14} />
                     </button>
                  </div>
               </div>
             ))}

             {!loading && memories.length === 0 && (
               <div className="p-8 text-center glass-card border-dashed border-white/10 opacity-50 grayscale">
                  <p className="font-mono text-xs font-semibold text-[#696974] tracking-[0.18em]">No memories uploaded yet...</p>
               </div>
             )}

             {/* Pagination Controls */}
             {!loading && totalPages > 1 && (
               <div className="flex items-center justify-between pt-4">
                  <button 
                    onClick={prevPage} 
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <div className="text-xs font-bold text-gray-400">
                     Page <span className="text-white">{currentPage}</span> of <span className="text-white">{totalPages}</span>
                  </div>
                  <button 
                    onClick={nextPage} 
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight size={16} />
                  </button>
               </div>
             )}
          </div>
        </div>

        {/* Action Sidebar */}
         <div className="space-y-6">
            {!hasRegistry && connected && (
               <div className="glass-card p-8 border border-[#7B5CFA]/40 bg-[#7B5CFA]/[0.07] text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-[#7B5CFA]/18 mx-auto flex items-center justify-center text-[#C8BEFF]">
                    <Zap size={24} />
                  </div>
                  <h4 className="text-md font-semibold text-[#F2F2F5]">Setup Required</h4>
                  <p className="text-xs text-[#9A9AA5] leading-[1.6]">You need to initialize your NeuroBase Registry before you can upload memories.</p>
                  <button 
                    onClick={handleInitRegistry}
                    disabled={initializing}
                    className="neuro-btn w-full py-3 text-[10px] font-black"
                  >
                    {initializing ? "Initializing..." : "Initialize Registry"}
                  </button>
               </div>
            )}

            <div className="glass-card p-8 border-dashed border border-white/[0.10] text-center space-y-6">
              <div className="w-16 h-16 rounded-[10px] bg-[#7B5CFA]/18 mx-auto flex items-center justify-center text-[#C8BEFF] mb-2">
                <Upload size={28} />
              </div>
              <h4 className="text-lg font-semibold tracking-[-0.025em]">Upload Knowledge</h4>
              <p className="text-sm text-[#9A9AA5] font-light leading-[1.7]">Securely store your cognitive assets on the Shelby network.</p>
              
              <div className="relative w-full">
                <input 
                  type="file" 
                  onChange={handleFileUpload} 
                  disabled={uploading}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" 
                />
                <button 
                  className={`neuro-btn w-full py-4 text-xs font-black tracking-[0.2em] ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {uploading ? "Uploading..." : "Proceed Upload"}
                </button>
              </div>
           </div>
        </div>
      </section>

      {/* Modern Modal Component */}
      {modal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0A0A0B]/82 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="glass-card w-full max-w-md p-8 border border-white/[0.08] relative animate-in zoom-in-95 duration-300">
            <div className={`w-16 h-16 rounded-[10px] mx-auto flex items-center justify-center mb-6 ${
              modal.type === "success" ? "bg-[#7B5CFA]/20 text-[#C8BEFF]" : 
              modal.type === "error" ? "bg-red-500/20 text-red-300" : "bg-[#5EE7DF]/12 text-[#5EE7DF]"
            }`}>
              {modal.type === "success" && <Zap size={32} />}
              {modal.type === "error" && <Shield size={32} />}
              {modal.type === "info" && <Brain size={32} />}
            </div>
            <h3 className="text-2xl font-semibold text-center mb-2 tracking-[-0.035em]">{modal.title}</h3>
            <p className="text-[#9A9AA5] text-center font-light leading-[1.7] mb-8">{modal.message}</p>
            <button 
              onClick={() => setModal({ ...modal, isOpen: false })}
              className="neuro-btn w-full py-4 text-xs font-black tracking-widest uppercase transition-transform active:scale-95"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
