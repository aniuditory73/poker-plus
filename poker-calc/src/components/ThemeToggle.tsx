'use client';

import { useState, useEffect } from 'react';

export default function ThemeToggle() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const theme = localStorage.getItem('poker-theme') || 'dark';
    setDark(theme !== 'light');
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    const val = next ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', val);
    localStorage.setItem('poker-theme', val);
  };

  return (
    <button
      onClick={toggle}
      className="w-7 h-7 rounded-lg flex items-center justify-center text-sm transition-colors"
      style={{ background: 'var(--bg-input)', color: 'var(--text-secondary)' }}
      title={dark ? 'Светлая тема' : 'Тёмная тема'}
    >
      {dark ? '☀' : '☾'}
    </button>
  );
}
