"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Brain, MessageSquare, PieChart, Settings, ShoppingBag } from "lucide-react";
import { clsx } from "clsx";

import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";

const navItems = [
  { name: "My Brain", icon: Brain, href: "/dashboard" },
  { name: "Marketplace", icon: ShoppingBag, href: "/marketplace" },
  { name: "Earnings", icon: PieChart, href: "/earnings" },
  { name: "Live Chat", icon: MessageSquare, href: "/chat" },
  { name: "Settings", icon: Settings, href: "/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 border-r border-white/[0.08] bg-[#0D0D10]/86 backdrop-blur-xl flex flex-col p-6 m-0 z-50">
      <Link href="/" className="flex items-center space-x-3 mb-12 hover:opacity-80 transition-opacity">
        <div className="w-10 h-10 rounded-[10px] border border-white/[0.08] bg-white/[0.03] flex items-center justify-center shadow-[0_0_24px_rgba(94,231,223,0.10)]">
          <Image
            src="/neurobase_logo-removebg-preview.png"
            alt=""
            width={32}
            height={32}
            priority
          />
        </div>
        <h1 className="text-xl font-semibold tracking-[-0.03em] text-[#F2F2F5]">NeuroBase</h1>
      </Link>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                "flex items-center space-x-4 p-3 rounded-[10px] transition-all duration-300",
                isActive 
                  ? "bg-gradient-to-r from-[#7B5CFA]/18 to-[#4C2FCB]/12 text-[#F2F2F5] border border-[#7B5CFA]/25 shadow-[0_0_28px_rgba(123,92,250,0.08)]" 
                  : "text-[#9A9AA5] hover:bg-white/[0.045] hover:text-[#F2F2F5]"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div id="neuro-wallet-wrapper" className="mt-auto pt-6 border-t border-white/[0.08] w-full">
        <WalletSelector />
      </div>
    </aside>
  );
}
