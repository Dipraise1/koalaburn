import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function HomePage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background"></div>
        <div className="floating-leaves"></div>
        <div className="stars"></div>
        <div className="hero-content">
          <div>
            <h1 className="hero-title">
              Meet $KOALA – The Chillest Burn on Solana
            </h1>
            <p className="hero-subtitle">
              Where memes meet deflation — every transaction feeds the burn.
            </p>
            <div className="hero-buttons">
              <Link href="/burn" className="btn btn-primary">
                Burn with $KOALA
              </Link>
              <a href="#burn-leaderboard" className="btn btn-secondary">Track the Fire</a>
            </div>
          </div>
          <div className="hero-illustration">
            <div className="hero-image-container">
              <Image src="/koala-character.jpg" alt="Koala Mascot" fill className="hero-koala-image" sizes="(max-width: 600px) 100vw, 50vw" />
              <div className="floating-particle"></div>
              <div className="floating-particle"></div>
              <div className="floating-particle"></div>
              <div className="floating-particle"></div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <div className="container">
          <div className="section-header">
            <h2>About Koala</h2>
          </div>
          <div className="about-content">
            <div className="about-text">
              <h3>The Sleepy Koala's Awakening</h3>
              <p>
                Once upon a time in the Solana ecosystem, there lived a sleepy koala named $KOALA. This cuddly creature spent its days napping in eucalyptus trees, completely unaware of the blockchain revolution happening around it.
              </p>
              <p>
                One fateful day, $KOALA woke up to discover the power of burning SOL. Now this once-lazy marsupial has become the chillest burn master on Solana, turning every transaction into a cozy campfire that warms the entire ecosystem.
              </p>
              <div className="about-features">
                <div className="feature">
                  <h4>Deflationary Mechanics</h4>
                  <p>Every transaction automatically burns SOL, creating scarcity and value</p>
                </div>
                <div className="feature">
                  <h4>Community Driven</h4>
                  <p>Built by the community, for the community</p>
                </div>
                <div className="feature">
                  <h4>Transparent</h4>
                  <p>All burns are publicly verifiable on the Solana blockchain</p>
                </div>
              </div>
            </div>
            <div className="about-image-container">
              <Image src="/koala-meditation.jpg" alt="Sleepy Koala" fill className="about-koala-image" sizes="(max-width: 600px) 100vw, 50vw" />
              <div className="sleep-bubbles">
                <div className="bubble"></div>
                <div className="bubble"></div>
                <div className="bubble"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Burn Leaderboard Section */}
      <section id="burn-leaderboard" className="burn-leaderboard">
        <div className="container">
          <div className="section-header">
            <h2>Burn Leaderboard</h2>
            <p>Top token burners this week</p>
          </div>
          <div className="leaderboard">
            {/* No leaderboard data yet. Connect your wallet and burn tokens to appear here! */}
          </div>
          <div className="leaderboard-actions">
            <Link href="/burn" className="btn btn-primary">Start Burning</Link>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section id="community" className="community">
        <div className="container">
          <div className="section-header">
            <h2>Community Hub</h2>
            <p>Join our growing koala family</p>
          </div>
          <div className="community-content">
            <div className="social-feeds">
              <div className="twitter-feed">
                <h3>Latest from the Community</h3>
                <div className="feed-container">
                  <div className="tweet">
                    <div className="tweet-header">
                      <Image src="/koala-character.jpg" alt="Koala User" width={40} height={40} className="tweet-avatar" />
                      <div className="tweet-info">
                        <div className="tweet-name">KoalaFan123</div>
                        <div className="tweet-handle">@koalafan</div>
                      </div>
                    </div>
                    <div className="tweet-content">
                      Just burned some SOL with $KOALA! The chillest burn on Solana! #KoalaBurn
                    </div>
                    <div className="tweet-actions">
                      <span className="action">Like 42</span>
                      <span className="action">Retweet 12</span>
                      <span className="action">Reply 8</span>
                    </div>
                  </div>
                  {/* Add more tweets as needed */}
                </div>
              </div>
              <div className="meme-wall">
                <h3>Community Gallery</h3>
                <div className="meme-grid">
                  <div className="meme-item">
                    <Image src="/koala-meditation.jpg" alt="Koala Meditation" width={200} height={200} className="ecosystem-image" />
                  </div>
                  <div className="meme-item">
                    <Image src="/koala-outdoors.jpg" alt="Koala Outdoors" width={200} height={200} className="ecosystem-image" />
                  </div>
                  <div className="meme-item">
                    <Image src="/koala-character.jpg" alt="Koala Character" width={200} height={200} className="ecosystem-image" />
                  </div>
                  <div className="meme-item">
                    <Image src="/koala-forest.jpg" alt="Koala Forest" width={200} height={200} className="ecosystem-image" />
                  </div>
                </div>
              </div>
            </div>
            <div className="social-section">
              <h3>Join Our Community</h3>
              <div className="social-buttons">
                <a href="#" className="social-btn">
                  <span className="btn-icon">
                    <Image src="/koala-character.jpg" alt="Twitter" width={40} height={40} className="social-image" />
                  </span>
                  <span className="btn-content">
                    <span className="btn-title">Twitter</span>
                    <span className="btn-subtitle">Follow for updates</span>
                  </span>
                </a>
                <a href="#" className="social-btn">
                  <span className="btn-icon">
                    <Image src="/koala-outdoors.jpg" alt="Telegram" width={40} height={40} className="social-image" />
                  </span>
                  <span className="btn-content">
                    <span className="btn-title">Telegram</span>
                    <span className="btn-subtitle">Join the chat</span>
                  </span>
                </a>
                <a href="#" className="social-btn">
                  <span className="btn-icon">
                    <Image src="/koala-meditation.jpg" alt="Discord" width={40} height={40} className="social-image" />
                  </span>
                  <span className="btn-content">
                    <span className="btn-title">Discord</span>
                    <span className="btn-subtitle">Connect with us</span>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              <span className="logo-text">$KOALA</span>
              <p>The Chillest Burn on Solana</p>
            </div>
            <div className="footer-links">
              <div className="footer-section">
                <h4>Quick Links</h4>
                <a href="#burn">Burn</a>
                <a href="#about">About</a>
                <a href="#community">Community</a>
              </div>
              <div className="footer-section">
                <h4>Community</h4>
                <a href="#community">Join Us</a>
                <a href="#">Discord</a>
                <a href="#">Telegram</a>
              </div>
              <div className="footer-section">
                <h4>Resources</h4>
                <a href="#">Whitepaper</a>
                <a href="#">Audit</a>
                <a href="#">FAQ</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            &copy; 2024 $KOALA. The chillest burn on Solana.
          </div>
        </div>
      </footer>
    </main>
  );
} 