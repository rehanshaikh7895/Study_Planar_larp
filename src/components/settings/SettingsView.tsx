import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  User,
  Sliders,
  Volume2,
  VolumeX,
  Sparkles,
  Download,
  Upload,
  RotateCcw,
  Plus,
  Trash2,
  Palette,
  Moon,
  Sun,
  ShieldAlert,
} from 'lucide-react';

const AVATAR_OPTIONS = ['⚡', '🔥', '🧠', '🚀', '🎯', '👑', '👾', '🐺', '💻', '🪐'];
const THEME_OPTIONS = [
  { id: 'light', label: 'Clean White (Default)', icon: <Sun className="w-4 h-4" /> },
  { id: 'dark', label: 'Dark Midnight', icon: <Moon className="w-4 h-4" /> },
];

export const SettingsView: React.FC = () => {
  const {
    data,
    updateProfile,
    updateSettings,
    addSubject,
    deleteSubject,
    loadDemoMode,
    resetAllData,
    exportJSON,
    importJSON,
  } = useApp();

  const [name, setName] = useState(data.profile.name);
  const [avatar, setAvatar] = useState(data.profile.avatar);
  const [dailyGoal, setDailyGoal] = useState(data.profile.dailyGoalMinutes);

  const [pomodoroFocus, setPomodoroFocus] = useState(data.settings.pomodoroFocusMinutes);
  const [pomodoroShort, setPomodoroShort] = useState(data.settings.pomodoroShortBreakMinutes);
  const [pomodoroLong, setPomodoroLong] = useState(data.settings.pomodoroLongBreakMinutes);

  const [isAddingSubject, setIsAddingSubject] = useState(false);
  const [newSubName, setNewSubName] = useState('');
  const [newSubCode, setNewSubCode] = useState('');
  const [newSubColor, setNewSubColor] = useState('#6366F1');

  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleSaveProfile = () => {
    updateProfile({
      name: name.trim() || data.profile.name,
      avatar,
      dailyGoalMinutes: Number(dailyGoal) || 120,
    });
  };

  const handleSavePomodoro = () => {
    updateSettings({
      pomodoroFocusMinutes: Number(pomodoroFocus),
      pomodoroShortBreakMinutes: Number(pomodoroShort),
      pomodoroLongBreakMinutes: Number(pomodoroLong),
    });
  };

  const handleAddSubjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubName.trim() || !newSubCode.trim()) return;

    addSubject({
      name: newSubName.trim(),
      code: newSubCode.trim().toUpperCase(),
      color: newSubColor,
    });

    setNewSubName('');
    setNewSubCode('');
    setIsAddingSubject(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      importJSON(file);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-4xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm">
        <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 flex items-center gap-2">
          <Settings className="w-6 h-6 text-indigo-600" />
          <span>Personalization & Settings</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Customize your scholar identity, Pomodoro pacing, theme, subjects, and data backups on
          PadhloShawtys.
        </p>
      </div>

      {/* 1. Scholar Identity */}
      <div className="design-card p-6 rounded-3xl space-y-5">
        <h3 className="text-sm font-display font-bold text-slate-900 flex items-center gap-2">
          <User className="w-4 h-4 text-indigo-600" />
          <span>Student Profile & Avatar</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Student Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Daily Study Goal (Minutes)
            </label>
            <input
              type="number"
              min="30"
              max="600"
              step="15"
              value={dailyGoal}
              onChange={(e) => setDailyGoal(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">Pick Avatar Badge</label>
          <div className="flex flex-wrap gap-2">
            {AVATAR_OPTIONS.map((av) => (
              <button
                key={av}
                type="button"
                onClick={() => setAvatar(av)}
                className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${
                  avatar === av
                    ? 'bg-indigo-600 text-white shadow-md scale-110 border border-indigo-400'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                {av}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSaveProfile}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all"
        >
          Save Profile Details
        </button>
      </div>

      {/* 2. Theme & Sound */}
      <div className="design-card p-6 rounded-3xl space-y-5">
        <h3 className="text-sm font-display font-bold text-slate-900 flex items-center gap-2">
          <Palette className="w-4 h-4 text-cyan-600" />
          <span>Theme & Sensory Experience</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">Color Theme</label>
            <div className="flex gap-2">
              {THEME_OPTIONS.map((th) => (
                <button
                  key={th.id}
                  onClick={() => updateSettings({ theme: th.id as 'dark' | 'light' })}
                  className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-semibold transition-all ${
                    data.settings.theme === th.id
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-700 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {th.icon}
                  <span>{th.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">Web Audio Synthesizer</label>
            <button
              onClick={() => updateSettings({ soundEnabled: !data.settings.soundEnabled })}
              className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition-all ${
                data.settings.soundEnabled
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-slate-50 border-slate-200 text-slate-500'
              }`}
            >
              <div className="flex items-center gap-2">
                {data.settings.soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <VolumeX className="w-4 h-4 text-slate-400" />
                )}
                <span>Sound Chimes (Level up, Timer chime, Complete)</span>
              </div>
              <span className="font-mono font-bold">{data.settings.soundEnabled ? 'ON' : 'MUTED'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Pomodoro Durations */}
      <div className="design-card p-6 rounded-3xl space-y-4">
        <h3 className="text-sm font-display font-bold text-slate-900 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-pink-600" />
          <span>Pomodoro Timer Preferences</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Focus Duration (Minutes)
            </label>
            <input
              type="number"
              min="10"
              max="90"
              value={pomodoroFocus}
              onChange={(e) => setPomodoroFocus(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Short Break (Minutes)
            </label>
            <input
              type="number"
              min="2"
              max="20"
              value={pomodoroShort}
              onChange={(e) => setPomodoroShort(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Long Break (Minutes)
            </label>
            <input
              type="number"
              min="10"
              max="60"
              value={pomodoroLong}
              onChange={(e) => setPomodoroLong(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
            />
          </div>
        </div>

        <button
          onClick={handleSavePomodoro}
          className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs shadow-md transition-all"
        >
          Save Timer Durations
        </button>
      </div>

      {/* 4. Subject Manager */}
      <div className="design-card p-6 rounded-3xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-display font-bold text-slate-900 flex items-center gap-2">
            <span>Enrolled Subjects & Color Coding</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono font-bold">
              {data.subjects.length}
            </span>
          </h3>

          <button
            onClick={() => setIsAddingSubject(!isAddingSubject)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-semibold transition-all border border-indigo-200"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Subject</span>
          </button>
        </div>

        {isAddingSubject && (
          <form
            onSubmit={handleAddSubjectSubmit}
            className="p-4 rounded-2xl bg-slate-50 border border-indigo-200 space-y-3"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-slate-700 mb-1">Subject Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Linear Algebra"
                  value={newSubName}
                  onChange={(e) => setNewSubName(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-700 mb-1">Course Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MATH-220"
                  value={newSubCode}
                  onChange={(e) => setNewSubCode(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-700 mb-1">Accent Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={newSubColor}
                    onChange={(e) => setNewSubColor(e.target.value)}
                    className="w-9 h-9 rounded-xl bg-transparent border-0 cursor-pointer"
                  />
                  <span className="text-xs font-mono text-slate-600">{newSubColor}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingSubject(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-200 text-slate-700 text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
              >
                Add Subject
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {data.subjects.map((sub) => (
            <div
              key={sub.id}
              className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs"
                  style={{ backgroundColor: sub.color }}
                />
                <div>
                  <span className="font-bold text-slate-900 block">{sub.code}</span>
                  <span className="text-slate-500 text-[11px]">{sub.name}</span>
                </div>
              </div>

              {data.subjects.length > 1 && (
                <button
                  onClick={() => deleteSubject(sub.id)}
                  className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                  title="Remove subject"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 5. Data Persistence & Backup */}
      <div className="design-card p-6 rounded-3xl space-y-4">
        <h3 className="text-sm font-display font-bold text-slate-900 flex items-center gap-2">
          <Download className="w-4 h-4 text-emerald-600" />
          <span>Local Storage & Backup Management</span>
        </h3>
        <p className="text-xs text-slate-500">
          All your tasks, logs, exams, and scheduler sessions survive refreshes in localStorage.
          You can export or import your complete backup at any time.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          <button
            onClick={loadDemoMode}
            className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 text-xs font-bold transition-all shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Load Demo Data</span>
          </button>

          <button
            onClick={exportJSON}
            className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold transition-all shadow-xs"
          >
            <Download className="w-4 h-4 text-purple-600" />
            <span>Export JSON</span>
          </button>

          <label className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold cursor-pointer transition-all shadow-xs">
            <Upload className="w-4 h-4 text-cyan-600" />
            <span>Import JSON</span>
            <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
          </label>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold transition-all shadow-xs"
          >
            <RotateCcw className="w-4 h-4 text-rose-600" />
            <span>Factory Reset</span>
          </button>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-rose-200 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Reset All Workspace Data?</h3>
            <p className="text-xs text-slate-500">
              This will restore initial clean settings and remove all tasks, exams, and logs. This
              action cannot be undone unless you export a backup first.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetAllData();
                  setShowResetConfirm(false);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
