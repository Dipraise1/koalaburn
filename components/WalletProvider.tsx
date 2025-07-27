"use client";
import React, { FC, ReactNode, useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider as SolanaWalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";

export const WalletProvider: FC<{ children: ReactNode }> = ({ children }) => {
  // Use your QuickNode endpoint or fallback to mainnet-beta
  const endpoint = useMemo(
    () =>
      process.env.NEXT_PUBLIC_HELIUS_SOLANA_URL ||
      "https://api.mainnet-beta.solana.com",
    []
  );

  const wallets = useMemo(
    () => [
      new SolflareWalletAdapter(),
      // new WalletConnectWalletAdapter(), // Uncomment and configure if needed
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
};
