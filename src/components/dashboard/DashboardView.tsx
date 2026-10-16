import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { calculateAnalytics } from '../../utils/analytics';
import { playSound } from '../../utils/audio';
import { triggerConfetti } from '../../utils/confetti';
import {
  Timer,
  CheckCircle2,
  Clock,
  Flame,
  Calendar,
  Sparkles,
  ArrowRight,
  Plus,
  Play,
  Lock,
  Unlock,
  Check,
  TrendingUp,
  Edit2,
  AlertTriangle,
  RotateCcw,
  MessageSquare,
} from 'lucide-react';

const MOTIVATIONAL_QUOTES = [
  "Bhai reels band kar, PadhloShawtys pe focus timer laga aur lock in kar! 😭🔥",
  "Kyu nhi hori padhai? Ek 25-minute Pomodoro session start karo abhi ke abhi! ⚡",
  "Academic comeback arc loading… [██████████] 99%",
  "Sleep is essential, but high GPA is eternal. Get this study block done.",
  "One task at a time. Clear the syllabus, clear your mind.",
  "Future you will thank present you for locking in today.",
  "Discipline beats motivation every single day. Let's work.",
];

export const DashboardView: React.FC<{ onOpenAddTask: () => void }> = ({ onOpenAddTask }) => {
  const {
    data,
    setActiveTab,
    toggleTaskComplete,
    toggleLockSession,
    updateSessionStatus,
    runScheduler,
    updateProfile,
  } = useApp();

  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(data.profile.name);
  const [quoteIndex, setQuoteIndex] = useState(0);

  const analytics = calculateAnalytics(data);
  const todayStr = new Date().toISOString().split('T')[0];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 5) return 'Late Night Grind 🌙';
    if (hour < 12) return 'Good Morning, Scholar ☀️';
    if (hour < 17) return 'Afternoon Flow State ⚡';
    if (hour < 21) return 'Evening Comeback Arc 🚀';
    return 'Night Owl Mode 🦉';
  };

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }).format(new Date());

  const handleSaveName = () => {
    if (nameInput.trim()) {
      updateProfile({ name: nameInput.trim() });
    }
    setIsEditingName(false);
  };

  const todaySessions = data.scheduledSessions.filter((s) => s.date === todayStr);
  const todayTasks = data.tasks.filter((t) => t.dueDate === todayStr || t.status === 'in_progress');
  const completedTodayTasks = data.tasks.filter((t) => {
    return t.completedAt && t.completedAt.startsWith(todayStr);
  });

  const goalPercent = Math.min(
    100,
    Math.round((analytics.todayActualMinutes / (data.profile.dailyGoalMinutes || 120)) * 100)
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Welcome Header Banner with Mascot Integration */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/90 shadow-[0_4px_25px_-2px_rgba(0,0,0,0.06)] p-6 sm:p-8">
        {/* Soft background glow */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-600 uppercase tracking-widest">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formattedDate}</span>
              <span>•</span>
              <span className="text-pink-600 font-semibold">{getGreeting()}</span>
            </div>

            <div className="flex items-center gap-3">
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                    className="bg-slate-50 border border-indigo-400 rounded-xl px-3 py-1 text-2xl font-display font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveName}
                    className="p-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2.5">
                  <h1 className="text-2xl sm:text-4xl font-display font-extrabold tracking-tight text-slate-900">
                    Welcome back, {data.profile.name}
                  </h1>
                  <button
                    onClick={() => {
                      setNameInput(data.profile.name);
                      setIsEditingName(true);
                    }}
                    className="text-slate-400 hover:text-indigo-600 p-1 transition-colors"
                    title="Edit your name"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              )}

              <span className="text-xl sm:text-2xl" role="img" aria-label="avatar">
                {data.profile.avatar}
              </span>
            </div>

            {/* Motivational Speech Pill */}
            <div className="flex items-start sm:items-center gap-2.5 p-3 rounded-2xl bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border border-indigo-100/80">
              <MessageSquare className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5 sm:mt-0" />
              <p className="text-xs sm:text-sm text-slate-800 font-medium">
                "{MOTIVATIONAL_QUOTES[quoteIndex]}"
              </p>
              <button
                onClick={() => setQuoteIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length)}
                className="text-slate-400 hover:text-indigo-600 p-1 transition-colors shrink-0 ml-auto"
                title="Next motivation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Mascot Mini Widget */}
          <div className="flex items-center gap-4 self-start lg:self-center">
            <div
              onClick={() => {
                setQuoteIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length);
                playSound('badge', data.settings.soundEnabled);
                triggerConfetti();
              }}
              title="Click mentor for motivation + confetti!"
              className="relative group shrink-0 hidden sm:block cursor-pointer"
            >
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-tr from-indigo-100 to-pink-100 border-2 border-indigo-200 group-hover:border-indigo-400 shadow-md group-hover:scale-105 active:scale-95 transition-all">
                <img
                  src="/padhlo-mascot.png"
                  alt="PadhloShawtys Mentor"
                  className="w-full h-full object-cover object-top scale-110 group-hover:scale-125 transition-transform duration-300"
                />
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-pink-500 text-[8px] text-white font-bold items-center justify-center">✨</span>
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <button
                onClick={() => setActiveTab('focus')}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-sm shadow-[0_8px_20px_rgba(99,102,241,0.35)] transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Start Focus Session</span>
              </button>

              <button
                onClick={() => runScheduler(7)}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-semibold text-sm transition-all hover:scale-105"
              >
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Smart Schedule</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Today's Overview: Real Calculated Statistics */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-display font-bold text-slate-900 flex items-center gap-2">
            <span>Today's Command Metrics</span>
            <span className="text-xs font-mono font-normal text-slate-500">
              (Live calculated from logs)
            </span>
          </h2>
          <button
            onClick={() => setActiveTab('analytics')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group"
          >
            <span>View Full Analytics</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Stat 1: Tasks Completed vs Remaining */}
          <div className="design-card p-5 rounded-3xl group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Tasks Today
              </span>
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900">
                {completedTodayTasks.length}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                done / {todayTasks.length} remaining
              </span>
            </div>
            <div className="mt-3 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                style={{
                  width: `${
                    todayTasks.length + completedTodayTasks.length > 0
                      ? Math.round(
                          (completedTodayTasks.length /
                            (todayTasks.length + completedTodayTasks.length)) *
                            100
                        )
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>

          {/* Stat 2: Actual Focus Time vs Planned */}
          <div className="design-card p-5 rounded-3xl group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Focus Logged
              </span>
              <div className="p-2 rounded-xl bg-pink-50 text-pink-600 group-hover:scale-110 transition-transform">
                <Timer className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900">
                {analytics.todayActualMinutes}
                <span className="text-base font-normal text-slate-500 ml-0.5">m</span>
              </span>
              <span className="text-xs text-slate-500 font-medium">
                / {analytics.todayPlannedMinutes}m planned
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
              <span>Goal: {data.profile.dailyGoalMinutes}m</span>
              <span className="text-pink-600 font-mono font-bold">{goalPercent}%</span>
            </div>
          </div>

          {/* Stat 3: Study Streak */}
          <div className="design-card p-5 rounded-3xl group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Active Streak
              </span>
              <div className="p-2 rounded-xl bg-amber-50 text-amber-500 group-hover:scale-110 transition-transform">
                <Flame className="w-4 h-4 fill-amber-500" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900">
                {data.profile.streakDays}
                <span className="text-base font-normal text-slate-500 ml-0.5">days</span>
              </span>
              <span className="text-xs text-amber-600 font-bold flex items-center gap-0.5">
                🔥 On fire
              </span>
            </div>
            <div className="mt-3 text-[11px] text-slate-500 flex justify-between">
              <span>Best: {data.profile.longestStreak} days</span>
              <span className="text-amber-600 font-semibold">+75 XP/day</span>
            </div>
          </div>

          {/* Stat 4: Weekly Task Completion Rate */}
          <div className="design-card p-5 rounded-3xl group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Weekly Comeback
              </span>
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900">
                {analytics.taskCompletionRate}%
              </span>
              <span className="text-xs text-slate-500 font-medium">
                ({analytics.completedTasksCount}/{analytics.totalTasksCount} tasks)
              </span>
            </div>
            <div className="mt-3 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${analytics.taskCompletionRate}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Today's Schedule Timeline & Quick Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Schedule Timeline */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-display font-bold text-slate-900 flex items-center gap-2">
                <span>Today's Study Timeline</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-mono font-bold border border-indigo-200">
                  {todaySessions.length} Blocks
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Prioritized by urgency, difficulty & confidence ratings
              </p>
            </div>
            <button
              onClick={() => setActiveTab('scheduler')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              <span>Manage Planner</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {todaySessions.length === 0 ? (
            <div className="p-8 rounded-3xl bg-white border border-dashed border-slate-300 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Calendar className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-semibold text-slate-900">No sessions scheduled for today yet</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Bhai algorithm chalao! Run the smart scheduler to distribute your upcoming exam
                topics and tasks into balanced study blocks.
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={() => runScheduler(7)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-all"
                >
                  Generate Smart Schedule
                </button>
                <button
                  onClick={onOpenAddTask}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-all"
                >
                  + Add First Task
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {todaySessions.map((session) => {
                const subject = data.subjects.find((s) => s.id === session.subjectId);
                const isCompleted = session.status === 'completed';
                const isInProgress = session.status === 'in_progress';

                return (
                  <div
                    key={session.id}
                    className={`relative p-4 rounded-2xl border transition-all duration-200 ${
                      isInProgress
                        ? 'bg-indigo-50/80 border-indigo-300 shadow-sm'
                        : isCompleted
                        ? 'bg-slate-50/70 border-slate-200 opacity-75'
                        : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-3">
                        {/* Status Checkbox */}
                        <button
                          onClick={() =>
                            updateSessionStatus(
                              session.id,
                              isCompleted ? 'upcoming' : 'completed'
                            )
                          }
                          className={`mt-1 p-1 rounded-lg border transition-colors ${
                            isCompleted
                              ? 'bg-emerald-500 border-emerald-400 text-white'
                              : 'border-slate-300 hover:border-indigo-500 text-transparent'
                          }`}
                          title={isCompleted ? 'Mark uncompleted' : 'Mark completed (+50 XP)'}
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>

                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            {subject && (
                              <span
                                className="text-[10px] font-bold px-2 py-0.5 rounded-md"
                                style={{
                                  backgroundColor: `${subject.color}15`,
                                  color: subject.color,
                                  border: `1px solid ${subject.color}30`,
                                }}
                              >
                                {subject.code}
                              </span>
                            )}
                            <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {session.startTime} - {session.endTime} ({session.durationMinutes}m)
                            </span>
                            {session.isLocked && (
                              <span
                                className="text-[10px] text-amber-500 flex items-center gap-0.5"
                                title="Locked session (won't move on regenerate)"
                              >
                                <Lock className="w-3 h-3" />
                              </span>
                            )}
                          </div>

                          <h4
                            className={`text-sm font-semibold transition-all ${
                              isCompleted
                                ? 'line-through text-slate-400'
                                : isInProgress
                                ? 'text-indigo-900 font-bold'
                                : 'text-slate-900'
                            }`}
                          >
                            {session.topicName}
                          </h4>

                          {/* Priority reason badge */}
                          {session.priorityReasons && session.priorityReasons.length > 0 && (
                            <p className="text-[11px] text-slate-500 mt-1">
                              💡 {session.priorityReasons[0]}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right controls */}
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        {isInProgress && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-bold">
                            IN PROGRESS
                          </span>
                        )}

                        <button
                          onClick={() => setActiveTab('focus')}
                          className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>Lock In</span>
                        </button>

                        <button
                          onClick={() => toggleLockSession(session.id)}
                          className={`p-1.5 rounded-lg border text-xs transition-colors ${
                            session.isLocked
                              ? 'bg-amber-50 text-amber-600 border-amber-200'
                              : 'bg-slate-50 text-slate-400 border-slate-200 hover:text-slate-700'
                          }`}
                          title={session.isLocked ? 'Unlock session' : 'Lock session to fix schedule'}
                        >
                          {session.isLocked ? (
                            <Lock className="w-3.5 h-3.5" />
                          ) : (
                            <Unlock className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Col: Quick Actions & Immediate Agenda */}
        <div className="space-y-6">
          {/* Quick Actions Panel */}
          <div className="design-card p-5 rounded-3xl space-y-3">
            <h3 className="text-sm font-display font-bold text-slate-900 uppercase tracking-wider">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={onOpenAddTask}
                className="flex items-center gap-2 p-3 rounded-2xl bg-indigo-50 hover:bg-indigo-100/80 border border-indigo-100 text-xs font-bold text-indigo-700 transition-all text-left"
              >
                <Plus className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Add Task</span>
              </button>

              <button
                onClick={() => runScheduler(7)}
                className="flex items-center gap-2 p-3 rounded-2xl bg-purple-50 hover:bg-purple-100/80 border border-purple-100 text-xs font-bold text-purple-700 transition-all text-left"
              >
                <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Smart Plan</span>
              </button>

              <button
                onClick={() => setActiveTab('focus')}
                className="flex items-center gap-2 p-3 rounded-2xl bg-pink-50 hover:bg-pink-100/80 border border-pink-100 text-xs font-bold text-pink-700 transition-all text-left"
              >
                <Timer className="w-4 h-4 text-pink-600 shrink-0" />
                <span>Focus Timer</span>
              </button>

              <button
                onClick={() => setActiveTab('analytics')}
                className="flex items-center gap-2 p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-100 text-xs font-bold text-emerald-700 transition-all text-left"
              >
                <TrendingUp className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Weekly Recap</span>
              </button>
            </div>
          </div>

          {/* Urgent / Overdue Tasks Box */}
          <div className="design-card p-5 rounded-3xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-display font-bold text-slate-900 flex items-center gap-2">
                <span>Immediate Agenda</span>
                {analytics.overdueTasksCount > 0 && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200 font-mono font-bold flex items-center gap-0.5">
                    <AlertTriangle className="w-3 h-3" />
                    {analytics.overdueTasksCount} overdue
                  </span>
                )}
              </h3>
              <button
                onClick={() => setActiveTab('tasks')}
                className="text-xs text-indigo-600 font-semibold hover:underline"
              >
                View all
              </button>
            </div>

            {data.tasks.filter((t) => t.status !== 'completed').length === 0 ? (
              <div className="text-center py-6 text-slate-500 text-xs">
                <p>No active tasks! You are completely caught up. 🎉</p>
                <button
                  onClick={onOpenAddTask}
                  className="mt-2 text-indigo-600 font-semibold hover:underline"
                >
                  + Add next objective
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {data.tasks
                  .filter((t) => t.status !== 'completed')
                  .slice(0, 4)
                  .map((task) => {
                    const sub = data.subjects.find((s) => s.id === task.subjectId);
                    const isUrgent = task.priority === 'urgent' || task.priority === 'high';

                    return (
                      <div
                        key={task.id}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-200 transition-colors text-xs"
                      >
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <button
                            onClick={() => toggleTaskComplete(task.id)}
                            className="p-1 rounded border border-slate-300 hover:border-indigo-500 text-transparent hover:text-indigo-600 transition-colors shrink-0"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                          <div className="truncate">
                            <p className="font-semibold text-slate-800 truncate">{task.title}</p>
                            <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                              {sub && (
                                <span style={{ color: sub.color }} className="font-semibold">
                                  {sub.code}
                                </span>
                              )}
                              <span>•</span>
                              <span>{task.estimatedDuration}m</span>
                              {task.dueDate && (
                                <>
                                  <span>•</span>
                                  <span
                                    className={
                                      task.dueDate < todayStr ? 'text-rose-600 font-bold' : ''
                                    }
                                  >
                                    {task.dueDate === todayStr ? 'Today' : task.dueDate}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {isUrgent && (
                          <span className="shrink-0 text-[10px] px-2 py-0.5 rounded-full font-mono font-bold uppercase bg-amber-50 text-amber-700 border border-amber-200">
                            {task.priority}
                          </span>
                        )}
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
