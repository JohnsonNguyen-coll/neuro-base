"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brain, MessageSquare, PieChart, Settings, Wallet, ShoppingBag } from "lucide-react";
import { clsx } from "clsx";

import { useWallet } from "@aptos-labs/wallet-adapter-react";

const navItems = [
  { name: "My Brain", icon: Brain, href: "/dashboard" },
  { name: "Marketplace", icon: ShoppingBag, href: "/marketplace" },
  { name: "Earnings", icon: PieChart, href: "/earnings" },
  { name: "Live Chat", icon: MessageSquare, href: "/chat" },
  { name: "Settings", icon: Settings, href: "/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { connect, disconnect, account, connected, wallets } = useWallet();

  const handleWalletAction = () => {
    if (connected) {
      disconnect();
    } else {
      const petra = wallets?.find((w: any) => w.name === "Petra");
      if (petra) {
        connect(petra.name);
      } else {
        alert("Please install Petra Wallet to connect.");
      }
    }
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-64 glass-card rounded-none border-r border-white/5 flex flex-col p-6 m-0 z-50">
      <Link href="/" className="flex items-center space-x-3 mb-12 hover:opacity-80 transition-opacity">
        <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center">
          <Brain className="text-white w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold accent-text">NeuroBase</h1>
      </Link>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                "flex items-center space-x-4 p-3 rounded-xl transition-all duration-300",
                isActive 
                  ? "bg-white/10 text-white shadow-inner" 
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-white/5">
        <button 
          onClick={handleWalletAction}
          className="flex items-center space-x-3 w-full p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
        >
          <Wallet className="w-5 h-5 text-green-400" />
          <div className="text-left">
            <p className="text-xs text-gray-400 capitalize tracking-widest font-bold">
              {connected ? "Connected" : "Wallet"}
            </p>
            <p className="text-sm font-semibold truncate max-w-[120px]">
              {connected && account ? String(account.address).slice(0, 4) + "..." + String(account.address).slice(-4) : "Connect"}
            </p>
          </div>
        </button>
      </div>
    </aside>
  );
}
