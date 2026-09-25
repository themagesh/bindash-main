'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Crown,
  Heart,
  History,
  Menu,
  Moon,
  Sun,
  Target,
  TrendingUp,
  CircleDollarSign,
  X,
} from 'lucide-react';
import { useTheme } from '@/components/ThemeContext';

const NAV_ITEMS = [
  { href: '/', label: 'Futures', icon: TrendingUp },
  { href: '/spot', label: 'Spot', icon: CircleDollarSign },
  { href: '/compound', label: 'Goal', icon: Target },
  { href: '/trades', label: 'History', icon: History },
];

export default function Navbar({ progressData }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { darkMode, toggleDarkMode } = useTheme();

  const percent = Math.round(progressData?.tradesProgress || 0);

  return (
    <header className="topbar nav-shared">
      <div className="brand">
        <div className="crown-logo">
          <Crown size={42} strokeWidth={2.5} />
          <span className="crown-face">⌣</span>
        </div>
        <span className="brand-name">Sweety</span>
        <Heart className="heart" size={19} fill="currentColor" />
      </div>

      <nav className={`nav ${menuOpen ? 'open' : ''}`}>
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`pill-button ${pathname === href ? 'active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>

      {progressData && (
        <div className="top-progress">
          <span className="percent">{percent}%</span>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${Math.max(percent, 4)}%` }} />
          </div>
          {progressData.currentTradeNum && <b>Trade {progressData.currentTradeNum}</b>}
          <span><strong>$100K</strong></span>
          <Heart size={18} className="heart" />
        </div>
      )}

      <button
        className="theme-toggle"
        onClick={toggleDarkMode}
        aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        title={darkMode ? 'Light mode' : 'Dark mode'}
      >
        {darkMode ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      <button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
        {menuOpen ? <X /> : <Menu />}
      </button>
    </header>
  );
}
