"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import dynamic from 'next/dynamic';
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const WalletMultiButtonDynamic = dynamic(
  () => import('@solana/wallet-adapter-react-ui').then(mod => mod.WalletMultiButton),
  { ssr: false }
);

export default function Navbar() {
  const { publicKey, connected } = useWallet();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close menu on route change (optional, for SPA navigation)
  React.useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          <Link href="/" className="nav-logo">
            <span className="logo-text">$KOALA</span>
          </Link>
          {/* Desktop Nav Links */}
          <div className="nav-links desktop-nav">
            <Link href="/#about" className="nav-link">About</Link>
            <Link href="/#community" className="nav-link">Community</Link>
            <Link href="/burn" className="nav-link">Burn</Link>
            <WalletMultiButtonDynamic className="btn-wallet-nav" />
          </div>
          {/* Hamburger Icon for Mobile */}
          <button
            className={`nav-toggle${menuOpen ? ' open' : ''}`}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav-links"
            onClick={() => setMenuOpen((open) => !open)}
            style={{ zIndex: 1300 }}
          >
            {menuOpen ? (
              <XMarkIcon className="w-8 h-8 text-blue-200" />
            ) : (
              <Bars3Icon className="w-8 h-8 text-blue-200" />
            )}
          </button>
        </div>
      </nav>
      {/* Mobile Overlay Menu (sibling, not nested) */}
      <div
        className={`mobile-menu-overlay${menuOpen ? ' open' : ''}`}
        aria-hidden={!menuOpen}
        inert={!menuOpen}
        style={{ pointerEvents: menuOpen ? 'auto' : 'none' }}
        onClick={() => {
          setMenuOpen(false);
          const btn = document.querySelector('.nav-toggle') as HTMLElement | null;
          btn?.focus();
        }}
      />
      <nav
        id="mobile-nav-links"
        className={`mobile-nav-links${menuOpen ? ' open' : ''}`}
        aria-hidden={!menuOpen}
        inert={!menuOpen}
        tabIndex={menuOpen ? 0 : -1}
        style={{ zIndex: 1301 }}
      >
        {/* Close button for mobile menu */}
        <button
          className="close-btn"
          aria-label="Close menu"
          onClick={() => {
            setMenuOpen(false);
            const btn = document.querySelector('.nav-toggle') as HTMLElement | null;
            btn?.focus();
          }}
          tabIndex={menuOpen ? 0 : -1}
        >
          &times;
        </button>
        <Link href="/#about" className="nav-link" onClick={() => setMenuOpen(false)}>About</Link>
        <Link href="/#community" className="nav-link" onClick={() => setMenuOpen(false)}>Community</Link>
        <Link href="/burn" className="nav-link" onClick={() => setMenuOpen(false)}>Burn</Link>
        <WalletMultiButtonDynamic className="btn-wallet-nav" />
      </nav>
    </>
  );
} 