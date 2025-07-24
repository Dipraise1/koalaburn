"use client";

import React from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useBurner } from "../../hooks/useBurner";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const WalletMultiButtonDynamic = dynamic(
  () =>
    import("@solana/wallet-adapter-react-ui").then(
      (mod) => mod.WalletMultiButton
    ),
  { ssr: false }
);

export default function BurnPage() {
  const {
    scannedTokens,
    loading,
    burning,
    burnStats,
    recentBurns,
    error,
    scanTokens,
    toggleToken,
    selectAll,
    burnSelected,
    connected,
    isTokenBurnt,
  } = useBurner();

  React.useEffect(() => {
    if (error) {
      toast.error(error);
    }

    if (!burning && !error && isTokenBurnt && connected) {
      toast.success("Burn complete!");
    }
  }, [burning, error, scannedTokens?.length, connected, isTokenBurnt]);

  return (
    <main>
      {/* Header */}
      <section className="burn-header">
        <motion.h1
          className=""
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Burn Dead Tokens
        </motion.h1>
        <motion.p
          className=""
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          Clean your wallet and reclaim SOL from worthless tokens
        </motion.p>
        <motion.div
          className="burn-stats-overview"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div className="stat-item">
            <div className="stat-value">{burnStats.sol.toFixed(3)}</div>
            <div className="stat-label">Total SOL Burned</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{burnStats.tokens}</div>
            <div className="stat-label">Tokens Burned</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{burnStats.users}</div>
            <div className="stat-label">Active Users</div>
          </div>
        </motion.div>
      </section>

      {/* Wallet Connect */}
      <section className="wallet-connect-section">
        <WalletMultiButtonDynamic />
      </section>

      {/* Burn Interface */}
      <motion.section
        className="burn-interface-section"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
      >
        <div className="burn-interface">
          {/* Token Scanner */}
          <div className="scanner-section">
            <div className="scanner-header">
              <h3>Token Scanner</h3>
              <p>Scan your wallet for dead tokens</p>
            </div>
            <div className="scanner-controls">
              <button
                className="btn btn-scan"
                onClick={scanTokens}
                disabled={!connected || loading}
              >
                <span>{loading ? "Scanning..." : "Scan Wallet"}</span>
              </button>
            </div>
          </div>
          {/* Token Results */}
          <div className="tokens-section">
            <div className="tokens-header">
              <h3>Dead Tokens Found</h3>
              <div className="tokens-summary">
                {scannedTokens?.length} tokens found • Potential savings:{" "}
                <span className="potential-savings">
                  {(
                    scannedTokens?.filter((t) => t.selected).length * 0.002
                  ).toFixed(3)}
                </span>{" "}
                SOL
              </div>
            </div>
            <div className="tokens-list">
              <AnimatePresence>
                {scannedTokens?.length === 0 ? (
                  <motion.div
                    className=""
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    No tokens found yet.
                  </motion.div>
                ) : (
                  scannedTokens?.map((token) => (
                    <motion.div
                      key={token.id}
                      className="token-item"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                    >
                      <div className="token-info">
                        <div className="token-name">
                          <span className="token-symbol">{token.symbol}</span>
                          <span className="token-full-name">{token.name}</span>
                        </div>
                        <div className="token-address">
                          {token.address.slice(0, 8)}...
                          {token.address.slice(-8)}
                        </div>
                      </div>
                      <div className="token-balance">
                        <span className="balance-amount">{token.balance}</span>
                        <span className="balance-symbol">{token.symbol}</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={token.selected}
                        onChange={(e) =>
                          toggleToken(token.id, e.target.checked)
                        }
                        className="token-checkbox"
                      />
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
            {scannedTokens?.length > 0 && (
              <div className="burn-controls">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    checked={scannedTokens?.every((t) => t.selected)}
                    onChange={(e) => selectAll(e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  <span>Select all tokens</span>
                </label>
                {/* Mint NFT option placeholder */}
                <label className="checkbox-container">
                  <input type="checkbox" disabled />
                  <span className="checkmark"></span>
                  <span>Mint Koala Ash NFT after burn</span>
                </label>
                <button
                  className="btn btn-burn-all"
                  onClick={burnSelected}
                  disabled={
                    burning ||
                    scannedTokens?.filter((t) => t.selected).length === 0
                  }
                >
                  <span>{burning ? "Burning..." : "Burn Selected Tokens"}</span>
                </button>
              </div>
            )}
          </div>
          {/* Burn Animation Placeholder */}
          <AnimatePresence>
            {burning && (
              <motion.div
                className="burn-animation"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <div className="koala-burner">
                  <div className="koala-character">
                    <Image
                      src="/happy-3d-cartoon-animal-outdoors-grassland.jpg"
                      alt="Koala Burner"
                      width={120}
                      height={120}
                      className="koala-img"
                    />
                  </div>
                  <div className="fire-effect">
                    <div className="flame flame-1"></div>
                    <div className="flame flame-2"></div>
                    <div className="flame flame-3"></div>
                  </div>
                </div>
                <div className="burn-status">
                  <h3>Burning tokens...</h3>
                  <p>Processing transaction...</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.section>

      {/* Recent Burns */}
      <motion.section
        className="recent-burns"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
      >
        <div className="section-header">
          <h2>Recent Burns</h2>
          <p>Latest token burning activity</p>
        </div>
        <div className="burns-list">
          <AnimatePresence>
            {recentBurns.length === 0 ? (
              <motion.div
                className="burn-item"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="burn-info">
                  <div className="burn-address">No recent burns</div>
                  <div className="burn-details">
                    Connect wallet to see burns
                  </div>
                </div>
                <div className="burn-amount">+0.000 SOL</div>
              </motion.div>
            ) : (
              recentBurns.map(
                (
                  burn: {
                    address: string;
                    tokens: number;
                    sol: number;
                    time: string;
                  },
                  i: number
                ) => (
                  <motion.div
                    key={i}
                    className="burn-item"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                  >
                    <div className="burn-info">
                      <div className="burn-address">{burn.address}</div>
                      <div className="burn-details">
                        {burn.tokens} tokens • {burn.time}
                      </div>
                    </div>
                    <div className="burn-amount">
                      +{burn.sol.toFixed(3)} SOL
                    </div>
                  </motion.div>
                )
              )
            )}
          </AnimatePresence>
        </div>
      </motion.section>
    </main>
  );
}
