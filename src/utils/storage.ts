import type { AppData, Subject, ScheduledSession, FocusSessionLog, Quest, Achievement } from '../types';

const STORAGE_KEY = 'padhloshawtys_study_os_v2';

export const DEFAULT_SUBJECTS: Subject[] = [
  { id: 'sub-1', name: 'Mathematics & Calculus', code: 'MATH-201', color: '#6366F1', icon: '📐' },
  { id: 'sub-2', name: 'Computer Systems & Code', code: 'CS-301', color: '#06B6D4', icon: '💻' },
  { id: 'sub-3', name: 'Organic Chemistry', code: 'CHEM-210', color: '#EC4899', icon: '🧪' },
  { id: 'sub-4', name: 'Macroeconomics', code: 'ECON-102', color: '#10B981', icon: '📈' },
  { id: 'sub-5', name: 'Physics & Mechanics', code: 'PHYS-150', color: '#F59E0B', icon: '⚡' },
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_lockin', title: 'First Lock-In', badge: '⚡', description: 'Complete your first 25-minute focus session on PadhloShawtys.', category: 'focus', progress: 0, xp: 100 },
  { id: 'consistency_merchant', title: 'Consistency Merchant', badge: '🔥', description: 'Maintain a 3-day study streak.', category: 'streak', progress: 33, xp: 200 },
  { id: 'no_procrastination', title: 'No More Procrastination', badge: '🎯', description: 'Complete 5 planned tasks.', category: 'tasks', progress: 0, xp: 250 },
  { id: 'academic_weapon', title: 'Academic Weapon', badge: '🗡️', description: 'Log over 300 minutes of focus time in a single week.', category: 'academic', progress: 0, xp: 400 },
  { id: 'night_owl', title: 'Night Owl Arc', badge: '🦉', description: 'Complete a focus session after 9:00 PM.', category: 'special', progress: 0, xp: 150 },
  { id: 'early_bird', title: 'Dawn Patrol', badge: '🌅', description: 'Complete a study session before 9:00 AM.', category: 'special', progress: 0, xp: 150 },
  { id: 'mastery_unlocked', title: 'Syllabus Slayer', badge: '👑', description: 'Achieve 100% confidence on all topics for an exam.', category: 'academic', progress: 0, xp: 500 },
];

export const INITIAL_QUESTS: Quest[] = [
  {
    id: 'quest-1',
    title: 'Daily Lock-In Protocol',
    description: 'Complete 50 minutes of deep focus timer today.',
    xpReward: 120,
    targetCount: 50,
    currentCount: 0,
    isCompleted: false,
    type: 'focus_time',
    expiresAt: new Date(Date.now() + 86400000).toISOString(),
  },
  {
    id: 'quest-2',
    title: 'Task Execution Blitz',
    description: 'Knock out 3 study tasks from your agenda.',
    xpReward: 150,
    targetCount: 3,
    currentCount: 0,
    isCompleted: false,
    type: 'tasks_completed',
    expiresAt: new Date(Date.now() + 86400000).toISOString(),
  },
  {
    id: 'quest-3',
    title: 'Priority Target Neutralized',
    description: 'Complete at least 1 Urgent or High priority task.',
    xpReward: 100,
    targetCount: 1,
    currentCount: 0,
    isCompleted: false,
    type: 'urgent_task',
    expiresAt: new Date(Date.now() + 86400000).toISOString(),
  },
];

export const getDefaultAppData = (): AppData => {
  const todayStr = new Date().toISOString().split('T')[0];

  return {
    version: 2,
    profile: {
      name: 'Rehan',
      avatar: '⚡',
      level: 1,
      currentXP: 80,
      targetXP: 300,
      streakDays: 1,
      longestStreak: 1,
      lastActiveDate: todayStr,
      dailyGoalMinutes: 120,
      rankTitle: 'PadhloShawtys Scholar Arc',
    },
    subjects: DEFAULT_SUBJECTS,
    tasks: [
      {
        id: 'task-init-1',
        title: 'Review Fourier Series & Taylor Approximations',
        subjectId: 'sub-1',
        topic: 'Series & Sequences',
        dueDate: todayStr,
        dueTime: '20:00',
        estimatedDuration: 45,
        priority: 'high',
        difficulty: 4,
        status: 'todo',
        notes: 'Solve problem set 4 questions 3 through 9.',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'task-init-2',
        title: 'Debug Memory Allocator in C',
        subjectId: 'sub-2',
        topic: 'Virtual Memory & Pointers',
        dueDate: todayStr,
        dueTime: '22:00',
        estimatedDuration: 60,
        priority: 'urgent',
        difficulty: 5,
        status: 'todo',
        notes: 'Check valgrind memory leak errors on test bench 3.',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'task-init-3',
        title: 'Read Reaction Mechanisms for Alkyl Halides',
        subjectId: 'sub-3',
        topic: 'SN1 vs SN2 Reactions',
        dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        dueTime: '18:00',
        estimatedDuration: 40,
        priority: 'medium',
        difficulty: 3,
        status: 'todo',
        notes: 'Draw electron pushing arrows for nucleophilic substitutions.',
        createdAt: new Date().toISOString(),
      }
    ],
    exams: [
      {
        id: 'exam-1',
        name: 'Calculus Midterm Examination',
        subjectId: 'sub-1',
        examDate: new Date(Date.now() + 6 * 86400000).toISOString().split('T')[0],
        examTime: '09:00',
        targetGrade: 'A',
        weightPercent: 35,
        topics: [
          { id: 'top-1', name: 'Taylor Series Expansions', difficulty: 4, confidence: 2, estimatedHours: 3, isCompleted: false },
          { id: 'top-2', name: 'Multivariable Double Integrals', difficulty: 5, confidence: 3, estimatedHours: 4, isCompleted: false },
          { id: 'top-3', name: 'Polar Coordinate Transformations', difficulty: 3, confidence: 4, estimatedHours: 2, isCompleted: true },
          { id: 'top-4', name: 'Green’s Theorem & Vector Fields', difficulty: 5, confidence: 2, estimatedHours: 4, isCompleted: false },
        ],
        notes: 'Cheat sheet allowed (1 double-sided page). Bring graphing calculator.'
      },
      {
        id: 'exam-2',
        name: 'Systems Architecture Finals',
        subjectId: 'sub-2',
        examDate: new Date(Date.now() + 12 * 86400000).toISOString().split('T')[0],
        examTime: '14:00',
        targetGrade: 'A+',
        weightPercent: 40,
        topics: [
          { id: 'top-21', name: 'Cache Hierarchy & Miss Rates', difficulty: 4, confidence: 4, estimatedHours: 3, isCompleted: true },
          { id: 'top-22', name: 'Pipelining & Branch Prediction', difficulty: 4, confidence: 3, estimatedHours: 3, isCompleted: false },
          { id: 'top-23', name: 'Virtual Memory & Page Tables', difficulty: 5, confidence: 2, estimatedHours: 5, isCompleted: false },
        ]
      }
    ],
    scheduledSessions: [],
    focusLogs: [],
    schedulerPreferences: {
      dailyStudyTargetMinutes: 180,
      preferredTimeOfDay: 'evening',
      startHour: 9,
      endHour: 23,
      defaultSessionDuration: 45,
      breakDuration: 10,
      daysOff: [],
      unavailableSlots: [
        { id: 'un-1', title: 'Lectures / Classes', daysOfWeek: [1, 2, 3, 4, 5], startTime: '10:00', endTime: '13:00' },
        { id: 'un-2', title: 'Gym & Workout', daysOfWeek: [1, 3, 5], startTime: '17:30', endTime: '19:00' },
      ],
    },
    settings: {
      theme: 'light',
      soundEnabled: true,
      reducedMotion: false,
      pomodoroFocusMinutes: 25,
      pomodoroShortBreakMinutes: 5,
      pomodoroLongBreakMinutes: 15,
      pomodoroLongBreakInterval: 4,
      notificationReminder: true,
    },
    achievements: INITIAL_ACHIEVEMENTS,
    quests: INITIAL_QUESTS,
  };
};

export const getDemoAppData = (): AppData => {
  const base = getDefaultAppData();
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  // Generate historical study logs over the past 7 days
  const logs: FocusSessionLog[] = [];
  const dayMinutes = [110, 140, 165, 120, 195, 170, 95];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86400000);
    const dateStr = d.toISOString().split('T')[0];
    const totalMins = dayMinutes[6 - i];
    const subIds = ['sub-1', 'sub-2', 'sub-3', 'sub-4'];

    let logged = 0;
    let sessionCount = 0;
    while (logged < totalMins) {
      const dur = Math.min(totalMins - logged, 35);
      const subId = subIds[(i + sessionCount) % subIds.length];
      const startH = 14 + Math.floor(sessionCount * 1.2);
      const startTime = `${dateStr}T${String(startH).padStart(2, '0')}:15:00.000Z`;
      const endTime = `${dateStr}T${String(startH).padStart(2, '0')}:${String(15 + dur).padStart(2, '0')}:00.000Z`;

      logs.push({
        id: `demo-log-${i}-${sessionCount}`,
        startTime,
        endTime,
        durationMinutes: dur,
        subjectId: subId,
        mode: 'focus',
        completedGoal: true,
        xpEarned: Math.round(dur * 3.5),
      });

      logged += dur;
      sessionCount++;
    }
  }

  const scheduled: ScheduledSession[] = [
    {
      id: 'demo-sched-1',
      subjectId: 'sub-1',
      topicName: 'Taylor Series & Fourier Review',
      date: todayStr,
      startTime: '14:00',
      endTime: '14:45',
      durationMinutes: 45,
      priorityScore: 92,
      priorityReasons: ['Exam in 6 days (+45 pts)', 'Confidence is low (+25 pts)', 'Difficulty 4/5 (+22 pts)'],
      status: 'completed',
      isLocked: false,
    },
    {
      id: 'demo-sched-2',
      subjectId: 'sub-2',
      topicName: 'Virtual Memory & Page Tables',
      date: todayStr,
      startTime: '15:00',
      endTime: '15:50',
      durationMinutes: 50,
      priorityScore: 88,
      priorityReasons: ['Difficulty 5/5 (+30 pts)', 'Low confidence (+28 pts)', 'Final Exam Weight 40% (+30 pts)'],
      status: 'in_progress',
      isLocked: true,
    },
    {
      id: 'demo-sched-3',
      subjectId: 'sub-3',
      topicName: 'Reaction Mechanisms (SN1 / SN2)',
      date: todayStr,
      startTime: '19:30',
      endTime: '20:15',
      durationMinutes: 45,
      priorityScore: 74,
      priorityReasons: ['Upcoming task deadline (+35 pts)', 'Moderate difficulty (+20 pts)'],
      status: 'upcoming',
      isLocked: false,
    },
    {
      id: 'demo-sched-4',
      subjectId: 'sub-4',
      topicName: 'Fiscal Policy & Inflation Models',
      date: todayStr,
      startTime: '20:30',
      endTime: '21:15',
      durationMinutes: 45,
      priorityScore: 68,
      priorityReasons: ['Regular syllabus pacing (+38 pts)', 'Confidence 3/5 (+15 pts)'],
      status: 'upcoming',
      isLocked: false,
    }
  ];

  return {
    ...base,
    profile: {
      name: 'Rehan (LockIn Beast)',
      avatar: '🔥',
      level: 4,
      currentXP: 920,
      targetXP: 1400,
      streakDays: 5,
      longestStreak: 7,
      lastActiveDate: todayStr,
      dailyGoalMinutes: 150,
      rankTitle: 'Focus Cadet (Level 4)',
    },
    scheduledSessions: scheduled,
    focusLogs: logs,
    tasks: [
      {
        id: 'task-d-1',
        title: 'Review Fourier Series & Taylor Approximations',
        subjectId: 'sub-1',
        topic: 'Series & Sequences',
        dueDate: todayStr,
        dueTime: '20:00',
        estimatedDuration: 45,
        priority: 'high',
        difficulty: 4,
        status: 'completed',
        completedAt: new Date(Date.now() - 3600000).toISOString(),
        notes: 'Finished all 6 problem sets!',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: 'task-d-2',
        title: 'Implement Virtual Memory Page Replacement Algorithm',
        subjectId: 'sub-2',
        topic: 'LRU & Clock Replacement',
        dueDate: todayStr,
        dueTime: '22:30',
        estimatedDuration: 60,
        priority: 'urgent',
        difficulty: 5,
        status: 'in_progress',
        notes: 'Write unit tests in C with gtest.',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'task-d-3',
        title: 'Draw Reaction Energy Coordinate Diagrams',
        subjectId: 'sub-3',
        topic: 'Transition States',
        dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        dueTime: '17:00',
        estimatedDuration: 35,
        priority: 'medium',
        difficulty: 3,
        status: 'todo',
        notes: 'Chapter 7 summary sheet.',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'task-d-4',
        title: 'Summarize Monetary Policy Impact on Bond Yields',
        subjectId: 'sub-4',
        topic: 'Central Banks & Interest Rates',
        dueDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
        dueTime: '19:00',
        estimatedDuration: 40,
        priority: 'low',
        difficulty: 2,
        status: 'todo',
        notes: 'Prepare notes for seminar presentation.',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'task-d-5',
        title: 'Physics Lab 4 Error Propagation Calculation',
        subjectId: 'sub-5',
        topic: 'Rotational Inertia',
        dueDate: todayStr,
        dueTime: '12:00',
        estimatedDuration: 50,
        priority: 'high',
        difficulty: 4,
        status: 'completed',
        completedAt: new Date(Date.now() - 7200000).toISOString(),
        notes: 'Submitted on Canvas before deadline.',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
      }
    ],
    achievements: INITIAL_ACHIEVEMENTS.map(a => {
      if (a.id === 'first_lockin') return { ...a, progress: 100, unlockedAt: new Date(Date.now() - 432000000).toISOString() };
      if (a.id === 'consistency_merchant') return { ...a, progress: 100, unlockedAt: new Date(Date.now() - 172800000).toISOString() };
      if (a.id === 'no_procrastination') return { ...a, progress: 60 };
      if (a.id === 'academic_weapon') return { ...a, progress: 75 };
      return a;
    }),
    quests: INITIAL_QUESTS.map(q => {
      if (q.id === 'quest-1') return { ...q, currentCount: 45 };
      if (q.id === 'quest-2') return { ...q, currentCount: 2 };
      if (q.id === 'quest-3') return { ...q, currentCount: 1, isCompleted: true };
      return q;
    })
  };
};

export const loadAppData = (): AppData => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getDefaultAppData();
      saveAppData(initial);
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || !parsed.version) {
      const initial = getDefaultAppData();
      saveAppData(initial);
      return initial;
    }
    return parsed as AppData;
  } catch (err) {
    console.error('Error loading data from localStorage:', err);
    return getDefaultAppData();
  }
};

export const saveAppData = (data: AppData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Error saving data to localStorage:', err);
  }
};

export const exportDataAsJSON = (data: AppData): void => {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `lockin-study-os-backup-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  URL.revokeObjectURL(url);
};

export const importDataFromJSON = (file: File): Promise<AppData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = JSON.parse(text);
        if (!parsed || !parsed.profile || !Array.isArray(parsed.tasks)) {
          throw new Error('Invalid LockIn backup file structure.');
        }
        parsed.version = 1;
        saveAppData(parsed);
        resolve(parsed);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsText(file);
  });
};

