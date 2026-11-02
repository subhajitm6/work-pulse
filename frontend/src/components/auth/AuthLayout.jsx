import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Activity, CheckCircle2, TrendingUp, ShieldCheck, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { FloatingTaskIcons } from './FloatingTaskIcons';

export function AuthLayout() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-[#F7F8FA] dark:bg-[#111215] text-[#20242C] dark:text-[#F3F4F6] transition-colors duration-200 overflow-x-hidden">
      {/* Floating Animated Productivity Icons Background */}
      <FloatingTaskIcons />

      {/* Top Navbar */}
      <header className="relative z-10 px-6 py-4 flex items-center justify-between max-w-7xl w-full mx-auto">
        <Link to="/" className="flex items-center gap-2.5 group">
          <img
            src="/workpulse-logo.png"
            alt="WorkPulse"
            className="h-9 w-auto object-contain dark:hidden group-hover:scale-102 transition-transform"
          />
          <img
            src="/workpulse-logo-dark.png"
            alt="WorkPulse"
            className="h-9 w-auto object-contain hidden dark:block group-hover:scale-102 transition-transform"
          />
        </Link>

        {/* Theme switcher */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>
      </header>

      {/* Main Two-Column Auth Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 bg-white/95 dark:bg-[#181A1F]/95 backdrop-blur-sm rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden">
          
          {/* Left / Center Form Panel (7 cols on desktop) */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
            <Outlet />
          </div>

          {/* Right Branded Panel (5 cols on desktop, hidden on small screens) */}
          <div className="hidden lg:flex lg:col-span-5 bg-slate-50/70 dark:bg-[#15171B] border-l border-slate-200/70 dark:border-slate-800/80 p-8 flex-col justify-between relative overflow-hidden">
            {/* Subtle background decoration */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-brand-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="space-y-4 relative z-10">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-semibold">
                <TrendingUp className="w-3.5 h-3.5" />
                Work Efficiency
              </span>
              <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white leading-snug">
                Make every workday count.
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Organize your tasks, understand your progress, and build better work habits with WorkPulse.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="space-y-3 py-6 relative z-10">
              <div className="flex items-start gap-3 p-3 bg-white dark:bg-[#1C1E24] rounded-xl border border-slate-200/60 dark:border-slate-800/80 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-semibold text-slate-800 dark:text-slate-200">Unified Tracking</p>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px]">Tasks, milestones, and daily journals in one calm interface.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white dark:bg-[#1C1E24] rounded-xl border border-slate-200/60 dark:border-slate-800/80 shadow-2xs">
                <TrendingUp className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-semibold text-slate-800 dark:text-slate-200">Measurable Velocity</p>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px]">Actionable charts on on-time completion and sprint fidelity.</p>
                </div>
              </div>
            </div>

            {/* Security Notice Note */}
            <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-400 flex items-center gap-1.5 relative z-10">
              <ShieldCheck className="w-4 h-4 text-slate-400" />
              <span>Frontend Prototype • Demo mode active</span>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-400">
        <p>WorkPulse — Your work, organized.</p>
      </footer>
    </div>
  );
}

