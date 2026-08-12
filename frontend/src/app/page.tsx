"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Braces,
  ChevronRight,
  DatabaseZap,
  LockKeyhole,
  Network,
  ShieldCheck,
  WalletCards,
} from "lucide-react";

const navItems = [
  { label: "Platform", href: "#platform" },
  { label: "Workflow", href: "#workflow" },
  { label: "Security", href: "#security" },
  { label: "Docs", href: "/docs" },
];

const metrics = [
  { value: "MCP", label: "Agent-ready access layer" },
  { value: "Shelby", label: "Decentralized blob storage" },
  { value: "APT", label: "On-chain settlement path" },
];

const platformCards = [
  {
    title: "Memory Storage",
    copy: "Package files, notes, prompts, datasets, and personal knowledge into verifiable Shelby blobs.",
    icon: DatabaseZap,
  },
  {
    title: "Agent Retrieval",
    copy: "Expose selected memory through an MCP server so AI clients can recall approved context on demand.",
    icon: Braces,
  },
  {
    title: "Ownership Rail",
    copy: "Track access references and pricing signals through Aptos-compatible on-chain metadata.",
    icon: WalletCards,
  },
];

const workflow = [
  "Upload knowledge packs",
  "Register metadata on-chain",
  "Let agents recall approved memories",
  "Settle reads through wallet flows",
];

export default function LandingPage() {
  return (
    <div className="landing-shell min-h-screen bg-[#f7f8f5] text-[#10201f]">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[#10201f]/10 bg-[#f7f8f5]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="flex items-center gap-3" aria-label="NeuroBase home">
            <span className="flex h-11 w-11 items-center justify-center rounded-md bg-[#081817]">
              <Image
                src="/neurobase_logo-removebg-preview.png"
                alt=""
                width={36}
                height={36}
                priority
              />
            </span>
            <span className="text-xl font-black tracking-tight text-[#10201f]">NeuroBase</span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-semibold text-[#314341] md:flex">
            {navItems.map((item) => (
              <Link key={item.label} href={item.href} className="transition hover:text-[#008f8a]">
                {item.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/dashboard"
            className="inline-flex h-11 items-center gap-2 rounded-md bg-[#10201f] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-[#008f8a]"
          >
            Open App
            <ArrowRight size={16} />
          </Link>
        </div>
      </header>

      <main>
        <section className="relative flex min-h-[88vh] items-center overflow-hidden pt-24">
          <Image
            src="/neurobase_logo.png"
            alt="NeuroBase network brain visual"
            fill
            priority
            className="absolute inset-0 object-cover object-center"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#f7f8f5_0%,rgba(247,248,245,0.94)_36%,rgba(247,248,245,0.56)_67%,rgba(247,248,245,0.18)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-[linear-gradient(180deg,rgba(247,248,245,0),#f7f8f5)]" />

          <div className="relative mx-auto grid w-full max-w-7xl gap-10 px-5 pb-16 pt-14 sm:px-8 lg:grid-cols-[1.04fr_0.96fr] lg:items-end">
            <div className="max-w-3xl">
              <div className="mb-7 inline-flex items-center gap-2 rounded-md border border-[#008f8a]/25 bg-white/70 px-3 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#006d68]">
                <BadgeCheck size={15} />
                Verifiable AI Memory
              </div>
              <h1 className="text-5xl font-black leading-[1.02] tracking-tight text-[#10201f] sm:text-6xl lg:text-7xl">
                NeuroBase
              </h1>
              <p className="mt-7 max-w-2xl text-lg font-medium leading-8 text-[#405552] sm:text-xl">
                A polished memory layer for storing, pricing, and recalling AI knowledge through Shelby storage, Aptos metadata, and an MCP-compatible backend.
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/dashboard"
                  className="inline-flex h-13 items-center justify-center gap-2 rounded-md bg-[#008f8a] px-7 text-sm font-black uppercase tracking-[0.12em] text-white shadow-[0_16px_40px_rgba(0,143,138,0.24)] transition hover:bg-[#10201f]"
                >
                  Launch Dashboard
                  <ArrowRight size={18} />
                </Link>
                <Link
                  href="/marketplace"
                  className="inline-flex h-13 items-center justify-center gap-2 rounded-md border border-[#10201f]/15 bg-white/70 px-7 text-sm font-black uppercase tracking-[0.12em] text-[#10201f] transition hover:border-[#008f8a] hover:text-[#008f8a]"
                >
                  View Marketplace
                  <ChevronRight size={18} />
                </Link>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:mb-5">
              {metrics.map((metric) => (
                <div key={metric.value} className="rounded-md border border-white/55 bg-white/72 p-5 shadow-sm backdrop-blur-md">
                  <p className="text-2xl font-black tracking-tight text-[#10201f]">{metric.value}</p>
                  <p className="mt-2 text-sm font-semibold leading-5 text-[#536865]">{metric.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="platform" className="border-y border-[#10201f]/10 bg-white">
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
            <div className="max-w-2xl">
              <p className="text-sm font-black uppercase tracking-[0.22em] text-[#008f8a]">Platform</p>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-[#10201f] sm:text-4xl">
                Built for a working AI memory product.
              </h2>
            </div>

            <div className="mt-11 grid gap-5 md:grid-cols-3">
              {platformCards.map((card) => (
                <article key={card.title} className="rounded-md border border-[#10201f]/10 bg-[#f7f8f5] p-7">
                  <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-md bg-[#10201f] text-[#2ee9dc]">
                    <card.icon size={24} />
                  </div>
                  <h3 className="text-xl font-black tracking-tight">{card.title}</h3>
                  <p className="mt-4 text-sm font-medium leading-6 text-[#536865]">{card.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="workflow" className="bg-[#10201f] text-white">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-[#2ee9dc]">Workflow</p>
              <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
                From file upload to agent recall.
              </h2>
              <p className="mt-5 text-base font-medium leading-7 text-white/68">
                The interface now presents NeuroBase as a focused product: storage, verification, access, and earnings are separated into a clear journey.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {workflow.map((item, index) => (
                <div key={item} className="rounded-md border border-white/10 bg-white/[0.055] p-6">
                  <p className="text-sm font-black text-[#f4b95a]">0{index + 1}</p>
                  <p className="mt-4 text-lg font-black tracking-tight">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="security" className="bg-[#f7f8f5]">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <p className="text-sm font-black uppercase tracking-[0.22em] text-[#008f8a]">Security</p>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-[#10201f]">
                Designed around user-owned knowledge.
              </h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-3 lg:col-span-2">
              {[
                { icon: ShieldCheck, title: "Verified References" },
                { icon: LockKeyhole, title: "Wallet-Gated Access" },
                { icon: Network, title: "Decentralized Storage" },
              ].map((item) => (
                <div key={item.title} className="rounded-md border border-[#10201f]/10 bg-white p-6">
                  <item.icon className="text-[#008f8a]" size={26} />
                  <p className="mt-5 text-base font-black tracking-tight text-[#10201f]">{item.title}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#10201f]/10 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-9 text-sm font-semibold text-[#536865] sm:px-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3 text-[#10201f]">
            <Image src="/neurobase_logo-removebg-preview.png" alt="" width={34} height={34} />
            <span className="font-black">NeuroBase</span>
          </div>
          <div className="flex flex-wrap gap-5">
            <Link href="/docs" className="hover:text-[#008f8a]">Docs</Link>
            <Link href="/dashboard" className="hover:text-[#008f8a]">Dashboard</Link>
            <Link href="/settings" className="hover:text-[#008f8a]">Settings</Link>
          </div>
          <p>Built on Shelby and Aptos rails.</p>
        </div>
      </footer>
    </div>
  );
}
