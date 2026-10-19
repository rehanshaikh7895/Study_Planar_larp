import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { ScrollProgress } from './components/common/ScrollProgress';
import { ToastContainer } from './components/common/ToastContainer';
import { LandingView } from './components/landing/LandingView';
import { DashboardView } from './components/dashboard/DashboardView';
import { SchedulerView } from './components/scheduler/SchedulerView';
import { TasksView } from './components/tasks/TasksView';
import { FocusTimerView } from './components/focus/FocusTimerView';
import { ExamsView } from './components/exams/ExamsView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { GamificationView } from './components/gamification/GamificationView';
import { SettingsView } from './components/settings/SettingsView';
import { LoginView } from './components/auth/LoginView';
import { Zap, Shield } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, setActiveTab, loadDemoMode } = useApp();
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFD] dark:bg-[#08090E] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300 bg-mesh-gradient">
      <ScrollProgress />
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-6">
        {activeTab === 'landing' && <LandingView />}

        {activeTab === 'login' && <LoginView />}

        {activeTab === 'dashboard' && (
          <DashboardView onOpenAddTask={() => setIsAddTaskModalOpen(true)} />
        )}

        {activeTab === 'scheduler' && <SchedulerView />}

        {activeTab === 'tasks' && (
          <TasksView
            isOpenAddModal={isAddTaskModalOpen}
            onOpenAddModal={() => setIsAddTaskModalOpen(true)}
            onCloseAddModal={() => setIsAddTaskModalOpen(false)}
          />
        )}

        {activeTab === 'focus' && <FocusTimerView />}

        {activeTab === 'exams' && <ExamsView />}

        {activeTab === 'analytics' && <AnalyticsView />}

        {activeTab === 'gamification' && <GamificationView />}

        {activeTab === 'settings' && <SettingsView />}
      </main>

      {/* Global Quick Add Task Modal when opened from other screens */}
      {activeTab !== 'tasks' && isAddTaskModalOpen && (
        <TasksView
          isOpenAddModal={isAddTaskModalOpen}
          onOpenAddModal={() => setIsAddTaskModalOpen(true)}
          onCloseAddModal={() => setIsAddTaskModalOpen(false)}
        />
      )}

      {/* Footer */}
      <footer className="mt-16 border-t border-neutral-200 bg-white py-10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-black flex items-center justify-center text-white">
              <Zap className="w-3.5 h-3.5 fill-white" />
            </div>
            <span className="font-sans font-black tracking-tight text-black text-sm">
              PADHLO <span className="text-black underline decoration-2 underline-offset-4">SHAWTYS</span>
            </span>
            <span>•</span>
            <span className="font-medium text-neutral-500">
              Kyu nhi hori padhai? PadhloShawtys pe lock in karo! 🔥
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-neutral-600 font-bold">
            <button
              onClick={() => setActiveTab('exams')}
              className="hover:text-black transition-colors"
            >
              1. Subjects & Exams
            </button>
            <button
              onClick={() => setActiveTab('scheduler')}
              className="hover:text-black transition-colors"
            >
              2. Smart Schedule
            </button>
            <button
              onClick={() => setActiveTab('focus')}
              className="hover:text-black transition-colors"
            >
              3. Track & Focus
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className="hover:text-black transition-colors"
            >
              4. Progress & Streaks
            </button>
            <button
              onClick={loadDemoMode}
              className="text-black underline hover:text-neutral-700 font-bold"
            >
              Reset / Demo Data
            </button>
          </div>

          <div className="flex items-center gap-1 font-mono text-[11px] text-slate-400">
            <span>Client-side persistent storage</span>
            <span>•</span>
            <Shield className="w-3.5 h-3.5 text-emerald-500" />
            <span>Zero telemetry</span>
          </div>
        </div>
      </footer>

      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
