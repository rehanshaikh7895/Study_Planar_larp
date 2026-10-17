import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { ScheduledSession } from '../../types';
import { triggerEmojiBurst } from '../../utils/emojiPop';
import {
  Sparkles,
  Clock,
  Lock,
  Unlock,
  CheckCircle2,
  Trash2,
  Sliders,
  AlertTriangle,
  RotateCcw,
  Info,
  Layers,
  ArrowRight,
  Flame,
} from 'lucide-react';

export const SchedulerView: React.FC = () => {
  const {
    data,
    runScheduler,
    toggleLockSession,
    updateSessionStatus,
    deleteSession,
    clearSchedule,
    updatePreferences,
    setActiveTab,
  } = useApp();

  const [selectedDayFilter, setSelectedDayFilter] = useState<string>('all');
  const [warnings, setWarnings] = useState<string[]>([]);
  const [selectedSessionForInfo, setSelectedSessionForInfo] = useState<ScheduledSession | null>(null);
  const [isEditingPreferences, setIsEditingPreferences] = useState(false);

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

  const handleGenerate = (e?: React.MouseEvent) => {
    const warns = runScheduler(7);
    setWarnings(warns);
    if (e) triggerEmojiBurst(e);
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

  const handleStatusToggle = (e: React.MouseEvent, session: ScheduledSession) => {
    const nextStatus = session.status === 'completed' ? 'upcoming' : 'completed';
    updateSessionStatus(session.id, nextStatus);
    if (nextStatus === 'completed') {
      triggerEmojiBurst(e);
    }
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
                FOCUS 2 OF 4: SMART SCHEDULE
              </span>
              <span className="text-xs">⚡</span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-white leading-snug">
              "Schedule generate ho gaya? Very nice. Ab schedule dekh kar mutthi band karke baith mat jaana, go to 'Track & Focus' sprint! 🗿🔥"
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('focus')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-black font-bold text-xs hover:bg-neutral-200 transition-all shrink-0 hover:scale-105 active:scale-95 shadow-md"
        >
          <span>Next: Track & Focus</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Header & Main Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-neutral-200 shadow-xs">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-black flex items-center gap-2">
            <span>Automated Study Calendar</span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-800 font-mono font-bold border border-neutral-200">
              {data.scheduledSessions.length} Blocks
            </span>
          </h1>
          <p className="text-xs text-neutral-500 mt-1 max-w-2xl">
            Calculated algorithmically based on your exam dates, confidence deficits, and daily study capacity. No guesswork, zero cramming.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsEditingPreferences(!isEditingPreferences)}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold transition-all"
          >
            <Sliders className="w-4 h-4 text-neutral-600" />
            <span>Preferences</span>
          </button>

          <button
            onClick={clearSchedule}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-neutral-100 hover:bg-rose-50 text-neutral-600 hover:text-rose-600 text-xs font-semibold transition-all"
            title="Reset unlocked sessions"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Unlocked</span>
          </button>

          <button
            onClick={(e) => handleGenerate(e)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-black hover:bg-neutral-800 text-white font-bold text-xs shadow-md transition-all hover:scale-105 active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate / Rebalance Plan 🔥</span>
          </button>
        </div>
      </div>

      {/* Warnings & Notices */}
      {warnings.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs space-y-1">
          <div className="flex items-center gap-2 font-bold text-amber-900">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Workload Capacity Notice</span>
          </div>
          {warnings.map((w, idx) => (
            <p key={idx} className="leading-relaxed pl-6">
              {w}
            </p>
          ))}
        </div>
      )}

      {/* Preferences Drawer */}
      {isEditingPreferences && (
        <div className="p-6 rounded-3xl bg-white border border-neutral-300 shadow-xl space-y-5 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <h3 className="text-sm font-black text-black flex items-center gap-2">
              <Sliders className="w-4 h-4 text-black" />
              <span>Study Pace Constraints & Preferences</span>
            </h3>
            <span className="text-xs text-neutral-500">How many hours and breaks you prefer daily</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                Daily Study Target (Mins)
              </label>
              <input
                type="number"
                min="30"
                max="600"
                step="15"
                value={dailyTargetInput}
                onChange={(e) => setDailyTargetInput(Number(e.target.value))}
                className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-xs text-black focus:outline-none focus:border-black font-sans"
              />
              <span className="text-[10px] text-neutral-500 mt-1 block">
                {(dailyTargetInput / 60).toFixed(1)} hours/day max
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                Preferred Study Slot
              </label>
              <select
                value={preferredTimeInput}
                onChange={(e) =>
                  setPreferredTimeInput(
                    e.target.value as 'morning' | 'afternoon' | 'evening' | 'night' | 'flexible'
                  )
                }
                className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-xs text-black focus:outline-none focus:border-black font-sans"
              >
                <option value="morning">Morning (From 9:00 AM)</option>
                <option value="afternoon">Afternoon (From 2:00 PM)</option>
                <option value="evening">Evening (From 6:00 PM)</option>
                <option value="night">Night Owl (From 8:00 PM)</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                Max Session Duration
              </label>
              <select
                value={sessionDurationInput}
                onChange={(e) => setSessionDurationInput(Number(e.target.value))}
                className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-xs text-black focus:outline-none focus:border-black font-sans"
              >
                <option value={30}>30 Minutes</option>
                <option value={45}>45 Minutes (Optimal)</option>
                <option value={60}>60 Minutes</option>
                <option value={90}>90 Minutes</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                Break Between Blocks
              </label>
              <select
                value={breakDurationInput}
                onChange={(e) => setBreakDurationInput(Number(e.target.value))}
                className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-xs text-black focus:outline-none focus:border-black font-sans"
              >
                <option value={5}>5 Minutes</option>
                <option value={10}>10 Minutes</option>
                <option value={15}>15 Minutes</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100">
            <button
              onClick={() => setIsEditingPreferences(false)}
              className="px-4 py-2 rounded-xl bg-neutral-100 text-neutral-700 text-xs font-bold hover:bg-neutral-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSavePreferences}
              className="px-5 py-2 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-bold shadow-md"
            >
              Save & Recalculate
            </button>
          </div>
        </div>
      )}

      {/* Date Filter Tabs & Plan Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-4">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
          <button
            onClick={() => setSelectedDayFilter('all')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedDayFilter === 'all'
                ? 'bg-black text-white shadow-xs'
                : 'bg-white text-neutral-600 hover:text-black border border-neutral-200'
            }`}
          >
            All Sessions ({data.scheduledSessions.length})
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
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-black text-white shadow-xs'
                    : 'bg-white text-neutral-600 hover:text-black border border-neutral-200'
                }`}
              >
                {isToday ? 'Today' : dayLabel} ({sessionsByDate[dateStr]?.length || 0})
              </button>
            );
          })}
        </div>

        <div className="text-xs text-neutral-600 font-mono flex items-center gap-2 shrink-0">
          <Clock className="w-3.5 h-3.5 text-black" />
          <span>
            {Math.round(totalPlannedMinutes / 60)}h {totalPlannedMinutes % 60}m planned
          </span>
        </div>
      </div>

      {/* Sessions Grid */}
      {filteredSessions.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white border-2 border-dashed border-neutral-300 text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-neutral-100 flex items-center justify-center text-black font-bold text-2xl">
            📅
          </div>
          <h3 className="text-base font-black text-black">No sessions scheduled on this calendar</h3>
          <p className="text-xs text-neutral-500 max-w-md mx-auto leading-relaxed">
            Click the button below to have the scheduler distribute your syllabus topics across the upcoming days automatically.
          </p>
          <button
            onClick={(e) => handleGenerate(e)}
            className="px-6 py-3 rounded-2xl bg-black hover:bg-neutral-800 text-white font-bold text-xs shadow-md hover:scale-105 active:scale-95 transition-all"
          >
            Generate Real Study Plan 🔥
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
                className={`p-5 rounded-3xl border transition-all flex flex-col justify-between group ${
                  isCompleted
                    ? 'bg-neutral-50 border-neutral-200 opacity-70'
                    : session.isLocked
                    ? 'bg-amber-50/40 border-amber-300'
                    : 'bg-white border-neutral-200 hover:border-neutral-300 shadow-xs hover:shadow-md'
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
                      <span className="text-[11px] font-mono text-neutral-500 font-semibold">{session.date}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleLockSession(session.id)}
                        className={`p-1.5 rounded-lg text-xs transition-colors ${
                          session.isLocked
                            ? 'bg-amber-100 text-amber-800 font-bold'
                            : 'text-neutral-400 hover:text-black'
                        }`}
                        title={session.isLocked ? 'Locked (won’t move)' : 'Lock session slot'}
                      >
                        {session.isLocked ? (
                          <Lock className="w-3.5 h-3.5" />
                        ) : (
                          <Unlock className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <button
                        onClick={() => deleteSession(session.id)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 transition-colors"
                        title="Delete session"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h4
                    className={`text-sm font-bold mb-2 ${
                      isCompleted ? 'line-through text-neutral-400' : 'text-black'
                    }`}
                  >
                    {session.topicName}
                  </h4>

                  <div className="flex items-center gap-2 text-xs font-mono text-neutral-600 mb-3">
                    <Clock className="w-3.5 h-3.5 text-black" />
                    <span>
                      {session.startTime} - {session.endTime}
                    </span>
                    <span className="text-neutral-300">•</span>
                    <span className="text-neutral-500">{session.durationMinutes}m</span>
                  </div>

                  <button
                    onClick={() => setSelectedSessionForInfo(session)}
                    className="w-full flex items-center justify-between p-2 rounded-xl bg-neutral-50 border border-neutral-200 hover:border-neutral-300 text-[11px] text-neutral-700 transition-colors mb-3"
                  >
                    <span className="flex items-center gap-1.5 font-sans">
                      <Layers className="w-3.5 h-3.5 text-black" />
                      <span>Priority Rank:</span>
                      <span className="font-mono font-bold text-black">
                        {session.priorityScore} pts
                      </span>
                    </span>
                    <Info className="w-3.5 h-3.5 text-neutral-400" />
                  </button>
                </div>

                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setActiveTab('focus')}
                    className="flex items-center gap-1 text-xs text-neutral-600 hover:text-black font-bold transition-colors"
                  >
                    <Flame className="w-3.5 h-3.5 text-rose-500" />
                    <span>Focus Timer</span>
                  </button>

                  <button
                    onClick={(e) => handleStatusToggle(e, session)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isCompleted
                        ? 'bg-neutral-200 text-neutral-700'
                        : 'bg-black text-white hover:bg-neutral-800'
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

      {/* Next Step Action Box */}
      <div className="p-6 rounded-3xl bg-neutral-100 border border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-black text-black">Ready for Focus Step 3?</h4>
          <p className="text-xs text-neutral-600 mt-0.5">
            Hop into the Focus Timer & Checklist to check off completed topics and blast through 25-minute sprints.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('focus')}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-black hover:bg-neutral-800 text-white font-bold text-xs shadow-md transition-all hover:scale-105 active:scale-95 shrink-0"
        >
          <span>Start Focus Sprint & Checklist</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Priority Breakdown Modal */}
      {selectedSessionForInfo && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-neutral-200 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="text-sm font-black text-black flex items-center gap-2">
                <Info className="w-4 h-4 text-black" />
                <span>Deterministic Priority Rationale</span>
              </h3>
              <button
                onClick={() => setSelectedSessionForInfo(null)}
                className="w-7 h-7 rounded-full bg-neutral-100 text-neutral-500 hover:text-black flex items-center justify-center font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="font-bold text-neutral-500 block">Topic:</span>
                <span className="text-black font-semibold">{selectedSessionForInfo.topicName}</span>
              </div>

              <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-neutral-500 font-medium">Composite Priority Score:</span>
                  <span className="font-mono font-black text-black">
                    {selectedSessionForInfo.priorityScore} pts
                  </span>
                </div>
                <p className="text-[11px] text-neutral-600 leading-relaxed font-sans">
                  {selectedSessionForInfo.priorityReasons?.join(' • ') ||
                    'Calculated from topic difficulty, user confidence deficit, and upcoming exam proximity.'}
                </p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-1">
                <span>Date: {selectedSessionForInfo.date}</span>
                <span>
                  {selectedSessionForInfo.startTime} - {selectedSessionForInfo.endTime}
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedSessionForInfo(null)}
                className="px-4 py-2 rounded-xl bg-black text-white text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
