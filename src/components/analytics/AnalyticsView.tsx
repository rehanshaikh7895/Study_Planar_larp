import React from 'react';
import { useApp } from '../../context/AppContext';
import { calculateAnalytics } from '../../utils/analytics';
import { triggerEmojiBurst } from '../../utils/emojiPop';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Clock,
  CheckCircle2,
  Calendar,
  Flame,
  Award,
  ArrowRight,
  Sparkles,
  BookOpen,
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { data, loadDemoMode, setActiveTab } = useApp();
  const analytics = calculateAnalytics(data);

  const weeklyHours = (analytics.weeklyActualMinutes / 60).toFixed(1);
  const plannedWeeklyHours = (analytics.weeklyPlannedMinutes / 60).toFixed(1);

  // Compute subject-level syllabus completion
  const subjectProgress = data.subjects.map((sub) => {
    const examsForSub = data.exams.filter((e) => e.subjectId === sub.id);
    let totalTopics = 0;
    let completedTopics = 0;
    let nearestExamDate: string | null = null;

    examsForSub.forEach((exam) => {
      totalTopics += exam.topics.length;
      completedTopics += exam.topics.filter((t) => t.isCompleted).length;
      if (!nearestExamDate || exam.examDate < nearestExamDate) {
        nearestExamDate = exam.examDate;
      }
    });

    const pct = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
    return {
      subject: sub,
      totalTopics,
      completedTopics,
      pct,
      nearestExamDate,
    };
  });

  const allTopicsCount = subjectProgress.reduce((acc, s) => acc + s.totalTopics, 0);
  const allCompletedTopics = subjectProgress.reduce((acc, s) => acc + s.completedTopics, 0);
  const overallSyllabusPct =
    allTopicsCount > 0 ? Math.round((allCompletedTopics / allTopicsCount) * 100) : 0;

  // Sarcastic mentor verdict
  const getMentorVerdict = () => {
    if (overallSyllabusPct >= 75) {
      return {
        text: '"Academic God Arc unlocked 👑 Bas exam hall me overconfidence me blank mat hona!"',
        sub: 'You have crushed over 75% of your total syllabus. Keep reviewing!',
        tag: 'ACADEMIC WEAPON 🔥',
      };
    } else if (overallSyllabusPct >= 40) {
      return {
        text: '"Cookin\' but don\'t start slacking off now! 🍳 Half syllabus is not full marks shawtys!"',
        sub: 'Solid momentum. Knock out those remaining low-confidence topics!',
        tag: 'HALFWAY THERE ⚡',
      };
    } else {
      return {
        text: '"Analytics dekh ke khush mat ho! Ceiling fan ke blades mat gino, jaake padho! 😭💀"',
        sub: 'Syllabus completion is still under 40%. Start a 25-minute focus session right now.',
        tag: 'CEILING FAN GINNER ARC 🗿',
      };
    }
  };

  const verdict = getMentorVerdict();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Sarcastic Mentor Guidance Banner */}
      <div className="p-4 sm:p-5 rounded-3xl bg-neutral-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl border border-neutral-800">
        <div className="flex items-center gap-4">
          <div
            onClick={(e) => triggerEmojiBurst(e)}
            className="w-14 h-14 rounded-2xl bg-neutral-800 border border-neutral-700 shrink-0 flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95 transition-all overflow-hidden relative group"
            title="Click for Apple Fire pop! 🔥"
          >
            <img
              src="/person.png"
              alt="Mentor"
              className="w-full h-full object-contain filter drop-shadow group-hover:rotate-6 transition-transform"
            />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase px-2 py-0.5 rounded-full bg-white/10 text-neutral-300">
                {verdict.tag}
              </span>
              <span className="text-xs">📈</span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-white leading-snug">
              {verdict.text}
            </p>
            <p className="text-[11px] text-neutral-400 mt-0.5">{verdict.sub}</p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('focus')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-black font-bold text-xs hover:bg-neutral-200 transition-all shrink-0 hover:scale-105 active:scale-95 shadow-md"
        >
          <span>Jump to Focus Timer</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-neutral-200 shadow-xs">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-black flex items-center gap-2">
            <span>Progress & Academic Comeback</span>
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Real tracked progress from your syllabus completions and verified focus timer minutes.
          </p>
        </div>

        {analytics.weeklyActualMinutes === 0 && (
          <button
            onClick={loadDemoMode}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-100 text-neutral-800 text-xs font-bold hover:bg-neutral-200 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-black" />
            <span>Load Demo Data to Preview</span>
          </button>
        )}
      </div>

      {/* Top 4 Core Progress Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Overall Syllabus Mastered */}
        <div className="p-5 rounded-3xl bg-white border border-neutral-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-400 uppercase">Syllabus Mastered</span>
            <div className="p-2 rounded-xl bg-neutral-100 text-black">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-black">{overallSyllabusPct}%</span>
          </div>
          <span className="text-[11px] text-neutral-500 font-medium block">
            {allCompletedTopics} of {allTopicsCount} topics cleared
          </span>
        </div>

        {/* Metric 2: Study Streak */}
        <div className="p-5 rounded-3xl bg-white border border-neutral-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-400 uppercase">Active Streak</span>
            <div className="p-2 rounded-xl bg-neutral-100 text-rose-500">
              <Flame className="w-4 h-4 fill-rose-500" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-black">{data.profile.streakDays}</span>
            <span className="text-xs text-neutral-500 font-bold">days 🔥</span>
          </div>
          <span className="text-[11px] text-neutral-500 font-medium block">
            Personal best: {data.profile.longestStreak} days
          </span>
        </div>

        {/* Metric 3: Focus Hours Logged */}
        <div className="p-5 rounded-3xl bg-white border border-neutral-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-400 uppercase">Weekly Focus</span>
            <div className="p-2 rounded-xl bg-neutral-100 text-black">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-black">{weeklyHours}</span>
            <span className="text-xs text-neutral-500 font-bold">hrs</span>
          </div>
          <span className="text-[11px] text-neutral-500 font-medium block">
            Target: {plannedWeeklyHours} hrs planned
          </span>
        </div>

        {/* Metric 4: Academic Rank */}
        <div className="p-5 rounded-3xl bg-white border border-neutral-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-400 uppercase">Academic Level</span>
            <div className="p-2 rounded-xl bg-neutral-100 text-black">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-black text-black">Lvl {data.profile.level}</span>
          </div>
          <span className="text-[11px] text-neutral-500 font-medium block truncate">
            {data.profile.rankTitle}
          </span>
        </div>
      </div>

      {/* Syllabus Mastery per Subject (Clear visual progress bars) */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-neutral-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <div>
            <h3 className="text-base font-black text-black flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-black" />
              <span>Syllabus Completion by Subject</span>
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Track how close you are to 100% syllabus mastery for each upcoming exam.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('exams')}
            className="text-xs text-neutral-600 hover:text-black font-bold flex items-center gap-1"
          >
            <span>Manage Subjects</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {subjectProgress.map((subItem) => (
            <div
              key={subItem.subject.id}
              className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2.5">
                  <span
                    className="font-bold px-2 py-0.5 rounded text-[11px]"
                    style={{
                      backgroundColor: `${subItem.subject.color}15`,
                      color: subItem.subject.color,
                      border: `1px solid ${subItem.subject.color}30`,
                    }}
                  >
                    {subItem.subject.code}
                  </span>
                  <span className="font-bold text-black">{subItem.subject.name}</span>
                </div>

                <div className="flex items-center gap-3 text-neutral-500 text-[11px]">
                  {subItem.nearestExamDate && (
                    <span className="flex items-center gap-1 font-mono">
                      <Calendar className="w-3 h-3 text-black" />
                      Exam: {subItem.nearestExamDate}
                    </span>
                  )}
                  <span className="font-mono font-bold text-black">
                    {subItem.completedTopics} / {subItem.totalTopics} Topics ({subItem.pct}%)
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-neutral-200 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-black h-full rounded-full transition-all duration-500"
                  style={{ width: `${subItem.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Study Minutes Chart */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-neutral-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <div>
            <h3 className="text-base font-black text-black flex items-center gap-2">
              <Clock className="w-4 h-4 text-black" />
              <span>Daily Study Minutes (Last 7 Days)</span>
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Verified focus sessions recorded with the Pomodoro timer.
            </p>
          </div>
        </div>

        <div className="h-60 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analytics.last7Days} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="dayName" stroke="#a3a3a3" fontSize={11} tickLine={false} />
              <YAxis stroke="#a3a3a3" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e5e5',
                  borderRadius: '12px',
                  fontSize: '12px',
                  color: '#000000',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                }}
              />
              <Bar name="Actual Focus (Mins)" dataKey="actualMinutes" fill="#000000" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Navigation & Call to Action */}
      <div className="p-6 rounded-3xl bg-neutral-100 border border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-black text-black">Ready to level up your numbers?</h4>
          <p className="text-xs text-neutral-600 mt-0.5">
            Start a 25-minute Pomodoro sprint now or add new exam topics to study.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('exams')}
            className="px-4 py-2.5 rounded-xl bg-white text-black font-bold text-xs border border-neutral-200 hover:bg-neutral-50 transition-all"
          >
            1. Subjects & Exams
          </button>
          <button
            onClick={() => setActiveTab('focus')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-black hover:bg-neutral-800 text-white font-bold text-xs shadow-md transition-all hover:scale-105 active:scale-95"
          >
            <span>3. Lock In Timer</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
