"use client";

import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AptosWalletAdapterProvider autoConnect={true}>
      {children}
    </AptosWalletAdapterProvider>
  );
}
