import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  AppData,
  Task,
  Exam,
  ScheduledSession,
  Subject,
  SchedulerPreferences,
  AppSettings,
  UserProfile,
  FocusSessionLog,
  SyllabusTopic,
} from '../types';
import {
  loadAppData,
  saveAppData,
  getDemoAppData,
  getDefaultAppData,
  exportDataAsJSON,
  importDataFromJSON,
} from '../utils/storage';
import { generateSmartSchedule } from '../utils/scheduler';
import { playSound } from '../utils/audio';
import { triggerConfetti } from '../utils/confetti';

export type NavTab =
  | 'landing'
  | 'dashboard'
  | 'scheduler'
  | 'tasks'
  | 'focus'
  | 'exams'
  | 'analytics'
  | 'gamification'
  | 'settings'
  | 'login';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'level';
}

interface AppContextType {
  data: AppData;
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  toasts: ToastMessage[];
  addToast: (message: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;

  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;
  toggleTaskComplete: (taskId: string) => void;
  rescheduleTask: (taskId: string, newDate: string, newTime?: string) => void;

  addSubject: (subject: Omit<Subject, 'id'>) => void;
  updateSubject: (subject: Subject) => void;
  deleteSubject: (subjectId: string) => void;

  addExam: (exam: Omit<Exam, 'id'>) => void;
  updateExam: (exam: Exam) => void;
  deleteExam: (examId: string) => void;
  toggleExamTopicComplete: (examId: string, topicId: string) => void;
  updateExamTopic: (examId: string, topic: SyllabusTopic) => void;

  runScheduler: (days?: number) => string[];
  toggleLockSession: (sessionId: string) => void;
  updateSessionStatus: (sessionId: string, status: ScheduledSession['status']) => void;
  moveSession: (sessionId: string, newDate: string, newStartTime: string) => void;
  deleteSession: (sessionId: string) => void;
  clearSchedule: () => void;
  updatePreferences: (prefs: Partial<SchedulerPreferences>) => void;

  logFocusSession: (log: Omit<FocusSessionLog, 'id'>) => void;

  addXP: (amount: number, reason: string) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  toggleTheme: () => void;
  toggleSound: () => void;

  loadDemoMode: () => void;
  resetAllData: () => void;
  exportJSON: () => void;
  importJSON: (file: File) => Promise<void>;
  login: (name: string, email?: string) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const RANK_TITLES = [
  'Procrastination Rookie',
  'Caffeine Apprentice',
  'Focus Cadet',
  'Consistency Merchant',
  'Note Ninja',
  'Exam Slayer',
  'Flow State Demigod',
  'Academic Weapon',
  'Grandmaster Scholar',
  'Sigma Valedictorian',
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<AppData>(() => loadAppData());
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const isDark = data.settings.theme === 'dark' || data.settings.theme === 'midnight';
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [data.settings.theme]);

  useEffect(() => {
    saveAppData(data);
  }, [data]);

  const addToast = (message: string, type: ToastMessage['type'] = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addXP = (amount: number, reason: string) => {
    setData((prev) => {
      let newXP = prev.profile.currentXP + amount;
      let newLevel = prev.profile.level;
      let targetXP = prev.profile.targetXP;
      let leveledUp = false;

      while (newXP >= targetXP) {
        newXP -= targetXP;
        newLevel += 1;
        targetXP = Math.round(targetXP * 1.35);
        leveledUp = true;
      }

      const rankIndex = Math.min(newLevel - 1, RANK_TITLES.length - 1);
      const rankTitle = `${RANK_TITLES[rankIndex]} (Lvl ${newLevel})`;

      if (leveledUp) {
        playSound('level_up', prev.settings.soundEnabled);
        triggerConfetti('level_up');
        addToast(`LEVEL UP! You are now a ${rankTitle} 🔥`, 'level');
      } else {
        addToast(`+${amount} XP: ${reason}`, 'info');
      }

      return {
        ...prev,
        profile: {
          ...prev.profile,
          level: newLevel,
          currentXP: newXP,
          targetXP,
          rankTitle,
        },
      };
    });
  };

  const addTask = (taskInput: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskInput,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setData((prev) => ({
      ...prev,
      tasks: [newTask, ...prev.tasks],
    }));
    playSound('click', data.settings.soundEnabled);
    addToast('Task secured. Time to execute 🎯', 'success');
  };

  const updateTask = (task: Task) => {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === task.id ? task : t)),
    }));
    addToast('Task updated.', 'info');
  };

  const deleteTask = (taskId: string) => {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== taskId),
      scheduledSessions: prev.scheduledSessions.filter((s) => s.taskId !== taskId),
    }));
    playSound('click', data.settings.soundEnabled);
    addToast('Task deleted.', 'info');
  };

  const toggleTaskComplete = (taskId: string) => {
    setData((prev) => {
      const task = prev.tasks.find((t) => t.id === taskId);
      if (!task) return prev;

      const isNowCompleted = task.status !== 'completed';
      const updatedTasks = prev.tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status: isNowCompleted ? ('completed' as const) : ('todo' as const),
              completedAt: isNowCompleted ? new Date().toISOString() : undefined,
            }
          : t
      );

      const updatedSessions = prev.scheduledSessions.map((s) =>
        s.taskId === taskId && isNowCompleted ? { ...s, status: 'completed' as const } : s
      );

      return {
        ...prev,
        tasks: updatedTasks,
        scheduledSessions: updatedSessions,
      };
    });

    const isCompleting = data.tasks.find((t) => t.id === taskId)?.status !== 'completed';
    if (isCompleting) {
      playSound('complete', data.settings.soundEnabled);
      triggerConfetti('standard');
      addXP(60, 'Task Completed');
      addToast('Cooked! Task knocked out 🔥', 'success');
    }
  };

  const rescheduleTask = (taskId: string, newDate: string, newTime?: string) => {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) =>
        t.id === taskId ? { ...t, dueDate: newDate, dueTime: newTime || t.dueTime } : t
      ),
    }));
    addToast('Task rescheduled.', 'info');
  };

  const addSubject = (subjectInput: Omit<Subject, 'id'>) => {
    const newSubject: Subject = {
      ...subjectInput,
      id: `sub-${Date.now()}`,
    };
    setData((prev) => ({
      ...prev,
      subjects: [...prev.subjects, newSubject],
    }));
    addToast(`Subject "${newSubject.name}" added.`, 'success');
  };

  const updateSubject = (subject: Subject) => {
    setData((prev) => ({
      ...prev,
      subjects: prev.subjects.map((s) => (s.id === subject.id ? subject : s)),
    }));
    addToast('Subject updated.', 'info');
  };

  const deleteSubject = (subjectId: string) => {
    setData((prev) => ({
      ...prev,
      subjects: prev.subjects.filter((s) => s.id !== subjectId),
    }));
    addToast('Subject removed.', 'info');
  };

  const addExam = (examInput: Omit<Exam, 'id'>) => {
    const newExam: Exam = {
      ...examInput,
      id: `exam-${Date.now()}`,
    };
    setData((prev) => ({
      ...prev,
      exams: [...prev.exams, newExam],
    }));
    playSound('click', data.settings.soundEnabled);
    addToast(`Exam "${newExam.name}" locked in!`, 'success');
  };

  const updateExam = (exam: Exam) => {
    setData((prev) => ({
      ...prev,
      exams: prev.exams.map((e) => (e.id === exam.id ? exam : e)),
    }));
    addToast('Exam syllabus updated.', 'info');
  };

  const deleteExam = (examId: string) => {
    setData((prev) => ({
      ...prev,
      exams: prev.exams.filter((e) => e.id !== examId),
      scheduledSessions: prev.scheduledSessions.filter((s) => s.examId !== examId),
    }));
    addToast('Exam removed.', 'info');
  };

  const toggleExamTopicComplete = (examId: string, topicId: string) => {
    let topicName = '';
    let isCompletedNow = false;

    setData((prev) => {
      const exam = prev.exams.find((e) => e.id === examId);
      if (!exam) return prev;

      const updatedTopics = exam.topics.map((t) => {
        if (t.id === topicId) {
          topicName = t.name;
          isCompletedNow = !t.isCompleted;
          return { ...t, isCompleted: isCompletedNow };
        }
        return t;
      });

      return {
        ...prev,
        exams: prev.exams.map((e) => (e.id === examId ? { ...e, topics: updatedTopics } : e)),
      };
    });

    if (isCompletedNow) {
      playSound('complete', data.settings.soundEnabled);
      triggerConfetti('standard');
      addToast(`Topic "${topicName}" mastered! +80 XP 👑`, 'success');
      addXP(80, 'Exam Topic Mastered');
    }
  };

  const updateExamTopic = (examId: string, topic: SyllabusTopic) => {
    setData((prev) => ({
      ...prev,
      exams: prev.exams.map((e) =>
        e.id === examId
          ? {
              ...e,
              topics: e.topics.map((t) => (t.id === topic.id ? topic : t)),
            }
          : e
      ),
    }));
  };

  const runScheduler = (days: number = 7): string[] => {
    const result = generateSmartSchedule(
      data.tasks,
      data.exams,
      data.scheduledSessions,
      data.schedulerPreferences,
      data.subjects,
      days
    );

    setData((prev) => ({
      ...prev,
      scheduledSessions: result.sessions,
    }));

    playSound('badge', data.settings.soundEnabled);
    triggerConfetti('standard');
    addToast(`Algorithmic study plan loaded: ${result.sessions.length} sessions distributed! 🚀`, 'success');

    return result.warnings;
  };

  const toggleLockSession = (sessionId: string) => {
    setData((prev) => ({
      ...prev,
      scheduledSessions: prev.scheduledSessions.map((s) =>
        s.id === sessionId ? { ...s, isLocked: !s.isLocked } : s
      ),
    }));
    playSound('click', data.settings.soundEnabled);
  };

  const updateSessionStatus = (sessionId: string, status: ScheduledSession['status']) => {
    setData((prev) => ({
      ...prev,
      scheduledSessions: prev.scheduledSessions.map((s) =>
        s.id === sessionId ? { ...s, status } : s
      ),
    }));

    if (status === 'completed') {
      playSound('complete', data.settings.soundEnabled);
      addXP(50, 'Session Completed');
    }
  };

  const moveSession = (sessionId: string, newDate: string, newStartTime: string) => {
    setData((prev) => ({
      ...prev,
      scheduledSessions: prev.scheduledSessions.map((s) => {
        if (s.id === sessionId) {
          const [h, m] = newStartTime.split(':').map(Number);
          const endMins = h * 60 + m + s.durationMinutes;
          const endH = Math.floor(endMins / 60) % 24;
          const endM = endMins % 60;
          const newEndTime = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
          return {
            ...s,
            date: newDate,
            startTime: newStartTime,
            endTime: newEndTime,
            isLocked: true,
          };
        }
        return s;
      }),
    }));
    addToast('Session adjusted and locked in position.', 'info');
  };

  const deleteSession = (sessionId: string) => {
    setData((prev) => ({
      ...prev,
      scheduledSessions: prev.scheduledSessions.filter((s) => s.id !== sessionId),
    }));
    addToast('Session deleted.', 'info');
  };

  const clearSchedule = () => {
    setData((prev) => ({
      ...prev,
      scheduledSessions: prev.scheduledSessions.filter((s) => s.isLocked),
    }));
    addToast('Unlocked sessions cleared.', 'info');
  };

  const updatePreferences = (prefs: Partial<SchedulerPreferences>) => {
    setData((prev) => ({
      ...prev,
      schedulerPreferences: {
        ...prev.schedulerPreferences,
        ...prefs,
      },
    }));
    addToast('Scheduler preferences saved.', 'success');
  };

  const logFocusSession = (logInput: Omit<FocusSessionLog, 'id'>) => {
    const newLog: FocusSessionLog = {
      ...logInput,
      id: `log-${Date.now()}`,
    };

    const todayStr = new Date().toISOString().split('T')[0];

    setData((prev) => {
      let streak = prev.profile.streakDays;
      let longest = prev.profile.longestStreak;
      if (prev.profile.lastActiveDate !== todayStr) {
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        if (prev.profile.lastActiveDate === yesterday) {
          streak += 1;
        } else {
          streak = 1;
        }
        longest = Math.max(longest, streak);
      }

      const updatedQuests = prev.quests.map((q) => {
        if (!q.isCompleted && q.type === 'focus_time') {
          const newCnt = q.currentCount + newLog.durationMinutes;
          const isDone = newCnt >= q.targetCount;
          return { ...q, currentCount: newCnt, isCompleted: isDone };
        }
        return q;
      });

      return {
        ...prev,
        focusLogs: [newLog, ...prev.focusLogs],
        profile: {
          ...prev.profile,
          streakDays: streak,
          longestStreak: longest,
          lastActiveDate: todayStr,
        },
        quests: updatedQuests,
      };
    });

    addXP(newLog.xpEarned, `${newLog.durationMinutes}m Focus Session`);
  };

  const updateProfile = (profile: Partial<UserProfile>) => {
    setData((prev) => ({
      ...prev,
      profile: { ...prev.profile, ...profile },
    }));
    addToast('Profile updated.', 'success');
  };

  const updateSettings = (settings: Partial<AppSettings>) => {
    setData((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...settings },
    }));
  };

  const toggleTheme = () => {
    setData((prev) => {
      const nextTheme = prev.settings.theme === 'dark' ? 'light' : 'dark';
      return {
        ...prev,
        settings: {
          ...prev.settings,
          theme: nextTheme,
        },
      };
    });
  };

  const toggleSound = () => {
    setData((prev) => {
      const next = !prev.settings.soundEnabled;
      playSound('click', next);
      return {
        ...prev,
        settings: {
          ...prev.settings,
          soundEnabled: next,
        },
      };
    });
  };

  const loadDemoMode = () => {
    const demo = getDemoAppData();
    setData(demo);
    playSound('badge', demo.settings.soundEnabled);
    triggerConfetti('streak');
    addToast('Demo Academic Comeback dataset loaded! Explore the charts & schedule 🔥', 'level');
  };

  const resetAllData = () => {
    const fresh = getDefaultAppData();
    setData(fresh);
    playSound('click', true);
    addToast('Workspace reset to clean default state.', 'info');
  };

  const exportJSON = () => {
    exportDataAsJSON(data);
    addToast('Export downloaded successfully!', 'success');
  };

  const importJSON = async (file: File) => {
    try {
      const imported = await importDataFromJSON(file);
      setData(imported);
      playSound('complete', imported.settings.soundEnabled);
      addToast('Backup imported successfully!', 'success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      addToast(`Import failed: ${msg}`, 'warning');
    }
  };

  const login = (name: string, email?: string) => {
    const cleanName = name.trim() || 'Scholar';
    setData((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        name: cleanName,
        email: email?.trim() || `${cleanName.toLowerCase().replace(/\s+/g, '')}@shawtys.edu`,
        isLoggedIn: true,
      },
    }));
    playSound('start', data.settings.soundEnabled);
    triggerConfetti('level_up');
    addToast(`Welcome back, ${cleanName}! Locked in and ready 🔥`, 'success');
    setActiveTab('dashboard');
  };

  const logout = () => {
    setData((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        isLoggedIn: false,
      },
    }));
    playSound('click', data.settings.soundEnabled);
    addToast('Signed out. Stop LARPing and come back to study!', 'info');
    setActiveTab('login');
  };

  return (
    <AppContext.Provider
      value={{
        data,
        activeTab,
        setActiveTab,
        toasts,
        addToast,
        removeToast,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskComplete,
        rescheduleTask,
        addSubject,
        updateSubject,
        deleteSubject,
        addExam,
        updateExam,
        deleteExam,
        toggleExamTopicComplete,
        updateExamTopic,
        runScheduler,
        toggleLockSession,
        updateSessionStatus,
        moveSession,
        deleteSession,
        clearSchedule,
        updatePreferences,
        logFocusSession,
        addXP,
        updateProfile,
        updateSettings,
        toggleTheme,
        toggleSound,
        loadDemoMode,
        resetAllData,
        exportJSON,
        importJSON,
        login,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

