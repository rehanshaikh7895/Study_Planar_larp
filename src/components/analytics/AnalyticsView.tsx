import React from 'react';
import { useApp } from '../../context/AppContext';
import { calculateAnalytics } from '../../utils/analytics';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ReferenceLine,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  Clock,
  CheckCircle2,
  Calendar,
  Sparkles,
  PieChart as PieIcon,
  Flame,
  Award,
  Zap,
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { data, loadDemoMode } = useApp();
  const analytics = calculateAnalytics(data);

  const weeklyHours = (analytics.weeklyActualMinutes / 60).toFixed(1);
  const plannedWeeklyHours = (analytics.weeklyPlannedMinutes / 60).toFixed(1);

  const PIE_COLORS = ['#6366F1', '#06B6D4', '#EC4899', '#10B981', '#F59E0B', '#3B82F6', '#8B5CF6'];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-600 uppercase tracking-widest mb-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>The Academic Comeback Arc</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900">
            Productivity Analytics & Insights
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real calculated metrics extracted directly from your verified focus timer logs and task
            completions.
          </p>
        </div>

        {analytics.weeklyActualMinutes === 0 && (
          <button
            onClick={loadDemoMode}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold hover:bg-indigo-100 transition-all shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Load Demo Data to Preview Charts</span>
          </button>
        )}
      </div>

      {/* Top High-Level Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="design-card p-5 rounded-3xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Weekly Hours</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-display font-extrabold text-slate-900">{weeklyHours}</span>
            <span className="text-xs text-slate-500">hrs logged</span>
          </div>
          <span className="text-[11px] text-slate-400 block mt-2">
            Target: {plannedWeeklyHours} hrs planned
          </span>
        </div>

        {/* Metric 2 */}
        <div className="design-card p-5 rounded-3xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Task Clearance</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-display font-extrabold text-slate-900">
              {analytics.taskCompletionRate}%
            </span>
            <span className="text-xs text-slate-500">rate</span>
          </div>
          <span className="text-[11px] text-slate-400 block mt-2">
            {analytics.completedTasksCount} of {analytics.totalTasksCount} tasks done
          </span>
        </div>

        {/* Metric 3 */}
        <div className="design-card p-5 rounded-3xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Peak Flow Slot</span>
            <div className="p-2 rounded-xl bg-cyan-50 text-cyan-600">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <span className="text-base sm:text-lg font-bold text-slate-900 block truncate">
            {analytics.mostProductiveSlot}
          </span>
          <span className="text-[11px] text-slate-400 block mt-2">
            Best day: {analytics.mostProductiveDay}
          </span>
        </div>

        {/* Metric 4 */}
        <div className="design-card p-5 rounded-3xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Goal Consistency</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-500">
              <Flame className="w-4 h-4 fill-amber-500" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-display font-extrabold text-slate-900">
              {analytics.daysMetGoalThisWeek} / 7
            </span>
            <span className="text-xs text-slate-500">days</span>
          </div>
          <span className="text-[11px] text-amber-600 font-semibold block mt-2">
            {data.profile.streakDays}-day active streak 🔥
          </span>
        </div>
      </div>

      {/* Dynamic Data-Driven Insights Cards */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border border-indigo-100 space-y-3 shadow-xs">
        <h3 className="text-sm font-display font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>Calculated Momentum Insights</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {analytics.insights.map((insight, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-white border border-slate-200 text-xs text-slate-700 shadow-xs"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 mt-1 shrink-0" />
              <p className="leading-relaxed font-medium">{insight}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart 1: Study Minutes Last 7 Days */}
        <div className="design-card p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-display font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600" />
                <span>Daily Study Minutes (Last 7 Days)</span>
              </h3>
              <p className="text-xs text-slate-500">Dashed line indicates your daily study target</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.last7Days} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="dayName" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#0f172a',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  }}
                />
                <ReferenceLine
                  y={data.profile.dailyGoalMinutes || 120}
                  stroke="#db2777"
                  strokeDasharray="4 4"
                  label={{
                    value: `Goal (${data.profile.dailyGoalMinutes}m)`,
                    fill: '#db2777',
                    fontSize: 10,
                    position: 'insideTopRight',
                  }}
                />
                <Bar name="Actual Focus (Mins)" dataKey="actualMinutes" fill="#6366F1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Planned vs Actual Study Time */}
        <div className="design-card p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-display font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-600" />
                <span>Planned vs. Actual Tracked Minutes</span>
              </h3>
              <p className="text-xs text-slate-500">Comparing scheduled agenda with executed focus</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.last7Days} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="dayName" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#0f172a',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar name="Planned (Mins)" dataKey="plannedMinutes" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                <Bar name="Actual Focus (Mins)" dataKey="actualMinutes" fill="#06B6D4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Time Spent per Subject */}
        <div className="design-card p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-display font-bold text-slate-900 flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-emerald-600" />
                <span>Subject Time Allocation</span>
              </h3>
              <p className="text-xs text-slate-500">Proportional distribution of deep work</p>
            </div>
          </div>

          {analytics.subjectStats.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center text-xs text-slate-400 space-y-2">
              <p>No focus sessions tagged with subjects yet.</p>
              <button
                onClick={loadDemoMode}
                className="text-indigo-600 font-semibold hover:underline"
              >
                Load demo dataset
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="h-56 w-56 mx-auto sm:mx-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics.subjectStats}
                      dataKey="minutes"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={3}
                    >
                      {analytics.subjectStats.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color || PIE_COLORS[index % PIE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        fontSize: '12px',
                        color: '#0f172a',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Subject Breakdown Legend List */}
              <div className="flex-1 space-y-2 w-full text-xs">
                {analytics.subjectStats.map((sub, i) => (
                  <div
                    key={sub.subjectId}
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: sub.color || PIE_COLORS[i % PIE_COLORS.length] }}
                      />
                      <span className="font-semibold text-slate-800">{sub.code}</span>
                      <span className="text-slate-500 truncate max-w-[120px]">{sub.name}</span>
                    </div>
                    <span className="font-mono font-bold text-slate-900">{sub.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Weekly Comeback Summary & Trophy Card */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-50 via-white to-pink-50 border border-indigo-200/80 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-600 uppercase tracking-widest mb-2">
              <Award className="w-4 h-4" />
              <span>Academic Comeback Scorecard</span>
            </div>
            <h3 className="text-xl font-display font-extrabold text-slate-900">
              Level {data.profile.level} • {data.profile.rankTitle}
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Every completed focus session and cleared task boosts your momentum. You are currently
              holding a <strong className="text-amber-600">{data.profile.streakDays}-day streak</strong>{' '}
              with a personal best of{' '}
              <strong className="text-slate-900">{data.profile.longestStreak} days</strong>.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
            <div className="flex justify-between text-xs text-slate-600">
              <span>XP to Next Rank ({data.profile.level + 1}):</span>
              <span className="font-mono font-bold text-indigo-600">
                {data.profile.currentXP} / {data.profile.targetXP} XP
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-pink-500 h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(
                    100,
                    Math.round((data.profile.currentXP / data.profile.targetXP) * 100)
                  )}%`,
                }}
              />
            </div>
          </div>

          <p className="text-[11px] text-slate-500 italic">
            "Kyu nhi hori padhai? Consistency is compounding interest for the brain. Keep cooking."
          </p>
        </div>
      </div>
    </div>
  );
};
