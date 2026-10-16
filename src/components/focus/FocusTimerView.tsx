import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { playSound } from '../../utils/audio';
import { triggerConfetti } from '../../utils/confetti';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Volume2,
  VolumeX,
  Flame,
  Clock,
} from 'lucide-react';

export const FocusTimerView: React.FC = () => {
  const { data, logFocusSession, toggleTaskComplete, toggleSound } = useApp();

  const [mode, setMode] = useState<'focus' | 'short_break' | 'long_break'>('focus');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(data.subjects[0]?.id || '');
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const [completedSessionsCount, setCompletedSessionsCount] = useState<number>(0);

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
  const [showCompletionModal, setShowCompletionModal] = useState<boolean>(false);
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

  const handleStart = () => {
    if (!isRunning) {
      setSessionStartTime(new Date().toISOString());
      targetEndRef.current = Date.now() + timeLeft * 1000;
      setIsRunning(true);
      playSound('start', data.settings.soundEnabled);
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
        taskId: selectedTaskId || undefined,
        mode: 'focus',
        completedGoal: true,
        xpEarned: Math.round(durMins * 4),
      });

      if (selectedTaskId) {
        setShowCompletionModal(true);
      }

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
  const radius = 130;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  const currentSubject = data.subjects.find((s) => s.id === selectedSubjectId);
  const incompleteTasks = data.tasks.filter((t) => t.status !== 'completed');

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-4xl mx-auto">
      {/* Timer Container Card (White background designfull) */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/90 shadow-[0_4px_30px_-4px_rgba(0,0,0,0.06)] p-6 sm:p-10">
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center text-center space-y-6">
          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-100 border border-slate-200">
            <button
              onClick={() => {
                if (mode !== 'focus') {
                  setMode('focus');
                  setIsRunning(false);
                  setTimeLeft(focusSeconds);
                }
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                mode === 'focus'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>Focus Lock-In ({Math.round(focusSeconds / 60)}m)</span>
            </button>

            <button
              onClick={() => {
                if (mode !== 'short_break') {
                  setMode('short_break');
                  setIsRunning(false);
                  setTimeLeft(shortBreakSeconds);
                }
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                mode === 'short_break'
                  ? 'bg-pink-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Short Chill ({Math.round(shortBreakSeconds / 60)}m)</span>
            </button>

            <button
              onClick={() => {
                if (mode !== 'long_break') {
                  setMode('long_break');
                  setIsRunning(false);
                  setTimeLeft(longBreakSeconds);
                }
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                mode === 'long_break'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Recharge ({Math.round(longBreakSeconds / 60)}m)</span>
            </button>
          </div>

          {/* Subject & Task Linking Selectors */}
          <div className="w-full flex flex-col sm:flex-row items-center gap-3 justify-center">
            <div className="w-full sm:w-auto">
              <select
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="w-full sm:w-auto bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 font-medium"
              >
                <option value="">No specific subject</option>
                {data.subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.code} — {sub.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full sm:w-auto">
              <select
                value={selectedTaskId}
                onChange={(e) => setSelectedTaskId(e.target.value)}
                className="w-full sm:w-auto bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 font-medium"
              >
                <option value="">Link to pending task (optional)</option>
                {incompleteTasks.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title} ({t.estimatedDuration}m)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Circular SVG Animated Timer */}
          <div className="relative flex items-center justify-center my-4">
            <svg className="w-72 h-72 sm:w-80 sm:h-80 -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r={radius}
                className="stroke-slate-100"
                strokeWidth="12"
                fill="transparent"
              />

              <circle
                cx="50%"
                cy="50%"
                r={radius}
                className={`transition-all duration-300 ${
                  mode === 'focus'
                    ? 'stroke-indigo-600'
                    : mode === 'short_break'
                    ? 'stroke-pink-500'
                    : 'stroke-emerald-500'
                }`}
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                style={{
                  filter:
                    mode === 'focus'
                      ? 'drop-shadow(0 0 10px rgba(99, 102, 241, 0.4))'
                      : 'drop-shadow(0 0 10px rgba(236, 72, 153, 0.4))',
                }}
              />
            </svg>

            {/* Inner Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-1">
              <span className="text-[11px] font-mono tracking-widest uppercase font-bold text-slate-400">
                {mode === 'focus'
                  ? 'PADHLOSHAWTYS FOCUS ARC'
                  : mode === 'short_break'
                  ? 'SHORT CHILL'
                  : 'DEEP RECHARGE'}
              </span>

              <h2 className="text-5xl sm:text-6xl font-mono font-extrabold tracking-tight text-slate-900 tabular-nums">
                {formatTime(timeLeft)}
              </h2>

              {currentSubject && (
                <div
                  className="text-xs font-semibold px-2.5 py-0.5 rounded-full inline-block mt-1"
                  style={{
                    backgroundColor: `${currentSubject.color}15`,
                    color: currentSubject.color,
                  }}
                >
                  {currentSubject.name}
                </div>
              )}

              <span className="text-[11px] text-slate-500 font-mono pt-1">
                Session {completedSessionsCount + 1} • {completedSessionsCount} Cooked Today 🔥
              </span>
            </div>
          </div>

          {/* Timer Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleResetRequest}
              className="p-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-all hover:scale-105 active:scale-95"
              title="Reset Timer"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            {isRunning ? (
              <button
                onClick={handlePause}
                className="flex items-center gap-2 px-9 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-white font-display font-extrabold text-base shadow-md transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <Pause className="w-5 h-5 fill-current" />
                <span>Pause</span>
              </button>
            ) : (
              <button
                onClick={handleStart}
                className="flex items-center gap-2 px-10 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-display font-extrabold text-base shadow-[0_8px_25px_rgba(99,102,241,0.4)] transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <Play className="w-5 h-5 fill-white" />
                <span>Lock In Now</span>
              </button>
            )}

            <button
              onClick={handleSkip}
              className="p-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-all hover:scale-105 active:scale-95"
              title="Skip to next session"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>

          {/* Sound & Motivation Footnote */}
          <div className="flex items-center justify-between w-full pt-4 border-t border-slate-100 text-xs text-slate-500">
            <button
              onClick={toggleSound}
              className="flex items-center gap-1.5 hover:text-slate-900 transition-colors"
            >
              {data.settings.soundEnabled ? (
                <>
                  <Volume2 className="w-4 h-4 text-emerald-600" />
                  <span>Audio Chimes: Enabled</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-slate-400" />
                  <span>Audio Chimes: Muted</span>
                </>
              )}
            </button>

            <span className="italic hidden sm:inline text-indigo-600 font-medium">
              "Kyu nhi hori padhai? Bas yeh ek session pura karo!"
            </span>
          </div>
        </div>
      </div>

      {/* Focus History & Stats Card */}
      <div className="design-card p-6 rounded-3xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-display font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-600" />
            <span>Focus Session History</span>
          </h3>
          <span className="text-xs font-mono text-slate-500">
            Total Sessions Logged: {data.focusLogs.length}
          </span>
        </div>

        {data.focusLogs.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">
            No completed focus sessions yet. Start your first session above and cook! 🔥
          </p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {data.focusLogs.slice(0, 8).map((log) => {
              const sub = data.subjects.find((s) => s.id === log.subjectId);
              const logDate = new Date(log.startTime).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-xs" />
                    {sub && (
                      <span
                        className="font-bold text-[10px] px-2 py-0.5 rounded-md"
                        style={{ backgroundColor: `${sub.color}15`, color: sub.color }}
                      >
                        {sub.code}
                      </span>
                    )}
                    <span className="text-slate-800 font-semibold">
                      {log.durationMinutes} Minutes Focus
                    </span>
                  </div>

                  <div className="flex items-center gap-3 font-mono text-slate-500 text-[11px]">
                    <span className="text-indigo-600 font-bold">+{log.xpEarned} XP</span>
                    <span>{logDate}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border-2 border-black rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center font-sans">
            <h3 className="text-lg font-black text-black">Reset Timer? Major Aura Loss 💀</h3>
            <p className="text-xs text-neutral-600 leading-relaxed font-sans">
              Resetting now is textbook LARPing. You'll lose -2,000 Aura and your academic comeback arc will stall. Sure you wanna give up?
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-5 py-2.5 rounded-xl bg-black text-white text-xs font-bold shadow-sm hover:scale-105 active:scale-95 transition-all"
              >
                Nah, I'm Locking In 🗿
              </button>
              <button
                onClick={executeReset}
                className="px-4 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold border border-neutral-300"
              >
                I'm Cooked (Reset)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Post-Session Reflection Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white border-2 border-black rounded-3xl p-6 max-w-md w-full space-y-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center animate-in zoom-in-95 font-sans">
            <div className="w-14 h-14 mx-auto rounded-full bg-black text-white flex items-center justify-center text-xl shadow-md">
              🔥
            </div>
            <h3 className="text-2xl font-black text-black">Bro Cooked! +5,000 Aura 🗿🔥</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Focus block crushed with zero cap. Did you actually finish your target task or was it pure LARP:
            </p>
            <div className="p-3.5 rounded-2xl bg-neutral-100 border border-neutral-300 text-xs font-bold text-black font-mono">
              {data.tasks.find((t) => t.id === selectedTaskId)?.title || 'Selected Study Task'}
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setShowCompletionModal(false)}
                className="px-4 py-2.5 rounded-xl bg-neutral-100 text-neutral-700 text-xs font-semibold hover:bg-neutral-200 border border-neutral-300"
              >
                Still Cooking (Not yet)
              </button>
              <button
                onClick={() => {
                  toggleTaskComplete(selectedTaskId);
                  setShowCompletionModal(false);
                }}
                className="px-6 py-2.5 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-all"
              >
                Task Demolished! 🎯
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
