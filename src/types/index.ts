export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type TaskStatus = 'todo' | 'in_progress' | 'completed';

export interface Subject {
  id: string;
  name: string;
  code: string;
  color: string; // hex
  icon?: string;
}

export interface Task {
  id: string;
  title: string;
  subjectId: string;
  topic?: string;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm
  estimatedDuration: number; // in minutes
  priority: Priority;
  difficulty: 1 | 2 | 3 | 4 | 5; // 1: Easy, 5: Demon
  status: TaskStatus;
  completedAt?: string;
  notes?: string;
  createdAt: string;
}

export interface SyllabusTopic {
  id: string;
  name: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  confidence: 1 | 2 | 3 | 4 | 5; // 1: Lost, 5: Mastered
  estimatedHours: number;
  isCompleted: boolean;
  notes?: string;
}

export interface Exam {
  id: string;
  name: string;
  subjectId: string;
  examDate: string; // YYYY-MM-DD
  examTime?: string; // HH:mm
  targetGrade?: string;
  weightPercent?: number; // e.g. 40% of final grade
  topics: SyllabusTopic[];
  notes?: string;
}

export type SessionStatus = 'upcoming' | 'in_progress' | 'completed' | 'missed';

export interface ScheduledSession {
  id: string;
  subjectId: string;
  taskId?: string;
  examId?: string;
  topicName: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  durationMinutes: number;
  priorityScore: number;
  priorityReasons: string[];
  status: SessionStatus;
  isLocked: boolean; // if true, scheduler won't reschedule
  isBreak?: boolean;
}

export interface UnavailableSlot {
  id: string;
  title: string; // e.g. "Lecture", "Gym", "Work"
  daysOfWeek: number[]; // 0=Sun, 1=Mon, ..., 6=Sat
  startTime: string; // HH:mm
  endTime: string; // HH:mm
}

export interface SchedulerPreferences {
  dailyStudyTargetMinutes: number; // e.g. 180 (3 hrs)
  preferredTimeOfDay: 'morning' | 'afternoon' | 'evening' | 'night' | 'flexible';
  startHour: number; // e.g. 8 (8 AM)
  endHour: number; // e.g. 23 (11 PM)
  defaultSessionDuration: number; // e.g. 45 min
  breakDuration: number; // e.g. 10 min
  daysOff: number[]; // e.g. [0] for Sunday off
  unavailableSlots: UnavailableSlot[];
}

export interface FocusSessionLog {
  id: string;
  startTime: string; // ISO string
  endTime: string;
  durationMinutes: number;
  subjectId?: string;
  taskId?: string;
  mode: 'focus' | 'short_break' | 'long_break';
  completedGoal: boolean;
  notes?: string;
  xpEarned: number;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  targetCount: number;
  currentCount: number;
  isCompleted: boolean;
  type: 'focus_time' | 'tasks_completed' | 'urgent_task' | 'streak_day';
  expiresAt: string; // ISO date
}

export interface Achievement {
  id: string;
  title: string;
  badge: string; // emoji or icon
  description: string;
  unlockedAt?: string;
  category: 'streak' | 'focus' | 'tasks' | 'academic' | 'special';
  progress: number; // 0 to 100
  xp: number;
}

export interface UserProfile {
  name: string;
  avatar: string; // emoji or identifier
  level: number;
  currentXP: number;
  targetXP: number;
  streakDays: number;
  longestStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
  dailyGoalMinutes: number;
  rankTitle: string;
}

export interface AppSettings {
  theme: 'dark' | 'light' | 'midnight';
  soundEnabled: boolean;
  reducedMotion: boolean;
  pomodoroFocusMinutes: number;
  pomodoroShortBreakMinutes: number;
  pomodoroLongBreakMinutes: number;
  pomodoroLongBreakInterval: number; // after 4 sessions
  notificationReminder: boolean;
}

export interface AppData {
  version: number;
  profile: UserProfile;
  subjects: Subject[];
  tasks: Task[];
  exams: Exam[];
  scheduledSessions: ScheduledSession[];
  focusLogs: FocusSessionLog[];
  schedulerPreferences: SchedulerPreferences;
  settings: AppSettings;
  achievements: Achievement[];
  quests: Quest[];
}

