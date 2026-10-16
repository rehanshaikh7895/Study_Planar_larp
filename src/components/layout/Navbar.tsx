import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import type { NavTab } from '../../context/AppContext';
import {
  LayoutDashboard,
  CalendarCheck,
  CheckSquare,
  Timer,
  GraduationCap,
  TrendingUp,
  Trophy,
  Settings,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Menu,
  X,
  Flame,
  Sparkles,
  BookOpen,
} from 'lucide-react';

interface NavItem {
  id: NavTab;
  label: string;
  icon: React.ReactNode;
  badge?: string;
}

export const Navbar: React.FC = () => {
  const { data, activeTab, setActiveTab, toggleSound, toggleTheme, loadDemoMode } = useApp();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: NavItem[] = [
    { id: 'landing', label: 'Home', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'dashboard', label: 'Command Center', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'scheduler', label: 'Smart Scheduler', icon: <CalendarCheck className="w-4 h-4" /> },
    {
      id: 'tasks',
      label: 'Tasks',
      icon: <CheckSquare className="w-4 h-4" />,
      badge: `${data.tasks.filter((t) => t.status !== 'completed').length}`,
    },
    { id: 'focus', label: 'Lock In', icon: <Timer className="w-4 h-4" /> },
    { id: 'exams', label: 'Exams & Syllabus', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'analytics', label: 'Comeback Analytics', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'gamification', label: 'Quests & XP', icon: <Trophy className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const handleNavClick = (tab: NavTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isDarkMode = data.settings.theme === 'dark' || data.settings.theme === 'midnight';

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 dark:bg-[#08090E]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-purple-500/15 shadow-sm py-2.5'
          : 'bg-transparent py-4 border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Logo & Tagline */}
          <div
            onClick={() => handleNavClick('dashboard')}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 border border-indigo-200/80 shadow-sm overflow-hidden group-hover:scale-105 transition-transform duration-200">
              <img
                src="/padhlo-mascot.png"
                alt="PadhloShawtys Mascot"
                className="w-full h-full object-cover object-top scale-125 translate-y-1"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-xl tracking-tight text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                  Padhlo<span className="text-indigo-600">Shawtys</span>
                </span>
                <span className="text-[10px] uppercase font-mono tracking-widest px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold">
                  OS v2.0
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-mono tracking-tight hidden sm:block">
                Kyu nhi hori padhai? 😭🔥
              </p>
            </div>
          </div>

          {/* Gamification Stats Pill (Desktop) */}
          <div className="hidden lg:flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium shadow-sm">
            <div
              onClick={() => handleNavClick('gamification')}
              className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 cursor-pointer hover:opacity-80 transition-opacity"
              title="Current daily study streak"
            >
              <Flame className="w-4 h-4 fill-amber-500 animate-bounce" />
              <span className="font-mono font-bold">{data.profile.streakDays}d Streak</span>
            </div>

            <div className="w-px h-3 bg-slate-200 dark:bg-slate-700" />

            <div
              onClick={() => handleNavClick('gamification')}
              className="flex items-center gap-1.5 text-indigo-600 dark:text-purple-400 cursor-pointer hover:opacity-80 transition-opacity"
              title="Current level and XP progress"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="font-mono font-bold">Lvl {data.profile.level}</span>
              <span className="text-slate-400 font-mono text-[10px]">
                ({data.profile.currentXP}/{data.profile.targetXP} XP)
              </span>
            </div>
          </div>

          {/* Action Buttons & Desktop Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={loadDemoMode}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition-all hover:scale-[1.02] shadow-xs"
              title="Load complete sample data for academic comeback"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Load Demo Data</span>
            </button>

            <button
              onClick={() => handleNavClick('focus')}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white shadow-[0_4px_14px_rgba(99,102,241,0.35)] transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <Timer className="w-3.5 h-3.5" />
              <span>Lock In Now</span>
            </button>

            <button
              onClick={toggleSound}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors"
              title={data.settings.soundEnabled ? 'Sound On' : 'Sound Muted'}
              aria-label="Toggle sound"
            >
              {data.settings.soundEnabled ? (
                <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-400" />
              )}
            </button>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-500" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 lg:hidden rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Desktop Secondary Navigation Bar */}
        <nav className="hidden lg:flex items-center gap-1.5 mt-3 pt-2.5 border-t border-slate-200/80 dark:border-slate-800/60 overflow-x-auto scrollbar-none">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`ml-1 text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isActive ? 'bg-white text-indigo-700 font-bold' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[65px] bg-white/95 dark:bg-[#0c0e17]/95 backdrop-blur-xl border-b border-slate-200 dark:border-purple-500/20 p-4 shadow-2xl animate-in fade-in slide-in-from-top-3">
          <div className="flex items-center justify-between p-3 mb-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-2 text-amber-600 font-mono font-bold">
              <Flame className="w-4 h-4 fill-amber-500" />
              <span>{data.profile.streakDays}d Streak</span>
            </div>
            <div className="flex items-center gap-2 text-indigo-600 font-mono font-bold">
              <Sparkles className="w-4 h-4" />
              <span>Lvl {data.profile.level}</span>
            </div>
            <button
              onClick={() => {
                loadDemoMode();
                setMobileMenuOpen(false);
              }}
              className="text-indigo-600 underline font-semibold text-[11px]"
            >
              Demo Data
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2.5 p-3 rounded-xl text-xs font-semibold text-left transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-700">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
