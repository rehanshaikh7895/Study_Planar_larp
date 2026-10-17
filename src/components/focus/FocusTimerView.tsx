import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { playSound } from '../../utils/audio';
import { triggerConfetti } from '../../utils/confetti';
import { triggerEmojiBurst } from '../../utils/emojiPop';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Volume2,
  VolumeX,
  Flame,
  CheckCircle2,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

export const FocusTimerView: React.FC = () => {
  const {
    data,
    logFocusSession,
    toggleExamTopicComplete,
    toggleSound,
    setActiveTab,
  } = useApp();

  const [mode, setMode] = useState<'focus' | 'short_break' | 'long_break'>('focus');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(data.subjects[0]?.id || '');
  const [selectedTopicName, setSelectedTopicName] = useState<string>('');
  const [completedSessionsCount, setCompletedSessionsCount] = useState<number>(0);
  const [topicFilterSubject, setTopicFilterSubject] = useState<string>('all');

  // Duration in seconds
  const focusSeconds = (data.settings.pomodoroFocusMinutes || 25) * 60;
  const shortBreakSeconds = (data.settings.pomodoroShortBreakMinutes || 5) * 60;
  const longBreakSeconds = (data.settings.pomodoroLongBreakMinutes || 15) * 60;

  const getTargetSeconds = (m: 'focus' | 'short_break' | 'long_break') => {
    if (m === 'focus') return focusSeconds;
    if (m === 'short_break') return shortBreakSeconds;
    return longBreakSeconds;
  };

  const [timeLeft, setTimeLeft] = useState<number>(focusSeconds);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);
  const [sessionStartTime, setSessionStartTime] = useState<string>('');

  const targetEndRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isRunning) {
      setTimeLeft(getTargetSeconds(mode));
    }
  }, [
    data.settings.pomodoroFocusMinutes,
    data.settings.pomodoroShortBreakMinutes,
    data.settings.pomodoroLongBreakMinutes,
    mode,
  ]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isRunning) {
      if (!targetEndRef.current) {
        targetEndRef.current = Date.now() + timeLeft * 1000;
      }

      interval = setInterval(() => {
        const remaining = Math.max(0, Math.ceil((targetEndRef.current! - Date.now()) / 1000));
        setTimeLeft(remaining);

        if (remaining <= 0) {
          clearInterval(interval!);
          setIsRunning(false);
          targetEndRef.current = null;
          handleSessionEnd();
        }
      }, 500);
    } else {
      targetEndRef.current = null;
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  const handleStart = (e?: React.MouseEvent) => {
    if (!isRunning) {
      setSessionStartTime(new Date().toISOString());
      targetEndRef.current = Date.now() + timeLeft * 1000;
      setIsRunning(true);
      playSound('start', data.settings.soundEnabled);
      if (e) triggerEmojiBurst(e);
    }
  };

  const handlePause = () => {
    if (isRunning) {
      setIsRunning(false);
      targetEndRef.current = null;
      playSound('click', data.settings.soundEnabled);
    }
  };

  const handleResetRequest = () => {
    const total = getTargetSeconds(mode);
    if (timeLeft < total - 10) {
      setShowResetConfirm(true);
    } else {
      executeReset();
    }
  };

  const executeReset = () => {
    setIsRunning(false);
    targetEndRef.current = null;
    setTimeLeft(getTargetSeconds(mode));
    setShowResetConfirm(false);
    playSound('click', data.settings.soundEnabled);
  };

  const handleSkip = () => {
    setIsRunning(false);
    targetEndRef.current = null;
    if (mode === 'focus') {
      const nextCount = completedSessionsCount + 1;
      setCompletedSessionsCount(nextCount);
      if (nextCount % 4 === 0) {
        setMode('long_break');
        setTimeLeft(longBreakSeconds);
      } else {
        setMode('short_break');
        setTimeLeft(shortBreakSeconds);
      }
    } else {
      setMode('focus');
      setTimeLeft(focusSeconds);
    }
    playSound('click', data.settings.soundEnabled);
  };

  const handleSessionEnd = () => {
    playSound('timer_end', data.settings.soundEnabled);

    if (mode === 'focus') {
      triggerConfetti('standard');
      const nextCount = completedSessionsCount + 1;
      setCompletedSessionsCount(nextCount);

      const durMins = Math.round(focusSeconds / 60);
      logFocusSession({
        startTime: sessionStartTime || new Date().toISOString(),
        endTime: new Date().toISOString(),
        durationMinutes: durMins,
        subjectId: selectedSubjectId || undefined,
        mode: 'focus',
        completedGoal: true,
        xpEarned: Math.round(durMins * 4),
      });

      if (nextCount % 4 === 0) {
        setMode('long_break');
        setTimeLeft(longBreakSeconds);
      } else {
        setMode('short_break');
        setTimeLeft(shortBreakSeconds);
      }
    } else {
      setMode('focus');
      setTimeLeft(focusSeconds);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const totalDuration = getTargetSeconds(mode);
  const progressPercent = ((totalDuration - timeLeft) / totalDuration) * 100;
  const radius = 125;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  const currentSubject = data.subjects.find((s) => s.id === selectedSubjectId);

  // Flatten all syllabus topics from exams
  interface TopicRow {
    examId: string;
    examName: string;
    subjectId: string;
    topicId: string;
    name: string;
    isCompleted: boolean;
    confidence: number;
    difficulty: number;
    estimatedHours: number;
  }

  const allTopics: TopicRow[] = [];
  data.exams.forEach((exam) => {
    exam.topics.forEach((t) => {
      allTopics.push({
        examId: exam.id,
        examName: exam.name,
        subjectId: exam.subjectId,
        topicId: t.id,
        name: t.name,
        isCompleted: t.isCompleted,
        confidence: t.confidence,
        difficulty: t.difficulty,
        estimatedHours: t.estimatedHours,
      });
    });
  });

  const filteredTopics =
    topicFilterSubject === 'all'
      ? allTopics
      : allTopics.filter((t) => t.subjectId === topicFilterSubject);

  const completedCount = allTopics.filter((t) => t.isCompleted).length;
  const overallPercentage =
    allTopics.length > 0 ? Math.round((completedCount / allTopics.length) * 100) : 0;

  const handleToggleTopic = (e: React.MouseEvent, examId: string, topicId: string) => {
    toggleExamTopicComplete(examId, topicId);
    triggerEmojiBurst(e);
  };

  const handleFocusOnTopic = (topic: TopicRow) => {
    setSelectedSubjectId(topic.subjectId);
    setSelectedTopicName(topic.name);
    // Auto-scroll to timer on mobile
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
                FOCUS 3 OF 4: TRACK TOPICS & FOCUS SPRINT
              </span>
              <span className="text-xs">🔥</span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-white leading-snug">
              "Timer chal raha hai aur reels scroll kar rahe ho? Bhai/behen ye exam me nahi aane wala 💀 Ek topic select karo and Lock In!"
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('analytics')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-black font-bold text-xs hover:bg-neutral-200 transition-all shrink-0 hover:scale-105 active:scale-95 shadow-md"
        >
          <span>Next: Progress & Streaks</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main Grid: Timer on Left, Track Completed Topics on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Pomodoro Focus Timer (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-3xl bg-white border border-neutral-200 p-6 sm:p-8 flex flex-col items-center text-center shadow-xs">
            {/* Mode Switcher Tabs */}
            <div className="flex items-center gap-1 p-1 rounded-2xl bg-neutral-100 border border-neutral-200 mb-6">
              <button
                onClick={() => {
                  if (mode !== 'focus') {
                    setMode('focus');
                    setIsRunning(false);
                    setTimeLeft(focusSeconds);
                  }
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  mode === 'focus'
                    ? 'bg-black text-white shadow-xs'
                    : 'text-neutral-600 hover:text-black'
                }`}
              >
                <Flame className="w-3.5 h-3.5 fill-current" />
                <span>Focus ({Math.round(focusSeconds / 60)}m)</span>
              </button>

              <button
                onClick={() => {
                  if (mode !== 'short_break') {
                    setMode('short_break');
                    setIsRunning(false);
                    setTimeLeft(shortBreakSeconds);
                  }
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  mode === 'short_break'
                    ? 'bg-neutral-800 text-white shadow-xs'
                    : 'text-neutral-600 hover:text-black'
                }`}
              >
                <span>Break ({Math.round(shortBreakSeconds / 60)}m)</span>
              </button>

              <button
                onClick={() => {
                  if (mode !== 'long_break') {
                    setMode('long_break');
                    setIsRunning(false);
                    setTimeLeft(longBreakSeconds);
                  }
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  mode === 'long_break'
                    ? 'bg-neutral-800 text-white shadow-xs'
                    : 'text-neutral-600 hover:text-black'
                }`}
              >
                <span>Long ({Math.round(longBreakSeconds / 60)}m)</span>
              </button>
            </div>

            {/* Subject Dropdown Selector */}
            <div className="w-full mb-4">
              <select
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-800 focus:outline-none focus:border-black font-semibold text-center"
              >
                <option value="">Select subject to focus</option>
                {data.subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.code} — {sub.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Currently Focused Topic Banner */}
            {selectedTopicName && (
              <div className="w-full mb-4 px-3 py-2 rounded-xl bg-neutral-100 border border-neutral-200 text-xs font-bold text-neutral-800 flex items-center justify-between">
                <span className="truncate">Focusing on: {selectedTopicName}</span>
                <button
                  onClick={() => setSelectedTopicName('')}
                  className="text-neutral-400 hover:text-black font-bold ml-2"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Circular SVG Timer */}
            <div className="relative flex items-center justify-center my-3">
              <svg className="w-64 h-64 -rotate-90">
                <circle
                  cx="50%"
                  cy="50%"
                  r={radius}
                  className="stroke-neutral-100"
                  strokeWidth="10"
                  fill="transparent"
                />

                <circle
                  cx="50%"
                  cy="50%"
                  r={radius}
                  className={`transition-all duration-300 ${
                    mode === 'focus' ? 'stroke-black' : 'stroke-neutral-700'
                  }`}
                  strokeWidth="10"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>

              {/* Inner Display */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-1">
                <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-neutral-400">
                  {mode === 'focus'
                    ? 'LOCK-IN SPRINT'
                    : mode === 'short_break'
                    ? 'QUICK CHILL'
                    : 'DEEP RECHARGE'}
                </span>

                <h2 className="text-5xl font-mono font-black tracking-tight text-black tabular-nums">
                  {formatTime(timeLeft)}
                </h2>

                {currentSubject && (
                  <div
                    className="text-xs font-bold px-2.5 py-0.5 rounded-full inline-block mt-1"
                    style={{
                      backgroundColor: `${currentSubject.color}15`,
                      color: currentSubject.color,
                    }}
                  >
                    {currentSubject.name}
                  </div>
                )}

                <span className="text-[10px] text-neutral-400 font-mono pt-1">
                  {completedSessionsCount} Cooked Today 🔥
                </span>
              </div>
            </div>

            {/* Timer Controls */}
            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={handleResetRequest}
                className="p-3 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-black transition-all hover:scale-105 active:scale-95"
                title="Reset Timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {isRunning ? (
                <button
                  onClick={handlePause}
                  className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-sm shadow-md transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <Pause className="w-4 h-4 fill-current" />
                  <span>Pause</span>
                </button>
              ) : (
                <button
                  onClick={(e) => handleStart(e)}
                  className="flex items-center gap-2 px-9 py-3.5 rounded-2xl bg-black hover:bg-neutral-800 text-white font-bold text-sm shadow-md transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Lock In Now 🔥</span>
                </button>
              )}

              <button
                onClick={handleSkip}
                className="p-3 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-black transition-all hover:scale-105 active:scale-95"
                title="Skip to next session"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            {/* Sound Toggle */}
            <div className="mt-6 pt-4 border-t border-neutral-100 w-full flex items-center justify-between text-xs text-neutral-500">
              <button
                onClick={toggleSound}
                className="flex items-center gap-1.5 hover:text-black transition-colors font-medium"
              >
                {data.settings.soundEnabled ? (
                  <>
                    <Volume2 className="w-4 h-4 text-black" />
                    <span>Audio: On</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-4 h-4 text-neutral-400" />
                    <span>Audio: Muted</span>
                  </>
                )}
              </button>

              <span className="font-mono text-[11px] text-neutral-400">
                25m Work / 5m Rest
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Track Completed Topics Checklist (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-3xl bg-white border border-neutral-200 p-6 sm:p-7 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-black flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-black" />
                  <span>Track Completed Topics</span>
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Check off topics as you finish them. Triggers Apple Fire bursts + updates your syllabus completion!
                </p>
              </div>

              {/* Subject Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
                <button
                  onClick={() => setTopicFilterSubject('all')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    topicFilterSubject === 'all'
                      ? 'bg-black text-white'
                      : 'bg-neutral-100 text-neutral-600 hover:text-black'
                  }`}
                >
                  All ({allTopics.length})
                </button>
                {data.subjects.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => setTopicFilterSubject(sub.id)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      topicFilterSubject === sub.id
                        ? 'bg-black text-white'
                        : 'bg-neutral-100 text-neutral-600 hover:text-black'
                    }`}
                  >
                    {sub.code}
                  </button>
                ))}
              </div>
            </div>

            {/* Overall Progress Bar */}
            <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-center justify-between gap-4">
              <div className="flex-1 space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-neutral-700">Total Syllabus Mastered:</span>
                  <span className="font-mono text-black">{overallPercentage}% ({completedCount}/{allTopics.length})</span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-black h-full rounded-full transition-all duration-500"
                    style={{ width: `${overallPercentage}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Topics List */}
            {filteredTopics.length === 0 ? (
              <div className="p-8 text-center rounded-2xl border border-dashed border-neutral-200 text-neutral-500 text-xs">
                No syllabus topics found for this subject filter.
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
                {filteredTopics.map((topic) => {
                  const subject = data.subjects.find((s) => s.id === topic.subjectId);
                  return (
                    <div
                      key={`${topic.examId}-${topic.topicId}`}
                      className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                        topic.isCompleted
                          ? 'bg-neutral-50 border-neutral-200 opacity-60'
                          : 'bg-white border-neutral-200 hover:border-neutral-300 shadow-xs'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* 1-Click Checkbox with Emoji Burst */}
                        <button
                          onClick={(e) => handleToggleTopic(e, topic.examId, topic.topicId)}
                          className={`p-1.5 rounded-xl border transition-all shrink-0 ${
                            topic.isCompleted
                              ? 'bg-black border-black text-white'
                              : 'border-neutral-300 hover:border-black text-transparent hover:text-neutral-300'
                          }`}
                          title={topic.isCompleted ? 'Mark incomplete' : 'Mark completed (+80 XP 🔥)'}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>

                        <div className="min-w-0">
                          <span
                            className={`text-xs font-bold block truncate ${
                              topic.isCompleted ? 'line-through text-neutral-400' : 'text-black'
                            }`}
                          >
                            {topic.name}
                          </span>
                          <div className="flex items-center gap-2 text-[10px] text-neutral-400 mt-0.5">
                            {subject && (
                              <span
                                className="font-bold px-1.5 py-0.2 rounded"
                                style={{
                                  backgroundColor: `${subject.color}15`,
                                  color: subject.color,
                                }}
                              >
                                {subject.code}
                              </span>
                            )}
                            <span>{topic.examName}</span>
                            <span>•</span>
                            <span>Est. {topic.estimatedHours}h</span>
                          </div>
                        </div>
                      </div>

                      {/* Action: Focus on this topic */}
                      <button
                        onClick={() => handleFocusOnTopic(topic)}
                        className="px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-[11px] font-bold shrink-0 transition-colors"
                      >
                        Focus This
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Next Step Action Box */}
      <div className="p-6 rounded-3xl bg-neutral-100 border border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-black text-black">Ready for Focus Step 4?</h4>
          <p className="text-xs text-neutral-600 mt-0.5">
            Check your overall academic comeback, syllabus completion bars, and study streak scorecard.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('analytics')}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-black hover:bg-neutral-800 text-white font-bold text-xs shadow-md transition-all hover:scale-105 active:scale-95 shrink-0"
        >
          <span>View Progress & Streaks</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-neutral-200 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="text-sm font-black text-black">Reset current focus session?</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              You are currently in the middle of a focus block. Resetting will clear the active timer.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-xl bg-neutral-100 text-neutral-700 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={executeReset}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold"
              >
                Reset Timer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
