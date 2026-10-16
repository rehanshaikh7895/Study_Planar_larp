import type { Task, Exam, ScheduledSession, SchedulerPreferences, Subject } from '../types';

export interface PriorityItem {
  id: string;
  type: 'exam_topic' | 'task';
  title: string;
  subjectId: string;
  examId?: string;
  taskId?: string;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string;
  difficulty: number; // 1-5
  confidence: number; // 1-5 (5 = mastered)
  weight: number; // 1-5
  estimatedMinutes: number;
  priorityScore: number;
  priorityReasons: string[];
}

export interface ScheduleResult {
  sessions: ScheduledSession[];
  warnings: string[];
  metrics: {
    totalRequestedMinutes: number;
    totalScheduledMinutes: number;
    daysScheduled: number;
    capacityDeficitMinutes: number;
  };
}

// Convert "HH:mm" to minutes from midnight
export const timeToMinutes = (timeStr: string): number => {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
};

// Convert minutes from midnight to "HH:mm"
export const minutesToTime = (mins: number): string => {
  const h = Math.floor(mins / 60) % 24;
  const m = mins % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

// Calculate transparent priority score
export const calculatePriorityScore = (
  daysUntilDue: number,
  difficulty: number,
  confidence: number,
  weight: number
): { score: number; reasons: string[] } => {
  const reasons: string[] = [];

  // Urgency score (closer deadline = higher urgency)
  let urgencyPts = 0;
  if (daysUntilDue <= 1) {
    urgencyPts = 45;
    reasons.push('Deadline is within 24 hours (+45 pts)');
  } else if (daysUntilDue <= 3) {
    urgencyPts = 35;
    reasons.push(`Due in ${daysUntilDue} days (+35 pts)`);
  } else if (daysUntilDue <= 7) {
    urgencyPts = 25;
    reasons.push(`Exam/task in ${daysUntilDue} days (+25 pts)`);
  } else if (daysUntilDue <= 14) {
    urgencyPts = 15;
    reasons.push(`Upcoming in ${daysUntilDue} days (+15 pts)`);
  } else {
    urgencyPts = 8;
    reasons.push('Paced long-term preparation (+8 pts)');
  }

  // Confidence deficit score (confidence 1-5, lower confidence = higher study need)
  const confidenceDeficit = Math.max(1, 6 - confidence);
  const confidencePts = confidenceDeficit * 6; // up to 30 pts
  if (confidence <= 2) {
    reasons.push(`Low confidence rating (${confidence}/5) requires priority review (+${confidencePts} pts)`);
  } else if (confidence <= 3) {
    reasons.push(`Moderate mastery (${confidence}/5) (+${confidencePts} pts)`);
  } else {
    reasons.push(`High confidence (${confidence}/5) revision check (+${confidencePts} pts)`);
  }

  // Difficulty score (difficulty 1-5)
  const difficultyPts = difficulty * 5; // up to 25 pts
  if (difficulty >= 4) {
    reasons.push(`High topic difficulty rating (${difficulty}/5) (+${difficultyPts} pts)`);
  } else {
    reasons.push(`Difficulty rating (${difficulty}/5) (+${difficultyPts} pts)`);
  }

  // Exam/Task weight (weight 1-5)
  const weightPts = Math.min(20, Math.round(weight * 4));
  if (weight >= 4) {
    reasons.push(`High exam importance/grade impact (+${weightPts} pts)`);
  }

  const totalScore = urgencyPts + confidencePts + difficultyPts + weightPts;
  return { score: totalScore, reasons };
};

// Check if a time interval collides with unavailable recurring slots on a day
const isSlotBlocked = (
  dayOfWeek: number,
  startMins: number,
  endMins: number,
  preferences: SchedulerPreferences
): boolean => {
  for (const slot of preferences.unavailableSlots) {
    if (slot.daysOfWeek.includes(dayOfWeek)) {
      const slotStart = timeToMinutes(slot.startTime);
      const slotEnd = timeToMinutes(slot.endTime);
      // Overlap condition
      if (Math.max(startMins, slotStart) < Math.min(endMins, slotEnd)) {
        return true;
      }
    }
  }
  return false;
};

// Generate smart schedule
export const generateSmartSchedule = (
  tasks: Task[],
  exams: Exam[],
  existingSessions: ScheduledSession[],
  preferences: SchedulerPreferences,
  _subjects: Subject[],
  daysToPlan: number = 7
): ScheduleResult => {
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const warnings: string[] = [];
  const priorityItems: PriorityItem[] = [];

  // Keep all locked sessions and all past completed sessions
  const lockedSessions = existingSessions.filter(
    (s) => s.isLocked || (s.date === todayStr && s.status === 'completed')
  );

  // 1. Gather all incomplete Tasks
  tasks
    .filter((t) => t.status !== 'completed')
    .forEach((t) => {
      const taskDate = new Date(t.dueDate + 'T00:00:00');
      const diffTime = taskDate.getTime() - new Date(todayStr + 'T00:00:00').getTime();
      const diffDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

      const priorityWeightMap: Record<string, number> = {
        urgent: 5,
        high: 4,
        medium: 3,
        low: 2,
      };

      const weight = priorityWeightMap[t.priority] || 3;
      const confidence = Math.max(1, 6 - t.difficulty);
      const { score, reasons } = calculatePriorityScore(diffDays, t.difficulty, confidence, weight);

      priorityItems.push({
        id: `task-item-${t.id}`,
        type: 'task',
        title: t.title,
        subjectId: t.subjectId,
        taskId: t.id,
        dueDate: t.dueDate,
        dueTime: t.dueTime,
        difficulty: t.difficulty,
        confidence,
        weight,
        estimatedMinutes: t.estimatedDuration || 45,
        priorityScore: score,
        priorityReasons: reasons,
      });
    });

  // 2. Gather all incomplete Exam Topics
  exams.forEach((exam) => {
    const examDate = new Date(exam.examDate + 'T00:00:00');
    const diffTime = examDate.getTime() - new Date(todayStr + 'T00:00:00').getTime();
    const diffDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    const weightScale = Math.min(5, Math.max(2, Math.round((exam.weightPercent || 30) / 10)));

    exam.topics
      .filter((top) => !top.isCompleted)
      .forEach((top) => {
        const { score, reasons } = calculatePriorityScore(diffDays, top.difficulty, top.confidence, weightScale);
        reasons.unshift(`Exam: ${exam.name} on ${exam.examDate}`);

        priorityItems.push({
          id: `exam-topic-${exam.id}-${top.id}`,
          type: 'exam_topic',
          title: `${top.name} (${exam.name})`,
          subjectId: exam.subjectId,
          examId: exam.id,
          dueDate: exam.examDate,
          difficulty: top.difficulty,
          confidence: top.confidence,
          weight: weightScale,
          estimatedMinutes: Math.round(top.estimatedHours * 60),
          priorityScore: score + 10,
          priorityReasons: reasons,
        });
      });
  });

  // Sort items strictly by descending priority score
  priorityItems.sort((a, b) => b.priorityScore - a.priorityScore);

  const totalRequestedMinutes = priorityItems.reduce((acc, it) => acc + it.estimatedMinutes, 0);

  // Chunk items into manageable sessions
  const chunkMaxMins = preferences.defaultSessionDuration || 45;
  interface StudyChunk {
    item: PriorityItem;
    chunkDuration: number;
    chunkIndex: number;
    totalChunks: number;
  }

  const chunksToSchedule: StudyChunk[] = [];
  priorityItems.forEach((item) => {
    let rem = item.estimatedMinutes;
    let idx = 1;
    const total = Math.ceil(rem / chunkMaxMins) || 1;
    while (rem > 0) {
      const d = Math.min(rem, chunkMaxMins);
      chunksToSchedule.push({
        item,
        chunkDuration: Math.max(25, d),
        chunkIndex: idx,
        totalChunks: total,
      });
      rem -= d;
      idx++;
    }
  });

  const newScheduledSessions: ScheduledSession[] = [...lockedSessions];
  const dailyOccupiedMins: Record<string, Array<{ start: number; end: number }>> = {};

  for (let d = 0; d < daysToPlan; d++) {
    const targetDate = new Date(now.getTime() + d * 86400000);
    const dateStr = targetDate.toISOString().split('T')[0];
    dailyOccupiedMins[dateStr] = [];

    lockedSessions
      .filter((s) => s.date === dateStr)
      .forEach((s) => {
        dailyOccupiedMins[dateStr].push({
          start: timeToMinutes(s.startTime),
          end: timeToMinutes(s.endTime),
        });
      });
  }

  let chunkPointer = 0;
  const breakMins = preferences.breakDuration || 10;
  const dailyTarget = preferences.dailyStudyTargetMinutes || 180;
  let totalScheduledMinutes = lockedSessions.reduce((acc, s) => acc + s.durationMinutes, 0);

  const timePreferences: Record<string, number> = {
    morning: 9 * 60,
    afternoon: 14 * 60,
    evening: 18 * 60,
    night: 20 * 60,
    flexible: 10 * 60,
  };

  const dayStartLimit = (preferences.startHour || 8) * 60;
  const dayEndLimit = (preferences.endHour || 23) * 60;

  for (let dayOffset = 0; dayOffset < daysToPlan; dayOffset++) {
    const curDate = new Date(now.getTime() + dayOffset * 86400000);
    const dayOfWeek = curDate.getDay();
    const dateStr = curDate.toISOString().split('T')[0];

    if (preferences.daysOff.includes(dayOfWeek)) {
      continue;
    }

    let dailyPlanned = dailyOccupiedMins[dateStr].reduce((acc, o) => acc + (o.end - o.start), 0);
    let curTimeMins = Math.max(dayStartLimit, timePreferences[preferences.preferredTimeOfDay] || 10 * 60);

    if (dayOffset === 0) {
      const currentNowMins = now.getHours() * 60 + now.getMinutes() + 15;
      curTimeMins = Math.max(curTimeMins, currentNowMins);
    }

    while (dailyPlanned + 30 <= dailyTarget && curTimeMins + 30 <= dayEndLimit && chunkPointer < chunksToSchedule.length) {
      const chunk = chunksToSchedule[chunkPointer];
      const proposedEnd = curTimeMins + chunk.chunkDuration;

      if (proposedEnd > dayEndLimit) {
        break;
      }

      if (isSlotBlocked(dayOfWeek, curTimeMins, proposedEnd, preferences)) {
        curTimeMins += 30;
        continue;
      }

      const overlapsExisting = dailyOccupiedMins[dateStr].some(
        (slot) => Math.max(curTimeMins, slot.start) < Math.min(proposedEnd, slot.end)
      );

      if (overlapsExisting) {
        curTimeMins += 15;
        continue;
      }

      const chunkTitle =
        chunk.totalChunks > 1
          ? `${chunk.item.title} (Part ${chunk.chunkIndex}/${chunk.totalChunks})`
          : chunk.item.title;

      const newSession: ScheduledSession = {
        id: `sched-${Date.now()}-${chunkPointer}`,
        subjectId: chunk.item.subjectId,
        taskId: chunk.item.taskId,
        examId: chunk.item.examId,
        topicName: chunkTitle,
        date: dateStr,
        startTime: minutesToTime(curTimeMins),
        endTime: minutesToTime(proposedEnd),
        durationMinutes: chunk.chunkDuration,
        priorityScore: chunk.item.priorityScore,
        priorityReasons: chunk.item.priorityReasons,
        status: 'upcoming',
        isLocked: false,
      };

      newScheduledSessions.push(newSession);
      dailyOccupiedMins[dateStr].push({ start: curTimeMins, end: proposedEnd });
      dailyPlanned += chunk.chunkDuration;
      totalScheduledMinutes += chunk.chunkDuration;

      curTimeMins = proposedEnd + breakMins;
      chunkPointer++;
    }
  }

  const unscheduledChunks = chunksToSchedule.length - chunkPointer;
  const unscheduledMins = chunksToSchedule
    .slice(chunkPointer)
    .reduce((acc, c) => acc + c.chunkDuration, 0);

  if (unscheduledChunks > 0) {
    warnings.push(
      `Workload capacity notice: ${unscheduledChunks} study blocks (~${Math.round(
        unscheduledMins / 60
      )} hrs) could not fit within your ${daysToPlan}-day target limit (${dailyTarget} mins/day). Consider increasing your daily target or extending planning window.`
    );
  }

  newScheduledSessions.sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return a.startTime.localeCompare(b.startTime);
  });

  return {
    sessions: newScheduledSessions,
    warnings,
    metrics: {
      totalRequestedMinutes,
      totalScheduledMinutes,
      daysScheduled: daysToPlan,
      capacityDeficitMinutes: unscheduledMins,
    },
  };
};

