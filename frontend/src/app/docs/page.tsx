"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Braces,
  Database,
  FileJson,
  Layers,
  Zap,
} from "lucide-react";

const concepts = [
  {
    title: "Verifiable Memory Blobs",
    copy: "User files are erasure-coded and written to decentralized Shelby nodes instead of a centralized application database.",
    icon: Database,
  },
  {
    title: "MCP Access Boundary",
    copy: "Agents retrieve context through a narrow tool interface, keeping memory access explicit and auditable.",
    icon: Braces,
  },
];

const steps = [
  {
    title: "Upload and Commit",
    copy: "The web app generates erasure-coding commitments and registers a blob reference on Shelby L1.",
  },
  {
    title: "Register Marketplace Metadata",
    copy: "The NeuroBase registry records the knowledge pack reference, owner, and access pricing signal.",
  },
  {
    title: "Agent Query and Payment",
    copy: "An approved agent signs the transaction path and recalls the memory through the MCP-compatible layer.",
  },
];

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#F2F2F5] animate-in fade-in duration-700">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_16%_8%,rgba(123,92,250,0.18),transparent_30%),radial-gradient(circle_at_82%_12%,rgba(94,231,223,0.08),transparent_28%),linear-gradient(135deg,#0A0A0B,#0D0D10)]" />
      <div className="fixed inset-0 -z-10 opacity-[0.12] [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:56px_56px]" />

      <header className="fixed top-0 z-50 w-full border-b border-white/[0.08] bg-[#0A0A0B]/72 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-white/[0.08] bg-white/[0.03]">
              <Image src="/neurobase_logo-removebg-preview.png" alt="" width={32} height={32} priority />
            </div>
            <h1 className="text-lg font-semibold tracking-[-0.03em]">NeuroBase Docs</h1>
          </div>
          <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-[#9A9AA5] transition-colors hover:text-[#F2F2F5]">
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-16 px-6 pb-24 pt-32">
        <section className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-[#5EE7DF]">
            <BookOpen size={14} /> Technical Overview
          </div>
          <h2 className="text-4xl font-semibold tracking-[-0.055em] md:text-5xl">NeuroBase protocol notes</h2>
          <p className="max-w-2xl text-xl font-light leading-[1.7] text-[#9A9AA5]">
            NeuroBase is a decentralized cognitive asset marketplace and storage layer built around Shelby Protocol, Aptos references, and MCP-compatible retrieval.
          </p>
        </section>

        <section className="space-y-8 border-t border-white/[0.08] pt-12">
          <h3 className="flex items-center gap-3 text-3xl font-semibold tracking-[-0.04em]">
            <Layers className="text-[#5EE7DF]" /> Core Concepts
          </h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {concepts.map((concept) => (
              <div key={concept.title} className="glass-card space-y-4 p-8 transition-colors hover:border-[#7B5CFA]/35">
                <concept.icon className="h-8 w-8 text-[#5EE7DF]" strokeWidth={1.8} />
                <h4 className="text-xl font-semibold tracking-[-0.025em]">{concept.title}</h4>
                <p className="text-sm font-light leading-[1.7] text-[#9A9AA5]">{concept.copy}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-8">
          <h3 className="flex items-center gap-3 text-3xl font-semibold tracking-[-0.04em]">
            <Zap className="text-[#C8BEFF]" /> Workflow
          </h3>
          <div className="glass-card p-8">
            <ol className="relative space-y-8 before:absolute before:inset-y-0 before:left-4 before:w-px before:bg-white/[0.08]">
              {steps.map((step, index) => (
                <li key={step.title} className="relative pl-12">
                  <div className="absolute left-0 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-[#7B5CFA]/45 bg-[#0D0D10] font-mono text-xs font-semibold text-[#C8BEFF]">
                    {index + 1}
                  </div>
                  <h4 className="mb-2 text-lg font-semibold tracking-[-0.025em]">{step.title}</h4>
                  <p className="text-sm font-light leading-[1.7] text-[#9A9AA5]">{step.copy}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="space-y-8">
          <h3 className="flex items-center gap-3 text-3xl font-semibold tracking-[-0.04em]">
            <FileJson className="text-[#7B5CFA]" /> MCP Toolkit
          </h3>
          <p className="font-light leading-[1.7] text-[#9A9AA5]">Any compliant AI bot can use the NeuroBase MCP interface:</p>
          <div className="overflow-hidden rounded-[10px] border border-white/[0.08] bg-[#0D0D10] font-mono text-sm">
            <div className="flex justify-between border-b border-white/[0.08] bg-white/[0.03] px-4 py-2 text-[#9A9AA5]">
              <span>mcp.call</span>
              <span>TypeScript shape</span>
            </div>
            <pre className="overflow-x-auto p-6 leading-[1.7] text-[#5EE7DF]/90">
{`type RecallMemoryRequest = {
  blobName: string;
  ownerAddress: string;
};

type RecallMemoryResponse = {
  status: "success";
  memoryId: string;
  content: string;
};`}
            </pre>
          </div>
        </section>

        <section className="flex items-center justify-between border-t border-white/[0.08] pt-8">
          <Link href="/dashboard" className="neuro-btn px-8 py-4 text-sm font-semibold">
            Open Dashboard <ArrowLeft className="h-4 w-4 rotate-180" />
          </Link>
          <a href="https://github.com/JohnsonNguyen-coll/neuro-base" target="_blank" className="text-sm font-semibold text-[#9A9AA5] transition-colors hover:text-[#F2F2F5]">
            View on GitHub
          </a>
        </section>
      </main>
    </div>
  );
}
