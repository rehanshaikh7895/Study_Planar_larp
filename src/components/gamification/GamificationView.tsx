import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { calculateAnalytics } from '../../utils/analytics';
import { triggerConfetti } from '../../utils/confetti';
import { playSound } from '../../utils/audio';
import {
  Trophy,
  Flame,
  Sparkles,
  Award,
  CheckCircle2,
  Target,
  X,
} from 'lucide-react';

export const GamificationView: React.FC = () => {
  const { data, addXP } = useApp();
  const [showRecapModal, setShowRecapModal] = useState(false);
  const analytics = calculateAnalytics(data);

  const xpPercentage = Math.min(
    100,
    Math.round((data.profile.currentXP / data.profile.targetXP) * 100)
  );

  const handleClaimQuest = (_questId: string, xpReward: number) => {
    playSound('badge', data.settings.soundEnabled);
    triggerConfetti('standard');
    addXP(xpReward, 'Daily Quest Reward Claimed');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-600 uppercase tracking-widest mb-1">
            <Trophy className="w-3.5 h-3.5" />
            <span>Academic Weapon Mastery</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900">
            Level Progression & Quests
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Productivity is an RPG. Earn XP for every 25m locked in, complete daily challenges, and
            ascend the ranks.
          </p>
        </div>

        <button
          onClick={() => {
            setShowRecapModal(true);
            playSound('badge', data.settings.soundEnabled);
            triggerConfetti('level_up');
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-xs shadow-md transition-all self-start sm:self-auto hover:scale-105"
        >
          <Sparkles className="w-4 h-4" />
          <span>Weekly Academic Recap 🎧</span>
        </button>
      </div>

      {/* Main Level & Streak Card (Design-card white background) */}
      <div className="p-8 rounded-3xl bg-white border border-indigo-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-indigo-100/60 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-600 to-pink-600 flex items-center justify-center text-4xl shadow-md border border-white">
              {data.profile.avatar}
            </div>

            <div className="space-y-1">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600">
                Rank Level {data.profile.level}
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900">
                {data.profile.rankTitle}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Scholar Profile: <span className="text-slate-900 font-bold">{data.profile.name}</span>
              </p>
            </div>
          </div>

          {/* Streak Counter */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="p-3 rounded-xl bg-amber-50 text-amber-500">
              <Flame className="w-6 h-6 fill-amber-500 animate-bounce" />
            </div>
            <div>
              <span className="text-2xl font-display font-extrabold text-slate-900">
                {data.profile.streakDays} Days
              </span>
              <p className="text-[11px] text-slate-500 font-mono">
                Personal record: {data.profile.longestStreak} days
              </p>
            </div>
          </div>
        </div>

        {/* Level XP Progress Bar */}
        <div className="mt-8 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-700 font-semibold">Progress to Level {data.profile.level + 1}</span>
            <span className="font-mono font-bold text-indigo-600">
              {data.profile.currentXP} / {data.profile.targetXP} XP ({xpPercentage}%)
            </span>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-3.5 p-0.5 overflow-hidden border border-slate-200">
            <div
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-full rounded-full transition-all duration-700 shadow-xs"
              style={{ width: `${xpPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Quests Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-display font-bold text-slate-900 flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-600" />
            <span>Daily & Weekly Academic Quests</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">Resets daily at 00:00</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.quests.map((quest) => {
            const isCompleted = quest.isCompleted || quest.currentCount >= quest.targetCount;
            const pct = Math.min(100, Math.round((quest.currentCount / quest.targetCount) * 100));

            return (
              <div
                key={quest.id}
                className={`p-5 rounded-3xl border transition-all flex flex-col justify-between design-card ${
                  isCompleted
                    ? 'bg-emerald-50/50 border-emerald-200'
                    : 'bg-white border-slate-200/90'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                      +{quest.xpReward} XP
                    </span>
                    {isCompleted && (
                      <span className="text-emerald-600 text-xs font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Ready
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-semibold text-slate-900 mb-1">{quest.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">{quest.description}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                    <span>Progress:</span>
                    <span>
                      {quest.currentCount} / {quest.targetCount}
                    </span>
                  </div>

                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isCompleted ? 'bg-emerald-500' : 'bg-indigo-600'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  {isCompleted && (
                    <button
                      onClick={() => handleClaimQuest(quest.id, quest.xpReward)}
                      className="w-full mt-2 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all"
                    >
                      Claim +{quest.xpReward} XP 🔥
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievement Badges Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-display font-bold text-slate-900 flex items-center gap-2">
          <Award className="w-4 h-4 text-purple-600" />
          <span>Hall of Achievements</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.achievements.map((badge) => {
            const isUnlocked = badge.progress >= 100 || badge.unlockedAt;

            return (
              <div
                key={badge.id}
                className={`p-5 rounded-3xl border transition-all flex items-start gap-4 design-card ${
                  isUnlocked
                    ? 'bg-white border-indigo-200 shadow-sm'
                    : 'bg-slate-50/70 border-slate-200 opacity-60'
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${
                    isUnlocked
                      ? 'bg-indigo-50 border border-indigo-200'
                      : 'bg-slate-200 text-slate-400 grayscale'
                  }`}
                >
                  {badge.badge}
                </div>

                <div className="space-y-1 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <h4
                      className={`text-sm font-semibold truncate ${
                        isUnlocked ? 'text-slate-900' : 'text-slate-500'
                      }`}
                    >
                      {badge.title}
                    </h4>
                    <span className="text-[10px] font-mono text-indigo-600 font-bold shrink-0">
                      +{badge.xp} XP
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 leading-snug">{badge.description}</p>

                  <div className="pt-2">
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          isUnlocked ? 'bg-indigo-600' : 'bg-slate-300'
                        }`}
                        style={{ width: `${Math.min(100, badge.progress)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Spotify Wrapped Style Weekly Recap Modal */}
      {showRecapModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white border border-pink-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl relative overflow-hidden animate-in zoom-in-95">
            <div className="absolute top-0 right-0 w-64 h-64 bg-pink-100/50 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-100/50 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎧</span>
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-pink-600">
                  PadhloShawtys Wrapped • Weekly Academic Arc
                </span>
              </div>
              <button
                onClick={() => setShowRecapModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900">
                You Were In Your Flow State.
              </h3>
              <p className="text-xs text-slate-500">
                Here's your true performance over the last 7 days.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-xs text-slate-500 uppercase font-semibold">Total Focus Time</span>
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                  {(analytics.weeklyActualMinutes / 60).toFixed(1)} hrs
                </p>
                <span className="text-[10px] text-pink-600 font-mono font-bold">
                  {analytics.weeklyActualMinutes} verified minutes
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-xs text-slate-500 uppercase font-semibold">Tasks Crushed</span>
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                  {analytics.completedTasksCount}
                </p>
                <span className="text-[10px] text-emerald-600 font-mono font-bold">
                  {analytics.taskCompletionRate}% completion rate
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-xs text-slate-500 uppercase font-semibold">Top Subject</span>
                <p className="text-base sm:text-lg font-bold text-slate-900 mt-1 truncate">
                  {analytics.subjectStats[0]?.name || 'All Subjects'}
                </p>
                <span className="text-[10px] text-indigo-600 font-mono font-bold">
                  {analytics.subjectStats[0]?.percentage || 0}% of study time
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-xs text-slate-500 uppercase font-semibold">Peak Power Day</span>
                <p className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                  {analytics.mostProductiveDay}
                </p>
                <span className="text-[10px] text-amber-600 font-mono font-bold">
                  {data.profile.streakDays}-day streak maintained
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 text-center italic font-medium">
              "Kyu nhi hori padhai? Consistency is compounding interest for the brain. Keep cooking." 🔥
            </p>

            <button
              onClick={() => {
                setShowRecapModal(false);
              }}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md"
            >
              Continue Academic Comeback
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
