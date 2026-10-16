import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { ScheduledSession } from '../../types';
import {
  Sparkles,
  Calendar,
  Clock,
  Lock,
  Unlock,
  CheckCircle2,
  Trash2,
  Sliders,
  AlertTriangle,
  RotateCcw,
  ChevronRight,
  Info,
  Layers,
} from 'lucide-react';

export const SchedulerView: React.FC = () => {
  const {
    data,
    runScheduler,
    toggleLockSession,
    updateSessionStatus,
    moveSession,
    deleteSession,
    clearSchedule,
    updatePreferences,
  } = useApp();

  const [selectedDayFilter, setSelectedDayFilter] = useState<string>('all');
  const [warnings, setWarnings] = useState<string[]>([]);
  const [selectedSessionForInfo, setSelectedSessionForInfo] = useState<ScheduledSession | null>(null);
  const [isEditingPreferences, setIsEditingPreferences] = useState(false);
  const [reschedulingSessionId, setReschedulingSessionId] = useState<string | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');

  const [dailyTargetInput, setDailyTargetInput] = useState(
    data.schedulerPreferences.dailyStudyTargetMinutes
  );
  const [preferredTimeInput, setPreferredTimeInput] = useState(
    data.schedulerPreferences.preferredTimeOfDay
  );
  const [breakDurationInput, setBreakDurationInput] = useState(
    data.schedulerPreferences.breakDuration
  );
  const [sessionDurationInput, setSessionDurationInput] = useState(
    data.schedulerPreferences.defaultSessionDuration
  );

  const handleGenerate = () => {
    const warns = runScheduler(7);
    setWarnings(warns);
  };

  const handleSavePreferences = () => {
    updatePreferences({
      dailyStudyTargetMinutes: Number(dailyTargetInput),
      preferredTimeOfDay: preferredTimeInput,
      breakDuration: Number(breakDurationInput),
      defaultSessionDuration: Number(sessionDurationInput),
    });
    setIsEditingPreferences(false);
    const warns = runScheduler(7);
    setWarnings(warns);
  };

  const sessionsByDate: Record<string, ScheduledSession[]> = {};
  data.scheduledSessions.forEach((s) => {
    if (!sessionsByDate[s.date]) {
      sessionsByDate[s.date] = [];
    }
    sessionsByDate[s.date].push(s);
  });

  const availableDates = Object.keys(sessionsByDate).sort();

  const filteredSessions =
    selectedDayFilter === 'all'
      ? data.scheduledSessions
      : data.scheduledSessions.filter((s) => s.date === selectedDayFilter);

  const totalPlannedMinutes = filteredSessions.reduce((acc, s) => acc + s.durationMinutes, 0);

  const handleRescheduleSubmit = () => {
    if (reschedulingSessionId && rescheduleDate && rescheduleTime) {
      moveSession(reschedulingSessionId, rescheduleDate, rescheduleTime);
      setReschedulingSessionId(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-600 uppercase tracking-widest mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Deterministic Algorithmic Pacing</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900">
            Smart Study Scheduler
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Calculates an optimal study calendar using your real exams, topic difficulty ratings,
            confidence deficits, and daily study capacity. Kyu nhi hori padhai? Ab sab sorted hai!
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsEditingPreferences(!isEditingPreferences)}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all"
          >
            <Sliders className="w-4 h-4 text-slate-500" />
            <span>Preferences</span>
          </button>

          <button
            onClick={clearSchedule}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-xs font-semibold transition-all"
            title="Reset unlocked sessions"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Unlocked</span>
          </button>

          <button
            onClick={handleGenerate}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-xs shadow-md transition-all hover:scale-105 active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate / Rebalance Plan</span>
          </button>
        </div>
      </div>

      {/* Warnings & Notices */}
      {warnings.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs space-y-1">
          <div className="flex items-center gap-2 font-bold text-amber-900">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Workload Capacity Warning</span>
          </div>
          {warnings.map((w, idx) => (
            <p key={idx} className="leading-relaxed pl-6">
              {w}
            </p>
          ))}
        </div>
      )}

      {/* Preferences Drawer / Modal */}
      {isEditingPreferences && (
        <div className="p-6 rounded-3xl bg-white border border-indigo-200 shadow-xl space-y-5 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-display font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-600" />
              <span>Scheduler Constraints & Preferences</span>
            </h3>
            <span className="text-xs text-slate-500">Controls how sessions are distributed</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Daily Study Target (Mins)
              </label>
              <input
                type="number"
                min="30"
                max="600"
                step="15"
                value={dailyTargetInput}
                onChange={(e) => setDailyTargetInput(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                {(dailyTargetInput / 60).toFixed(1)} hours/day max
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Preferred Study Time
              </label>
              <select
                value={preferredTimeInput}
                onChange={(e) =>
                  setPreferredTimeInput(
                    e.target.value as 'morning' | 'afternoon' | 'evening' | 'night' | 'flexible'
                  )
                }
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
              >
                <option value="morning">Morning (From 9:00 AM)</option>
                <option value="afternoon">Afternoon (From 2:00 PM)</option>
                <option value="evening">Evening (From 6:00 PM)</option>
                <option value="night">Night Owl (From 8:00 PM)</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Max Session Duration
              </label>
              <select
                value={sessionDurationInput}
                onChange={(e) => setSessionDurationInput(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
              >
                <option value={30}>30 Minutes</option>
                <option value={45}>45 Minutes (Optimal)</option>
                <option value={60}>60 Minutes</option>
                <option value={90}>90 Minutes</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Break Between Blocks
              </label>
              <select
                value={breakDurationInput}
                onChange={(e) => setBreakDurationInput(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
              >
                <option value={5}>5 Minutes</option>
                <option value={10}>10 Minutes</option>
                <option value={15}>15 Minutes</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setIsEditingPreferences(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSavePreferences}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
            >
              Save & Recalculate
            </button>
          </div>
        </div>
      )}

      {/* Date Filter Tabs & Plan Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
          <button
            onClick={() => setSelectedDayFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedDayFilter === 'all'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            All Plan ({data.scheduledSessions.length})
          </button>

          {availableDates.map((dateStr) => {
            const d = new Date(dateStr + 'T00:00:00');
            const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' });
            const isToday = dateStr === new Date().toISOString().split('T')[0];
            const isSelected = selectedDayFilter === dateStr;

            return (
              <button
                key={dateStr}
                onClick={() => setSelectedDayFilter(dateStr)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                {isToday ? 'Today' : dayLabel} ({sessionsByDate[dateStr]?.length || 0})
              </button>
            );
          })}
        </div>

        <div className="text-xs text-slate-600 font-mono flex items-center gap-2 shrink-0">
          <Clock className="w-3.5 h-3.5 text-indigo-600" />
          <span>
            {Math.round(totalPlannedMinutes / 60)}h {totalPlannedMinutes % 60}m planned
          </span>
        </div>
      </div>

      {/* Session Cards List (Design-card white background) */}
      {filteredSessions.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white border border-dashed border-slate-300 text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Calendar className="w-7 h-7" />
          </div>
          <h3 className="text-base font-semibold text-slate-900">No sessions currently scheduled</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Click "Generate / Rebalance Plan" to evaluate all your pending tasks and upcoming exam
            topics, prioritize them mathematically, and generate a balanced schedule!
          </p>
          <button
            onClick={handleGenerate}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md"
          >
            Generate My Plan
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSessions.map((session) => {
            const subject = data.subjects.find((s) => s.id === session.subjectId);
            const isCompleted = session.status === 'completed';

            return (
              <div
                key={session.id}
                className={`p-5 rounded-3xl border transition-all flex flex-col justify-between group design-card ${
                  isCompleted
                    ? 'bg-slate-50/80 border-slate-200 opacity-70'
                    : session.isLocked
                    ? 'bg-amber-50/30 border-amber-200'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2">
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
                      <span className="text-[11px] font-mono text-slate-500">{session.date}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleLockSession(session.id)}
                        className={`p-1.5 rounded-lg text-xs transition-colors ${
                          session.isLocked
                            ? 'bg-amber-100 text-amber-700'
                            : 'text-slate-400 hover:text-slate-700'
                        }`}
                        title={session.isLocked ? 'Locked (won’t move)' : 'Lock session'}
                      >
                        {session.isLocked ? (
                          <Lock className="w-3.5 h-3.5" />
                        ) : (
                          <Unlock className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <button
                        onClick={() => deleteSession(session.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition-colors"
                        title="Delete session"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h4
                    className={`text-sm font-semibold mb-2 ${
                      isCompleted ? 'line-through text-slate-400' : 'text-slate-900'
                    }`}
                  >
                    {session.topicName}
                  </h4>

                  <div className="flex items-center gap-2 text-xs font-mono text-slate-600 mb-3">
                    <Clock className="w-3.5 h-3.5 text-indigo-600" />
                    <span>
                      {session.startTime} - {session.endTime}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500">{session.durationMinutes}m</span>
                  </div>

                  <button
                    onClick={() => setSelectedSessionForInfo(session)}
                    className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-300 text-[11px] text-slate-700 transition-colors mb-3 group/prio"
                  >
                    <span className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Priority Rank:</span>
                      <span className="font-mono font-bold text-indigo-700">
                        {session.priorityScore} pts
                      </span>
                    </span>
                    <Info className="w-3.5 h-3.5 text-slate-400 group-hover/prio:text-indigo-600" />
                  </button>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      setReschedulingSessionId(session.id);
                      setRescheduleDate(session.date);
                      setRescheduleTime(session.startTime);
                    }}
                    className="text-xs text-slate-500 hover:text-indigo-600 font-medium transition-colors"
                  >
                    Reschedule
                  </button>

                  <button
                    onClick={() =>
                      updateSessionStatus(
                        session.id,
                        isCompleted ? 'upcoming' : 'completed'
                      )
                    }
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      isCompleted
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isCompleted ? 'Finished' : 'Mark Done'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Priority Breakdown Modal */}
      {selectedSessionForInfo && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-indigo-200 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-display font-bold text-slate-900 flex items-center gap-2">
                <Info className="w-4 h-4 text-indigo-600" />
                <span>Priority Logic Breakdown</span>
              </h3>
              <button
                onClick={() => setSelectedSessionForInfo(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-indigo-700">
                {selectedSessionForInfo.topicName}
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Calculated Priority Score:{' '}
                <span className="font-mono font-bold text-slate-900">
                  {selectedSessionForInfo.priorityScore}
                </span>{' '}
                pts
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Contributing Algorithmic Factors:
              </span>
              <ul className="space-y-1.5">
                {selectedSessionForInfo.priorityReasons?.map((reason, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-xs text-slate-700 p-2.5 rounded-xl bg-slate-50 border border-slate-200"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-[11px] text-slate-500 italic">
              PadhloShawtys balances your study calendar by prioritizing impending deadlines and
              topics where your confidence is lowest.
            </p>

            <button
              onClick={() => setSelectedSessionForInfo(null)}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
            >
              Got It
            </button>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {reschedulingSessionId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-indigo-200 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="text-sm font-display font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span>Reschedule Study Session</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Date
                </label>
                <input
                  type="date"
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Start Time (HH:mm)
                </label>
                <input
                  type="time"
                  value={rescheduleTime}
                  onChange={(e) => setRescheduleTime(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                />
              </div>
            </div>

            <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200">
              Note: Rescheduling this session will automatically lock it so future regeneration
              won't move it.
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setReschedulingSessionId(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleRescheduleSubmit}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
              >
                Save Time
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
