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
import { Zap, Shield } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, setActiveTab, loadDemoMode } = useApp();
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFD] dark:bg-[#08090E] text-slate-900 dark:text-slate-100 transition-colors duration-300 bg-mesh-gradient">
      <ScrollProgress />
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'landing' && <LandingView />}

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
      <footer className="mt-16 border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#06070B] py-10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Zap className="w-3.5 h-3.5 fill-white" />
            </div>
            <span className="font-display font-bold text-slate-800 dark:text-slate-200">
              PADHLO<span className="text-indigo-600">SHAWTYS</span>
            </span>
            <span>•</span>
            <span className="font-medium text-slate-600 dark:text-slate-400">
              Kyu nhi hori padhai? PadhloShawtys pe lock in karo! 🔥
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-slate-500">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="hover:text-indigo-600 transition-colors"
            >
              Command Center
            </button>
            <button
              onClick={() => setActiveTab('scheduler')}
              className="hover:text-cyan-600 transition-colors"
            >
              Scheduler
            </button>
            <button
              onClick={() => setActiveTab('focus')}
              className="hover:text-pink-600 transition-colors"
            >
              Focus Mode
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className="hover:text-emerald-600 transition-colors"
            >
              Analytics
            </button>
            <button
              onClick={loadDemoMode}
              className="text-indigo-600 font-semibold hover:underline"
            >
              Load Demo Mode
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
