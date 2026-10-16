import type { AppData } from '../types';

export interface DayStudyStat {
  date: string;
  dayName: string;
  actualMinutes: number;
  plannedMinutes: number;
  goalMinutes: number;
  sessionsCount: number;
}

export interface SubjectStat {
  subjectId: string;
  name: string;
  code: string;
  color: string;
  minutes: number;
  percentage: number;
}

export interface AnalyticsSummary {
  todayActualMinutes: number;
  todayPlannedMinutes: number;
  weeklyActualMinutes: number;
  weeklyPlannedMinutes: number;
  completedTasksCount: number;
  totalTasksCount: number;
  taskCompletionRate: number;
  overdueTasksCount: number;
  activeStreak: number;
  longestStreak: number;
  daysMetGoalThisWeek: number;
  mostProductiveDay: string;
  mostProductiveSlot: string;
  last7Days: DayStudyStat[];
  subjectStats: SubjectStat[];
  insights: string[];
}

export const calculateAnalytics = (data: AppData): AnalyticsSummary => {
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  const last7Days: DayStudyStat[] = [];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86400000);
    const dateStr = d.toISOString().split('T')[0];
    const dayName = dayNames[d.getDay()];

    const actualMins = data.focusLogs
      .filter((l) => l.startTime.startsWith(dateStr) && l.mode === 'focus')
      .reduce((acc, l) => acc + l.durationMinutes, 0);

    const plannedMins = data.scheduledSessions
      .filter((s) => s.date === dateStr && !s.isBreak)
      .reduce((acc, s) => acc + s.durationMinutes, 0);

    const sessionsCount = data.focusLogs.filter(
      (l) => l.startTime.startsWith(dateStr) && l.mode === 'focus'
    ).length;

    last7Days.push({
      date: dateStr,
      dayName: i === 0 ? 'Today' : dayName,
      actualMinutes: actualMins,
      plannedMinutes: plannedMins,
      goalMinutes: data.profile.dailyGoalMinutes || 120,
      sessionsCount,
    });
  }

  const todayStat = last7Days[last7Days.length - 1];
  const todayActualMinutes = todayStat.actualMinutes;
  const todayPlannedMinutes = todayStat.plannedMinutes;

  const weeklyActualMinutes = last7Days.reduce((acc, d) => acc + d.actualMinutes, 0);
  const weeklyPlannedMinutes = last7Days.reduce((acc, d) => acc + d.plannedMinutes, 0);

  const daysMetGoalThisWeek = last7Days.filter((d) => d.actualMinutes >= d.goalMinutes).length;

  const totalTasksCount = data.tasks.length;
  const completedTasksCount = data.tasks.filter((t) => t.status === 'completed').length;
  const taskCompletionRate = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

  const overdueTasksCount = data.tasks.filter((t) => {
    if (t.status === 'completed') return false;
    return t.dueDate < todayStr;
  }).length;

  const subjectMap: Record<string, number> = {};
  data.focusLogs
    .filter((l) => l.mode === 'focus' && l.subjectId)
    .forEach((l) => {
      subjectMap[l.subjectId!] = (subjectMap[l.subjectId!] || 0) + l.durationMinutes;
    });

  const totalSubjectMins = Object.values(subjectMap).reduce((a, b) => a + b, 0);

  const subjectStats: SubjectStat[] = data.subjects
    .map((sub) => {
      const mins = subjectMap[sub.id] || 0;
      const pct = totalSubjectMins > 0 ? Math.round((mins / totalSubjectMins) * 100) : 0;
      return {
        subjectId: sub.id,
        name: sub.name,
        code: sub.code,
        color: sub.color,
        minutes: mins,
        percentage: pct,
      };
    })
    .filter((s) => s.minutes > 0)
    .sort((a, b) => b.minutes - a.minutes);

  let bestDay = last7Days[0];
  last7Days.forEach((d) => {
    if (d.actualMinutes > bestDay.actualMinutes) {
      bestDay = d;
    }
  });
  const mostProductiveDay =
    bestDay.actualMinutes > 0 ? `${bestDay.dayName} (${bestDay.actualMinutes}m)` : 'Not enough data yet';

  const slotCounts: Record<string, number> = {
    'Morning (6 AM - 12 PM)': 0,
    'Afternoon (12 PM - 5 PM)': 0,
    'Evening (5 PM - 9 PM)': 0,
    'Night (9 PM - 2 AM)': 0,
  };

  data.focusLogs.forEach((l) => {
    try {
      const h = new Date(l.startTime).getHours();
      if (h >= 6 && h < 12) slotCounts['Morning (6 AM - 12 PM)'] += l.durationMinutes;
      else if (h >= 12 && h < 17) slotCounts['Afternoon (12 PM - 5 PM)'] += l.durationMinutes;
      else if (h >= 17 && h < 21) slotCounts['Evening (5 PM - 9 PM)'] += l.durationMinutes;
      else slotCounts['Night (9 PM - 2 AM)'] += l.durationMinutes;
    } catch {
      // ignore
    }
  });

  let topSlot = 'Evening (5 PM - 9 PM)';
  let maxSlotMins = 0;
  Object.entries(slotCounts).forEach(([slot, mins]) => {
    if (mins > maxSlotMins) {
      maxSlotMins = mins;
      topSlot = slot;
    }
  });
  const mostProductiveSlot = maxSlotMins > 0 ? topSlot : 'Flexible';

  const insights: string[] = [];

  const yesterdayStat = last7Days[last7Days.length - 2];
  if (todayActualMinutes > yesterdayStat.actualMinutes && yesterdayStat.actualMinutes > 0) {
    const diff = todayActualMinutes - yesterdayStat.actualMinutes;
    insights.push(`You studied ${diff} minutes more today than yesterday. Momentum is building! 🔥`);
  } else if (todayActualMinutes >= todayStat.goalMinutes) {
    insights.push(`Daily goal crushed! You've logged ${todayActualMinutes} minutes today (${Math.round((todayActualMinutes / todayStat.goalMinutes) * 100)}% of goal).`);
  } else if (weeklyActualMinutes > 0) {
    insights.push(`You've accumulated ${(weeklyActualMinutes / 60).toFixed(1)} hours of deep focus across the last 7 days.`);
  }

  if (subjectStats.length > 0) {
    const topSub = subjectStats[0];
    insights.push(`${topSub.name} commanded ${topSub.percentage}% of your tracked study time (${Math.round(topSub.minutes / 60)}h ${topSub.minutes % 60}m).`);
  }

  if (completedTasksCount > 0 && totalTasksCount > 0) {
    insights.push(`Completed ${completedTasksCount} of ${totalTasksCount} tasks (${taskCompletionRate}% total completion rate).`);
  } else {
    insights.push('Start your first focus session or complete a task to unlock deeper AI-free productivity insights.');
  }

  if (maxSlotMins > 30) {
    insights.push(`Peak flow state: You tend to study most consistently in the ${mostProductiveSlot.split(' ')[0].toLowerCase()}.`);
  }

  return {
    todayActualMinutes,
    todayPlannedMinutes,
    weeklyActualMinutes,
    weeklyPlannedMinutes,
    completedTasksCount,
    totalTasksCount,
    taskCompletionRate,
    overdueTasksCount,
    activeStreak: data.profile.streakDays,
    longestStreak: data.profile.longestStreak,
    daysMetGoalThisWeek,
    mostProductiveDay,
    mostProductiveSlot,
    last7Days,
    subjectStats,
    insights,
  };
};

