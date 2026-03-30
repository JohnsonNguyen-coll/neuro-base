"use client";

import { Upload, PieChart, Shield, History, Plus, MoreVertical, Database, Zap, ExternalLink, Brain } from "lucide-react";
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

  const OWNER_ADDR = "0xbbccc9904b0303aada1eeaa2876a27545a79384e3a0914e59bb5d8118d3163fe";

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
            fullName: name, // Store the full '0xaddress/filename'
            name: cleanName,
            price: rawPrice === 0 ? "Free" : rawPrice.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 5 }) + " APT",
            accessed: blob.access_count + " times"
          };
        });
        setMemories(parsedBlobs);
      }
    } catch (err) {
      console.error("Failed to fetch memories from chain", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemories();
  }, []);

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
      
      // We must use the user's account address
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

      // Wait for Aptos transaction confirmation implicitly
      await shelbyClient.aptos.waitForTransaction({ transactionHash: response.hash });
      
      // Wait extra 3 seconds for the Shelby GraphQL indexer to catch up and see the blob metadata
      console.log(`[NeuroBase UI] Waiting for Shelby Indexer to synchronize...`);
      await new Promise(r => setTimeout(r, 3000));

      // 3. Thực tế tải file lên Shelby Protocol
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
          function: `${OWNER_ADDR}::neurobase::register_blob`,
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
      fetchMemories();
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
      console.log(`[NeuroBase UI] Purchasing access to memory: ${memory.name}`);
      let priceFloat = parseFloat(memory.price.replace(" APT", ""));
      let amountInOctas = Math.floor(priceFloat * 100000000);

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

      console.log("[NeuroBase UI] Asking user to sign payment transaction...");
      const response = await signAndSubmitTransaction(payload as any);
      
      console.log(`[NeuroBase UI] Payment successful, now retrieving data for ${memory.name} from Shelby Protocol...`);
      
      // Real download logic using Shelby SDK
      try {
        const shelbyClient = new ShelbyClient({
          network: "shelbynet" as any, // Match the API we are fetching memories from
        });

        console.log(`[NeuroBase UI] Attempting Shelby download - Account: ${OWNER_ADDR}, BlobName: ${memory.fullName || memory.name}`);
        // In Shelby, if blobs are stored using 'account/filename' as the unique ID, 
        // we should try downloading it directly without the account context as a fallback.
        // The issue is that 'memory.fullName' is hex-encoded (e.g., "0x...").
        // Shelby SDK's download() method internally hex-encodes the blobName.
        // We MUST decode the hex back to a simple string before passing it to the SDK.
        let rawIdentifier = memory.fullName || memory.name;
        if (rawIdentifier.startsWith('0x')) {
          let hex = rawIdentifier.slice(2);
          let str = "";
          for (let i = 0; i < hex.length; i += 2) {
            str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
          }
          rawIdentifier = str;
        }
        
        console.log("[NeuroBase UI] Decoded Identifier for SDK:", rawIdentifier);

        // Splitting logic: if identifier is '0xabc123/file.txt', we split it
        let downloadedAccount = OWNER_ADDR;
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
        
        console.log("[NeuroBase UI] Final Download Params:", downloadParams);

        let blobObj = await shelbyClient.download(downloadParams);

        // Convert the ReadableStream to a Blob
        const reader = blobObj.readable.getReader();
        const chunks = [];
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(value);
        }
        const blob = new Blob(chunks);
        const url = URL.createObjectURL(blob);
        
        // Open the file in a new tab
        window.open(url, "_blank");

        setModal({
          isOpen: true,
          title: "Recall Successful",
          message: `Memory retrieved from Shelby Protocol. Opening file...`,
          type: "success"
        });
      } catch (shelbyErr: any) {
        console.error("Shelby download failed", shelbyErr);
        setModal({
          isOpen: true,
          title: "Retrieval Error",
          message: `Payment OK, but content retrieval failed: ${shelbyErr.message}`,
          type: "error"
        });
      }
      
    } catch (error: any) {
      console.error("Recall failed", error);
      if (error?.message?.includes('User has rejected the request') || error?.name === 'UserRejectedRequestError' || error === 'User rejected the request') {
        console.log("Recall cancelled: User rejected the payment.");
      } else {
        setModal({
          isOpen: true,
          title: "Payment Error",
          message: error?.message || "Transaction failed.",
          type: "error"
        });
      }
    }
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold capitalize tracking-wider mb-2">
           <Zap size={14} className="animate-pulse" /> Live on Shelbynet
        </div>
        <h2 className="text-5xl font-black tracking-tighter leading-tight">
            Neuro<span className="text-green-500">Base</span> Dashboard
        </h2>
        <p className="text-gray-400 max-w-2xl text-lg font-medium">Your decentralized mind, stored on Shelby and verifiable on-chain.</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="glass-card p-6 overflow-hidden relative group transition-all hover:-translate-y-1">
             <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400">
                  <stat.icon size={24} />
                </div>
                <span className="text-[10px] font-black text-green-400 border border-green-500/30 px-2 py-1 rounded capitalize tracking-widest">{stat.change}</span>
             </div>
             <div>
                <p className="text-xs text-gray-500 font-bold capitalize tracking-widest mb-1">{stat.name}</p>
                <h3 className="text-3xl font-black text-white">{stat.value}</h3>
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
             {memories.map((memory: any, index: number) => (
               <div key={`${memory.id}-${index}`} className="glass-card p-5 flex items-center justify-between hover:bg-white/5 border border-white/5 hover:border-green-500/30 transition-all cursor-pointer group">
                  <div className="flex items-center gap-5 flex-1 min-w-0 pr-4">
                     <div className="w-12 h-12 shrink-0 rounded-full bg-green-500/5 flex items-center justify-center text-green-500 group-hover:bg-green-500 group-hover:text-white transition-all">
                        <Database size={20} />
                     </div>
                     <div className="flex-1 min-w-0">
                        <h4 className="text-lg font-bold text-white tracking-tight truncate">{memory.name}</h4>
                        <p className="text-xs text-gray-400 flex items-center gap-2 truncate">
                           Owner: {OWNER_ADDR.slice(0,6)}...{OWNER_ADDR.slice(-4)} 
                           <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                           Decentralized <span className="w-1 h-1 rounded-full bg-gray-600"></span> 
                           Accessed: {memory.accessed}
                        </p>
                     </div>
                  </div>
                  <div className="flex items-center gap-6">
                     <div className="text-right sr-only md:not-sr-only">
                        <p className="text-[10px] text-gray-500 capitalize font-bold tracking-widest">Price</p>
                        <p className="font-black text-green-400 tracking-tighter">{memory.price}</p>
                     </div>
                     <button onClick={() => handleRecall(memory)} className="neuro-btn-small flex items-center gap-2 capitalize cursor-pointer hover:bg-green-400">
                        Recall <ExternalLink size={14} />
                     </button>
                  </div>
               </div>
             ))}

             {!loading && memories.length === 0 && (
               <div className="p-8 text-center glass-card border-dashed border-white/10 opacity-50 grayscale">
                  <p className="text-sm font-bold text-gray-500 tracking-widest">No memories uploaded yet...</p>
               </div>
             )}
          </div>
        </div>

        {/* Action Sidebar */}
        <div className="space-y-6">
           <div className="glass-card p-8 border-dashed border-2 border-green-500/20 text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-green-500/20 mx-auto flex items-center justify-center text-green-400 mb-2">
                <Upload size={28} />
              </div>
              <h4 className="text-lg font-black tracking-tighter">Upload Knowledge</h4>
              <p className="text-sm text-gray-400 font-medium leading-relaxed">Securely store your cognitive assets on the Shelby network.</p>
              
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="glass-card w-full max-w-md p-8 border-2 border-white/10 shadow-2xl relative animate-in zoom-in-95 duration-300">
            <div className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-6 ${
              modal.type === "success" ? "bg-green-500/20 text-green-400" : 
              modal.type === "error" ? "bg-red-500/20 text-red-400" : "bg-blue-500/20 text-blue-400"
            }`}>
              {modal.type === "success" && <Zap size={32} />}
              {modal.type === "error" && <Shield size={32} />}
              {modal.type === "info" && <Brain size={32} />}
            </div>
            <h3 className="text-2xl font-black text-center mb-2 tracking-tighter">{modal.title}</h3>
            <p className="text-gray-400 text-center font-medium leading-relaxed mb-8">{modal.message}</p>
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
