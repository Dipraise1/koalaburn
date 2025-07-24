"use client";

import { useCallback, useMemo, useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import {
  PublicKey,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  getMint,
  getAccount,
  createBurnInstruction,
  createCloseAccountInstruction,
  ACCOUNT_SIZE,
} from "@solana/spl-token";
import axios from "axios";

// Constants
const SOL_LAMPORTS = 1e9;
const TOKEN_ACCOUNT_RENT = 165;
const DUST_THRESHOLD = 1;
const CHUNK_SIZE = 8;

// Types
interface TokenAccount {
  id: number;
  name: string;
  symbol: string;
  address: string;
  mint: string;
  balance: number;
  decimals: number;
  amountRaw: string;
  logo?: string;
  selected: boolean;
}

interface BurnStats {
  sol: number;
  tokens: number;
  users: number;
  fees: number;
}

interface RecentBurn {
  address: string;
  tokens: number;
  sol: number;
  time: string;
}

interface BurnProgress {
  current: number;
  total: number;
}

export function useBurner() {
  const { connection } = useConnection();
  const { publicKey, wallet, connected, sendTransaction } = useWallet();

  const [scannedTokens, setScannedTokens] = useState<TokenAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [burning, setBurning] = useState(false);
  const [burnProgress, setBurnProgress] = useState<BurnProgress>({
    current: 0,
    total: 0,
  });
  const [burnStats, setBurnStats] = useState<BurnStats>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem("burnStats");
      return saved ? JSON.parse(saved) : { sol: 0, tokens: 0, users: 0, fees: 0 };
    }
    return { sol: 0, tokens: 0, users: 0, fees: 0 };
  });
  const [recentBurns, setRecentBurns] = useState<RecentBurn[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem("recentBurns");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [error, setError] = useState<string | null>(null);
  const [isTokenBurnt, setIsTokenBurnt] = useState(false);

  // Cache for mint info
  const mintCache = useMemo(
    () => new Map<string, { decimals: number; symbol?: string }>(),
    []
  );

  // Fetch mint info with caching
  const fetchMintInfo = useCallback(
    async (mintAddress: string) => {
      if (mintCache.has(mintAddress)) {
        return mintCache.get(mintAddress)!;
      }
      try {
        const mintInfo = await getMint(connection, new PublicKey(mintAddress));
        const data = {
          decimals: mintInfo.decimals,
          symbol: mintAddress.slice(0, 4).toUpperCase() + "...",
        };
        mintCache.set(mintAddress, data);
        // TODO: Fetch real token metadata from Metaplex or token list
        return data;
      } catch {
        const data = { decimals: 9, symbol: "UNKNOWN" };
        mintCache.set(mintAddress, data);
        return data;
      }
    },
    [connection, mintCache]
  );

  // Scan for SPL tokens
  const scanTokens = useCallback(async () => {
    if (!publicKey) {
      setError("Wallet not connected");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const moralisQuery = await axios.get(
        `https://solana-gateway.moralis.io/account/mainnet/${publicKey}/portfolio`,
        {
          headers: {
            accept: "application/json",
            "X-API-Key": process.env.NEXT_PUBLIC_MORALIS_KEY,
          },
          params: {
            nftMetadata: true,
            mediaItems: false,
            excludeSpam: false,
          },
        }
      );
      const moralisTokens: TokenAccount[] = moralisQuery?.data?.tokens?.map(
        (token: any, i: any) => ({
          id: token.associatedTokenAddress, // use ATA as ID
          name: token.name || `Token ${i + 1}`,
          symbol: token.symbol || "UNKNOWN",
          address: token.associatedTokenAddress,
          mint: token.mint,
          balance: parseFloat(token.amount),
          amountRaw: token.amountRaw,
          decimals: token.decimals,
          logo: token.logo,
          selected: true,
        })
      );

      // const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
      //   publicKey,
      //   {
      //     programId: TOKEN_PROGRAM_ID,
      //   }
      // );

      // const filtered = tokenAccounts.value.filter((account) => {
      //   const balance = parseFloat(
      //     account.account.data.parsed.info.tokenAmount.uiAmount
      //   );
      //   return balance > 0 && balance < DUST_THRESHOLD;
      // });

      // const tokens: TokenAccount[] = await Promise.all(
      //   tokenAccounts?.value?.map(async (account, i) => {
      //     const mintAddress = account.account.data.parsed.info.mint;
      //     const mintInfo = await fetchMintInfo(mintAddress);
      //     return {
      //       id: i,
      //       name: `Token ${i + 1}`,
      //       symbol: mintInfo.symbol || "UNKNOWN",
      //       address: account.pubkey.toString(),
      //       mint: mintAddress,
      //       balance: parseFloat(
      //         account.account.data.parsed.info.tokenAmount.uiAmount
      //       ),
      //       decimals: mintInfo.decimals,
      //       selected: true,
      //     };
      //   })
      // );

      setScannedTokens(moralisTokens);
    } catch (e: any) {
      setError(e.message || "Failed to scan tokens");
    } finally {
      setLoading(false);
    }
  }, [connection, publicKey, fetchMintInfo]);

  // Select/deselect tokens
  const toggleToken = useCallback((id: number, selected: boolean) => {
    setScannedTokens((tokens) =>
      tokens.map((t) => (t.id === id ? { ...t, selected } : t))
    );
  }, []);

  const selectAll = useCallback((selected: boolean) => {
    setScannedTokens((tokens) => tokens.map((t) => ({ ...t, selected })));
  }, []);

  // Burn selected tokens in batches

  // const burnSelected = useCallback(async () => {
  //   if (!publicKey || !wallet || !sendTransaction) {
  //     setError("Wallet not connected or transaction not supported");
  //     return;
  //   }
  //   setBurning(true);
  //   setError(null);
  //   try {
  //     const tokensToBurn = scannedTokens.filter((t) => t.selected);
  //     if (tokensToBurn.length === 0) {
  //       setError("No tokens selected for burning");
  //       return;
  //     }
  //     setBurnProgress({ current: 0, total: tokensToBurn.length });

  //     const instructions: TransactionInstruction[] = [];
  //     let totalSol = 0;
  //     let burnedCount = 0;

  //     for (const token of tokensToBurn) {
  //       try {
  //         const mintAddress = new PublicKey(token.mint);
  //         const tokenAccountAddress = new PublicKey(token.address);
  //         const tokenAccountInfo = await getAccount(
  //           connection,
  //           tokenAccountAddress
  //         );
  //         const tokenBalance = Number(tokenAccountInfo.amount);
  //         if (tokenBalance === 0) continue;

  //         instructions.push(
  //           createBurnInstruction(
  //             tokenAccountAddress,
  //             mintAddress,
  //             publicKey,
  //             tokenBalance
  //           ),
  //           createCloseAccountInstruction(
  //             tokenAccountAddress,
  //             publicKey,
  //             publicKey
  //           )
  //         );
  //         const rentExemption =
  //           await connection.getMinimumBalanceForRentExemption(
  //             TOKEN_ACCOUNT_RENT
  //           );
  //         totalSol += rentExemption / SOL_LAMPORTS;
  //         burnedCount++;
  //       } catch (e) {
  //         console.warn(`Failed to process token ${token.address}:`, e);
  //         continue;
  //       }
  //       setBurnProgress((p) => ({ ...p, current: p.current + 1 }));
  //     }

  //     if (instructions.length > 0) {
  //       const tx = new Transaction().add(...instructions);
  //       tx.feePayer = publicKey;
  //       const sig = await sendTransaction(tx, connection);
  //       await connection.confirmTransaction(sig, "finalized");
  //     }

  //     setBurnStats((stats) => ({
  //       sol: stats.sol + totalSol,
  //       tokens: stats.tokens + burnedCount,
  //       users: stats.users + 1,
  //     }));
  //     setRecentBurns((burns) => [
  //       {
  //         address: publicKey.toBase58(),
  //         tokens: burnedCount,
  //         sol: totalSol,
  //         time: new Date().toISOString(),
  //       },
  //       ...burns.slice(0, 4),
  //     ]);
  //     setScannedTokens((tokens) => tokens.filter((t) => !t.selected));
  //   } catch (e: any) {
  //     setError(e.message || "Failed to burn tokens");
  //   } finally {
  //     setBurning(false);
  //     setBurnProgress({ current: 0, total: 0 });
  //   }
  // }, [connection, publicKey, wallet, sendTransaction, scannedTokens]);

  const burnSelected = useCallback(async () => {
    if (!publicKey || !wallet || !sendTransaction) {
      setError("Wallet not connected or transaction not supported");
      return;
    }

    setBurning(true);
    setIsTokenBurnt(false);
    setError(null);

    try {
      const tokensToBurn = scannedTokens.filter(
        (t) => t.selected && Number(t.amountRaw) > 0
      );
      if (tokensToBurn.length === 0) {
        setError("No eligible tokens selected for burning");
        return;
      }

      setBurnProgress({ current: 0, total: tokensToBurn.length });

      const rentExemptionLamports =
        await connection.getMinimumBalanceForRentExemption(ACCOUNT_SIZE);
      const instructionsChunks: TransactionInstruction[][] = [];
      const CHUNK_SIZE = 8;

      let totalRentRecovered = 0;
      let burnedCount = 0;
      let currentChunk: TransactionInstruction[] = [];

      for (const token of tokensToBurn) {
        try {
          const mintAddress = new PublicKey(token.mint);
          const tokenAccountAddress = new PublicKey(token.address);
          const tokenBalance = Number(token.amountRaw);

          // Create burn + close instructions
          const burnIx = createBurnInstruction(
            tokenAccountAddress,
            mintAddress,
            publicKey,
            tokenBalance
          );
          const closeIx = createCloseAccountInstruction(
            tokenAccountAddress,
            publicKey,
            publicKey
          );

          currentChunk.push(burnIx, closeIx);
          totalRentRecovered += rentExemptionLamports / SOL_LAMPORTS;
          burnedCount++;

          // Push and reset chunk if full
          if (currentChunk.length >= CHUNK_SIZE) {
            instructionsChunks.push(currentChunk);
            currentChunk = [];
          }

          setBurnProgress((p) => ({ ...p, current: p.current + 1 }));
        } catch (err) {
          console.warn(`Error processing token ${token.mint}:`, err);
          continue;
        }
      }

      // Push any remaining instructions
      if (currentChunk.length > 0) {
        instructionsChunks.push(currentChunk);
      }

      if (instructionsChunks.length === 0) {
        setError("No instructions to process (check balances)");
        return;
      }

      let totalFeesSol = 0;

      for (const chunk of instructionsChunks) {
        const tx = new Transaction().add(...chunk);
        tx.feePayer = publicKey;

        const latestBlockhash =
          await connection.getLatestBlockhash("finalized");
        tx.recentBlockhash = latestBlockhash.blockhash;

        let sig: string;
        try {
          sig = await sendTransaction(tx, connection);
        } catch (err: any) {
          console.error("sendTransaction failed:", err);
          throw new Error("Transaction rejected or failed to send.");
        }

        await connection.confirmTransaction(
          {
            signature: sig,
            blockhash: latestBlockhash.blockhash,
            lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
          },
          "finalized"
        );

        const txDetails = await connection.getTransaction(sig, {
          commitment: "finalized",
          maxSupportedTransactionVersion: 0,
        });

        const feeLamports = txDetails?.meta?.fee ?? 0;
        totalFeesSol += feeLamports / SOL_LAMPORTS;
      }

      // Update stats
      setBurnStats((stats) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem(
            "burnStats",
            JSON.stringify({
              sol: stats.sol + totalRentRecovered,
              tokens: stats.tokens + burnedCount,
              users: stats.users + 1,
              fees: (stats.fees || 0) + totalFeesSol,
            })
          );
        }
        return {
          sol: stats.sol + totalRentRecovered,
          tokens: stats.tokens + burnedCount,
          users: stats.users + 1,
          fees: (stats.fees || 0) + totalFeesSol,
        };
      });

      setRecentBurns((burns) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem(
            "recentBurns",
            JSON.stringify([
              {
                address: publicKey.toBase58(),
                tokens: burnedCount,
                sol: totalRentRecovered,
                fees: totalFeesSol,
                time: new Date().toISOString(),
              },
              ...burns.slice(0, 4),
            ])
          );
        }
        return [
          {
            address: publicKey.toBase58(),
            tokens: burnedCount,
            sol: totalRentRecovered,
            fees: totalFeesSol,
            time: new Date().toISOString(),
          },
          ...burns.slice(0, 4),
        ];
      });
      setScannedTokens((tokens) => tokens.filter((t) => !t.selected));
      setIsTokenBurnt(true);
    } catch (e: any) {
      console.error("Burn failed:", e);
      setError(e.message || "Failed to burn tokens");
    } finally {
      setBurning(false);
      setBurnProgress({ current: 0, total: 0 });
    }
  }, [connection, publicKey, wallet, sendTransaction, scannedTokens]);

  return {
    scannedTokens,
    loading,
    burning,
    burnProgress,
    burnStats,
    recentBurns,
    error,
    scanTokens,
    toggleToken,
    selectAll,
    burnSelected,
    connected,
    isTokenBurnt,
  };
}
