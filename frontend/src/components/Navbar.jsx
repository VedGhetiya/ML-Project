import React, { useState, useEffect } from 'react';
import { Eye, Wifi, WifiOff, Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Insights', href: '#insights' },
  { label: 'Assessment', href: '#prediction-form' },
  { label: 'About', href: '#about' },
];

export default function Navbar({ backendOnline }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (href) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className={`navbar-wrap ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar glass-card">
        <div className="brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="brand-icon">
            <Eye size={24} />
          </div>
          <div className="brand-text">
            <h1>CardioVision AI</h1>
            <p>Predictive Cardiovascular Intelligence</p>
          </div>
        </div>

        <nav className="nav-links">
          {NAV_LINKS.map((link) => (
            <button key={link.href} className="nav-link" onClick={() => handleNavClick(link.href)}>
              {link.label}
            </button>
          ))}
        </nav>

        <div className="navbar-right">
          <div className="status-badge">
            <div className={`dot ${backendOnline ? 'online' : 'offline'}`}></div>
            <span>{backendOnline ? 'Model Online' : 'AI Engine Ready'}</span>
            {backendOnline ? <Wifi size={13} color="#10b981" /> : <Wifi size={13} color="#6366f1" />}
          </div>

          <button className="menu-toggle" onClick={() => setMenuOpen((v) => !v)} aria-label="Toggle menu">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="mobile-menu glass-card">
          {NAV_LINKS.map((link) => (
            <button key={link.href} className="mobile-nav-link" onClick={() => handleNavClick(link.href)}>
              {link.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
