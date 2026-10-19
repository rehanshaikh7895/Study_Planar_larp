import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import type { NavTab } from '../../context/AppContext';
import {
  CalendarCheck,
  Timer,
  GraduationCap,
  TrendingUp,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Menu,
  X,
  Sparkles,
  BookOpen,
  User,
  LogOut,
} from 'lucide-react';

interface NavItem {
  id: NavTab;
  label: string;
  icon: React.ReactNode;
}

export const Navbar: React.FC = () => {
  const { data, activeTab, setActiveTab, toggleSound, toggleTheme, loadDemoMode, logout } = useApp();
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
    { id: 'landing', label: 'Home', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: 'exams', label: '1. Subjects & Exams', icon: <GraduationCap className="w-3.5 h-3.5" /> },
    { id: 'scheduler', label: '2. Smart Schedule', icon: <CalendarCheck className="w-3.5 h-3.5" /> },
    { id: 'focus', label: '3. Track & Focus', icon: <Timer className="w-3.5 h-3.5" /> },
    { id: 'analytics', label: '4. Progress', icon: <TrendingUp className="w-3.5 h-3.5" /> },
  ];

  const handleNavClick = (tab: NavTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isDarkMode = data.settings.theme === 'dark' || data.settings.theme === 'midnight';

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 font-sans ${
        isScrolled
          ? 'bg-white/95 dark:bg-[#08090E]/95 backdrop-blur-md border-b border-neutral-200/80 dark:border-neutral-800/80 shadow-xs py-2 sm:py-2.5'
          : 'bg-transparent py-2.5 sm:py-3.5 border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Left: Logo & Tagline */}
          <div
            onClick={() => handleNavClick('landing')}
            className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group shrink-0 select-none"
          >
            <div className="relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-neutral-100 dark:bg-neutral-800 border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] overflow-hidden group-hover:scale-105 transition-transform duration-200">
              <img
                src="/padhlo-mascot.png"
                alt="PadhloShawtys Mascot"
                className="w-full h-full object-cover object-top scale-125 translate-y-1"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-sans font-black text-base sm:text-lg tracking-tight text-black dark:text-white flex items-baseline gap-1">
                  <span className="font-extrabold text-neutral-700 dark:text-neutral-300">Padhlo</span>
                  <span className="bg-black text-white dark:bg-white dark:text-black px-1.5 sm:px-2 py-0.5 rounded-md text-xs sm:text-sm font-black tracking-tight uppercase italic">
                    SHAWTYS
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Center: Middle-Aligned Primary Navigation Bar (No streak/level clutter) */}
          <nav className="hidden lg:flex items-center justify-center gap-1 p-1 rounded-2xl bg-neutral-100/90 dark:bg-neutral-800/90 border border-neutral-200/80 dark:border-neutral-700/80 shadow-xs">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition-all duration-150 whitespace-nowrap font-sans cursor-pointer ${
                    isActive
                      ? 'bg-black text-white shadow-xs font-bold dark:bg-white dark:text-black'
                      : 'text-neutral-600 hover:text-black hover:bg-white/80 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-neutral-700/80 font-medium'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right: Actions & Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <button
              onClick={loadDemoMode}
              className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-xl bg-neutral-100 text-neutral-800 border border-neutral-300 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-200 dark:border-neutral-700 transition-all font-mono"
              title="Load sample dataset"
            >
              <Sparkles className="w-3 h-3 text-black dark:text-white" />
              <span>Demo</span>
            </button>

            {data.profile.isLoggedIn ? (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleNavClick('dashboard')}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-xs font-bold transition-all cursor-pointer"
                  title="Signed in account"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-black dark:text-white font-mono text-[11px] sm:text-xs max-w-[80px] sm:max-w-none truncate">
                    {data.profile.name}
                  </span>
                </button>
                <button
                  onClick={logout}
                  className="p-1.5 rounded-xl text-neutral-500 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNavClick('login')}
                className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 text-xs font-bold rounded-xl bg-white text-black border border-black hover:bg-neutral-100 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
              >
                <User className="w-3 h-3" />
                <span>Sign In</span>
              </button>
            )}

            <button
              onClick={() => handleNavClick('focus')}
              className="hidden sm:inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-xl bg-black hover:bg-neutral-800 text-white dark:bg-white dark:text-black dark:hover:bg-neutral-100 shadow-xs transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Timer className="w-3 h-3" />
              <span>Lock In</span>
            </button>

            <button
              onClick={toggleSound}
              className="p-1.5 sm:p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 transition-colors cursor-pointer"
              title={data.settings.soundEnabled ? 'Sound On' : 'Sound Muted'}
              aria-label="Toggle sound"
            >
              {data.settings.soundEnabled ? (
                <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black dark:text-white" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-400" />
              )}
            </button>

            <button
              onClick={toggleTheme}
              className="p-1.5 sm:p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 transition-colors cursor-pointer"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-200" />
              ) : (
                <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black" />
              )}
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 sm:p-2 lg:hidden rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200 cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer (Clean, Centered, No Streak/Level Distraction) */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[48px] sm:top-[56px] bg-white/98 dark:bg-[#0c0e17]/98 backdrop-blur-xl border-b border-neutral-200 dark:border-neutral-800 p-4 shadow-2xl animate-in fade-in slide-in-from-top-3 z-50">
          <div className="flex flex-col gap-2 max-w-sm mx-auto">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center justify-center gap-2 p-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                      : 'bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}

            <div className="pt-2 mt-1 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs px-1">
              <button
                onClick={() => {
                  loadDemoMode();
                  setMobileMenuOpen(false);
                }}
                className="text-neutral-600 dark:text-neutral-400 underline font-semibold text-[11px]"
              >
                Reset / Demo Data
              </button>

              {!data.profile.isLoggedIn ? (
                <button
                  onClick={() => handleNavClick('login')}
                  className="px-3.5 py-1.5 rounded-xl bg-black text-white dark:bg-white dark:text-black font-bold text-xs"
                >
                  Sign In
                </button>
              ) : (
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-rose-600 font-bold text-xs"
                >
                  Sign Out
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
