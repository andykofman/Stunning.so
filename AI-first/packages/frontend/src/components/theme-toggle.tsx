"use client";
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const saved = localStorage.getItem('theme');
    const initialDark = saved ? saved === 'dark' : prefersDark;
    setDark(initialDark);
    document.documentElement.classList.toggle('dark', initialDark);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  if (!mounted) return null;

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="relative inline-flex h-10 w-20 items-center rounded-full bg-white/10 p-1 shadow-glow ring-1 ring-white/20 backdrop-blur transition hover:scale-105 dark:bg-black/20"
    >
      <span
        className={
          'inline-flex h-8 w-8 transform items-center justify-center rounded-full bg-gradient-to-br from-neon-pink to-neon-violet text-xs font-bold text-white shadow-lg transition ' +
          (dark ? 'translate-x-10' : 'translate-x-0')
        }
      >
        {dark ? '🌙' : '☀️'}
      </span>
    </button>
  );
}


