
import React from 'react';
import { useLocation, Link } from 'react-router-dom';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Hoje', icon: <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /> },
    { path: '/history', label: 'Detalhes', icon: <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /> },
    { path: '/reports', label: 'Relatórios', icon: <path d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /> }
  ];

  return (
    <div className="min-h-screen pb-24 md:pb-0 md:pt-16 max-w-2xl mx-auto px-4">
      <main className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {children}
      </main>

      {/* Bottom Nav for Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-zinc-900/80 apple-blur border-t border-slate-200 dark:border-zinc-800 px-6 py-3 flex justify-around md:hidden no-print">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-blue-500' : 'text-slate-400'}`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {item.icon}
              </svg>
              <span className="text-[10px] font-medium uppercase tracking-widest">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Side Nav for Desktop */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 h-16 bg-white/80 dark:bg-zinc-900/80 apple-blur border-b border-slate-200 dark:border-zinc-800 px-8 items-center justify-between no-print z-50">
        <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">AURA</span>
        <div className="flex gap-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-sm font-medium transition-colors ${location.pathname === item.path ? 'text-blue-500' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'}`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
};
