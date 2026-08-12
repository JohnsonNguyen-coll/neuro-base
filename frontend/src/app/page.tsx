"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Braces,
  Cpu,
  DatabaseZap,
  Fingerprint,
  KeyRound,
  LockKeyhole,
  ShieldCheck,
  WalletCards,
} from "lucide-react";

const navItems = [
  { label: "Protocol", href: "#protocol" },
  { label: "Workflow", href: "#workflow" },
  { label: "Trust", href: "#trust" },
  { label: "Docs", href: "/docs" },
];

const metrics = [
  { value: "MCP", label: "Agent retrieval interface" },
  { value: "Shelby", label: "Encrypted blob storage" },
  { value: "Aptos", label: "Verifiable settlement rail" },
];

const protocolCards = [
  {
    title: "Private Memory Layer",
    copy: "Package prompts, files, notes, and domain knowledge into controlled memory objects for AI agents.",
    icon: DatabaseZap,
  },
  {
    title: "MCP Access Surface",
    copy: "Expose selected memory through a structured tool boundary instead of broad, unaudited context sharing.",
    icon: Braces,
  },
  {
    title: "On-Chain References",
    copy: "Register access metadata and pricing references through an Aptos-compatible contract path.",
    icon: WalletCards,
  },
];

const workflow = [
  "Connect wallet",
  "Seal knowledge pack",
  "Register proof reference",
  "Permit agent recall",
];

export default function LandingPage() {
  return (
    <div className="landing-shell min-h-screen overflow-hidden bg-[#0A0A0B] text-[#F2F2F5]">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_12%,rgba(123,92,250,0.20),transparent_30%),radial-gradient(circle_at_78%_8%,rgba(94,231,223,0.10),transparent_28%),linear-gradient(135deg,#0A0A0B,#0D0D10)]" />
        <div className="absolute inset-0 opacity-[0.13] [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(circle_at_50%_20%,black,transparent_72%)]" />
        <div className="absolute left-1/2 top-24 h-px w-[72rem] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#5EE7DF]/35 to-transparent" />
      </div>

      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.08] bg-[#0A0A0B]/72 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="flex items-center gap-3" aria-label="NeuroBase home">
            <span className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-white/[0.08] bg-white/[0.03] shadow-[0_0_28px_rgba(94,231,223,0.10)]">
              <Image
                src="/neurobase_logo-removebg-preview.png"
                alt=""
                width={32}
                height={32}
                priority
              />
            </span>
            <span className="text-lg font-semibold tracking-[-0.03em] text-[#F2F2F5]">NeuroBase</span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-[#9A9AA5] md:flex">
            {navItems.map((item) => (
              <Link key={item.label} href={item.href} className="transition duration-200 hover:text-[#F2F2F5]">
                {item.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/dashboard"
            className="inline-flex h-11 items-center gap-2 rounded-[10px] bg-gradient-to-r from-[#7B5CFA] to-[#4C2FCB] px-5 text-sm font-semibold text-white shadow-[0_0_32px_rgba(123,92,250,0.24)] transition duration-200 hover:scale-[1.015] hover:shadow-[0_0_42px_rgba(123,92,250,0.34)]"
          >
            Launch App
            <ArrowRight size={16} />
          </Link>
        </div>
      </header>

      <main className="relative z-10">
        <section className="mx-auto grid min-h-[92vh] max-w-7xl gap-12 px-5 pb-20 pt-32 sm:px-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
          <div className="animate-in fade-in slide-in-from-bottom-3 duration-500">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#5EE7DF]">
              <BadgeCheck size={14} />
              Confidential AI Memory
            </div>
            <h1 className="max-w-3xl text-5xl font-semibold leading-[1.03] tracking-[-0.055em] text-[#F2F2F5] sm:text-6xl lg:text-7xl">
              Verifiable memory for agentic systems.
            </h1>
            <p className="mt-7 max-w-2xl text-lg font-light leading-[1.7] text-[#9A9AA5]">
              NeuroBase gives AI agents a controlled way to recall encrypted knowledge packs through Shelby storage, Aptos metadata, and an MCP-compatible access boundary.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/dashboard"
                className="inline-flex h-13 items-center justify-center gap-2 rounded-[10px] bg-gradient-to-r from-[#7B5CFA] to-[#4C2FCB] px-7 text-sm font-semibold text-white shadow-[0_0_36px_rgba(123,92,250,0.28)] transition duration-200 hover:scale-[1.015] hover:shadow-[0_0_50px_rgba(123,92,250,0.42)]"
              >
                Connect Secure Workspace
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/docs"
                className="inline-flex h-13 items-center justify-center gap-2 rounded-[10px] border border-white/[0.08] bg-white/[0.03] px-7 text-sm font-semibold text-[#F2F2F5] transition duration-200 hover:border-[#5EE7DF]/40 hover:bg-white/[0.055]"
              >
                Read Protocol Notes
                <KeyRound size={18} />
              </Link>
            </div>
          </div>

          <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="absolute inset-8 rounded-full bg-[#7B5CFA]/20 blur-[90px]" />
            <div className="relative rounded-[10px] border border-white/[0.08] bg-white/[0.03] p-5 shadow-[0_24px_90px_rgba(0,0,0,0.42)] backdrop-blur-xl">
              <div className="mb-5 flex items-center justify-between border-b border-white/[0.08] pb-4">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.18em] text-[#9A9AA5]">
                  <Cpu size={15} className="text-[#5EE7DF]" />
                  Secure Enclave View
                </div>
                <div className="h-2 w-2 rounded-full bg-[#5EE7DF] shadow-[0_0_18px_rgba(94,231,223,0.8)]" />
              </div>
              <div className="relative overflow-hidden rounded-[8px] border border-white/[0.08] bg-[#0D0D10]">
                <Image
                  src="/neurobase_logo.png"
                  alt="NeuroBase encrypted network visual"
                  width={1024}
                  height={1024}
                  priority
                  className="aspect-[1.12/1] w-full object-cover opacity-80 mix-blend-screen"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,13,16,0.04),rgba(13,13,16,0.76))]" />
                <div className="absolute bottom-4 left-4 right-4 grid gap-3 sm:grid-cols-3">
                  {metrics.map((metric) => (
                    <div key={metric.value} className="rounded-[8px] border border-white/[0.08] bg-[#0A0A0B]/72 p-4 backdrop-blur-md">
                      <p className="font-mono text-sm font-semibold text-[#F2F2F5]">{metric.value}</p>
                      <p className="mt-2 text-xs leading-5 text-[#9A9AA5]">{metric.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="protocol" className="border-y border-white/[0.08] bg-white/[0.015]">
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
            <div className="max-w-2xl">
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-[#5EE7DF]">Protocol Surface</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-[#F2F2F5] sm:text-4xl">
                Minimal primitives for high-trust AI data access.
              </h2>
            </div>
            <div className="mt-11 grid gap-5 md:grid-cols-3">
              {protocolCards.map((card) => (
                <article key={card.title} className="rounded-[10px] border border-white/[0.08] bg-white/[0.03] p-7 transition duration-200 hover:-translate-y-1 hover:border-[#7B5CFA]/35">
                  <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-[10px] border border-white/[0.08] bg-[#0D0D10] text-[#5EE7DF]">
                    <card.icon size={23} strokeWidth={1.8} />
                  </div>
                  <h3 className="text-xl font-semibold tracking-[-0.025em] text-[#F2F2F5]">{card.title}</h3>
                  <p className="mt-4 text-sm font-light leading-[1.7] text-[#9A9AA5]">{card.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="workflow" className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-[#5EE7DF]">Workflow</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-[#F2F2F5] sm:text-4xl">
              One path from ownership to recall.
            </h2>
            <p className="mt-5 text-base font-light leading-[1.7] text-[#9A9AA5]">
              Each step keeps the interface quiet and explicit: authenticate, seal, register, and grant access through a narrow agent boundary.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {workflow.map((item, index) => (
              <div key={item} className="rounded-[10px] border border-white/[0.08] bg-white/[0.03] p-6">
                <p className="font-mono text-xs font-semibold text-[#5EE7DF]">0{index + 1}</p>
                <p className="mt-4 text-lg font-semibold tracking-[-0.025em] text-[#F2F2F5]">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="trust" className="border-t border-white/[0.08] bg-[#0D0D10]">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-3">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-[#5EE7DF]">Trust Model</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-[#F2F2F5]">
                Built for sensitive knowledge surfaces.
              </h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-3 lg:col-span-2">
              {[
                { icon: ShieldCheck, title: "Verified References" },
                { icon: LockKeyhole, title: "Wallet-Gated Reads" },
                { icon: Fingerprint, title: "Controlled Identity" },
              ].map((item) => (
                <div key={item.title} className="rounded-[10px] border border-white/[0.08] bg-white/[0.03] p-6">
                  <item.icon className="text-[#5EE7DF]" size={25} strokeWidth={1.8} />
                  <p className="mt-5 text-base font-semibold tracking-[-0.025em] text-[#F2F2F5]">{item.title}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/[0.08] bg-[#0A0A0B]">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-9 text-sm font-light text-[#9A9AA5] sm:px-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3 text-[#F2F2F5]">
            <Image src="/neurobase_logo-removebg-preview.png" alt="" width={32} height={32} />
            <span className="font-semibold tracking-[-0.02em]">NeuroBase</span>
          </div>
          <div className="flex flex-wrap gap-5">
            <Link href="/docs" className="hover:text-[#F2F2F5]">Docs</Link>
            <Link href="/dashboard" className="hover:text-[#F2F2F5]">Dashboard</Link>
            <Link href="/settings" className="hover:text-[#F2F2F5]">Settings</Link>
          </div>
          <p className="font-mono text-xs uppercase tracking-[0.18em]">Shelby / Aptos / MCP</p>
        </div>
      </footer>
    </div>
  );
}
