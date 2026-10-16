import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import type { Exam, SyllabusTopic } from '../../types';
import {
  GraduationCap,
  Plus,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Edit2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const ExamsView: React.FC = () => {
  const { data, addExam, updateExam, deleteExam, toggleExamTopicComplete } = useApp();

  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [expandedExamId, setExpandedExamId] = useState<string | null>(data.exams[0]?.id || null);

  // Form state
  const [name, setName] = useState('');
  const [subjectId, setSubjectId] = useState(data.subjects[0]?.id || '');
  const [examDate, setExamDate] = useState(
    new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
  );
  const [examTime, setExamTime] = useState('09:00');
  const [targetGrade, setTargetGrade] = useState('A');
  const [weightPercent, setWeightPercent] = useState(35);
  const [topics, setTopics] = useState<
    Array<{ name: string; difficulty: 1 | 2 | 3 | 4 | 5; confidence: 1 | 2 | 3 | 4 | 5; estimatedHours: number }>
  >([
    { name: 'Core Foundations & Fundamentals', difficulty: 3, confidence: 3, estimatedHours: 3 },
    { name: 'Advanced Problem Solving & Applications', difficulty: 4, confidence: 2, estimatedHours: 4 },
  ]);

  // Live countdown ticker
  const [currentTime, setCurrentTime] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getCountdown = (dateStr: string, timeStr?: string) => {
    const target = new Date(`${dateStr}T${timeStr || '09:00'}:00`).getTime();
    const diff = target - currentTime;

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isPassed: true };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds, isPassed: false };
  };

  const handleAddTopicRow = () => {
    setTopics((prev) => [
      ...prev,
      { name: '', difficulty: 3, confidence: 3, estimatedHours: 2 },
    ]);
  };

  const handleRemoveTopicRow = (idx: number) => {
    setTopics((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleTopicChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    setTopics((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const formattedTopics: SyllabusTopic[] = topics
      .filter((t) => t.name.trim())
      .map((t, idx) => ({
        id: `topic-${Date.now()}-${idx}`,
        name: t.name.trim(),
        difficulty: t.difficulty,
        confidence: t.confidence,
        estimatedHours: Number(t.estimatedHours) || 2,
        isCompleted: false,
      }));

    if (editingExam) {
      updateExam({
        ...editingExam,
        name: name.trim(),
        subjectId,
        examDate,
        examTime,
        targetGrade,
        weightPercent: Number(weightPercent),
        topics: formattedTopics.length > 0 ? formattedTopics : editingExam.topics,
      });
      setEditingExam(null);
    } else {
      addExam({
        name: name.trim(),
        subjectId,
        examDate,
        examTime,
        targetGrade,
        weightPercent: Number(weightPercent),
        topics: formattedTopics,
      });
      setIsOpenAddModal(false);
    }

    // Reset form
    setName('');
    setTopics([
      { name: 'Core Foundations & Fundamentals', difficulty: 3, confidence: 3, estimatedHours: 3 },
    ]);
  };

  const handleOpenEdit = (exam: Exam) => {
    setEditingExam(exam);
    setName(exam.name);
    setSubjectId(exam.subjectId);
    setExamDate(exam.examDate);
    setExamTime(exam.examTime || '09:00');
    setTargetGrade(exam.targetGrade || 'A');
    setWeightPercent(exam.weightPercent || 30);
    setTopics(
      exam.topics.map((t) => ({
        name: t.name,
        difficulty: t.difficulty,
        confidence: t.confidence,
        estimatedHours: t.estimatedHours,
      }))
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 flex items-center gap-2">
            <span>Exam Countdown & Syllabus Tracker</span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 font-mono font-bold border border-indigo-200">
              {data.exams.length} Exams
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Master every syllabus topic, target weak confidence points, and track live countdowns.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingExam(null);
            setIsOpenAddModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all self-start sm:self-auto hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Add Exam Target</span>
        </button>
      </div>

      {/* Exam Cards Grid */}
      {data.exams.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white border border-dashed border-slate-300 text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900">No upcoming exams tracked</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Add your midterms, finals, or certification exams to trigger syllabus-driven automated
            revision schedules!
          </p>
          <button
            onClick={() => setIsOpenAddModal(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md"
          >
            + Add Target Exam
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {data.exams.map((exam) => {
            const subject = data.subjects.find((s) => s.id === exam.subjectId);
            const countdown = getCountdown(exam.examDate, exam.examTime);
            const completedTopics = exam.topics.filter((t) => t.isCompleted).length;
            const totalTopics = exam.topics.length;
            const completionPct =
              totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
            const weakTopics = exam.topics.filter((t) => !t.isCompleted && t.confidence <= 2);
            const isExpanded = expandedExamId === exam.id;

            // Revision sessions scheduled for this exam
            const scheduledForExam = data.scheduledSessions.filter((s) => s.examId === exam.id);

            return (
              <div
                key={exam.id}
                className="rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all overflow-hidden design-card"
              >
                {/* Main Card Header Banner */}
                <div className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-100">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {subject && (
                        <span
                          className="text-[10px] font-bold px-2.5 py-0.5 rounded-md"
                          style={{
                            backgroundColor: `${subject.color}15`,
                            color: subject.color,
                            border: `1px solid ${subject.color}30`,
                          }}
                        >
                          {subject.code} — {subject.name}
                        </span>
                      )}
                      {exam.weightPercent && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 font-semibold">
                          Weight: {exam.weightPercent}%
                        </span>
                      )}
                      {exam.targetGrade && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                          Target: {exam.targetGrade}
                        </span>
                      )}
                    </div>

                    <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900">
                      {exam.name}
                    </h2>

                    <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                        {exam.examDate} at {exam.examTime || '09:00'}
                      </span>
                      <span>•</span>
                      <span>{scheduledForExam.length} Revision Blocks Scheduled</span>
                    </div>
                  </div>

                  {/* Countdown Digital Display */}
                  <div className="flex items-center gap-2 self-start lg:self-center">
                    {[
                      { val: countdown.days, label: 'DAYS' },
                      { val: countdown.hours, label: 'HRS' },
                      { val: countdown.minutes, label: 'MIN' },
                      { val: countdown.seconds, label: 'SEC' },
                    ].map((unit, i) => (
                      <div
                        key={i}
                        className="flex flex-col items-center justify-center w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-slate-50 border border-slate-200 text-center shadow-xs"
                      >
                        <span className="font-mono text-xl sm:text-2xl font-extrabold text-slate-900 tabular-nums">
                          {String(unit.val).padStart(2, '0')}
                        </span>
                        <span className="text-[9px] font-mono font-bold text-slate-400 tracking-wider">
                          {unit.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Progress & Weak Topics Bar */}
                <div className="px-6 py-4 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex-1 max-w-md space-y-1">
                    <div className="flex justify-between text-slate-700 font-medium">
                      <span>Syllabus Mastery:</span>
                      <span className="font-mono font-bold text-indigo-600">{completionPct}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-indigo-500 to-pink-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${completionPct}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {weakTopics.length > 0 && (
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        {weakTopics.length} low-confidence topics need work
                      </span>
                    )}

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(exam)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-200 transition-colors"
                        title="Edit exam & topics"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteExam(exam.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete exam"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() =>
                          setExpandedExamId(isExpanded ? null : exam.id)
                        }
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-200 transition-colors"
                        title={isExpanded ? 'Collapse topics' : 'Expand syllabus topics'}
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Topics Checklist (Collapsible) */}
                {isExpanded && (
                  <div className="p-6 bg-white border-t border-slate-100 space-y-3">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Syllabus Modules & Confidence Matrix
                    </h3>

                    <div className="space-y-2">
                      {exam.topics.map((topic) => (
                        <div
                          key={topic.id}
                          className={`flex items-center justify-between p-3 rounded-2xl border text-xs transition-all ${
                            topic.isCompleted
                              ? 'bg-slate-900/30 border-slate-800/60 opacity-60'
                              : topic.confidence <= 2
                              ? 'bg-amber-950/20 border-amber-500/30'
                              : 'bg-slate-900/60 border-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => toggleExamTopicComplete(exam.id, topic.id)}
                              className={`p-1 rounded-lg border transition-colors ${
                                topic.isCompleted
                                  ? 'bg-emerald-500 border-emerald-400 text-white'
                                  : 'border-slate-700 hover:border-cyan-400 text-transparent'
                              }`}
                              title={
                                topic.isCompleted
                                  ? 'Mark not completed'
                                  : 'Mark topic mastered (+80 XP)'
                              }
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </button>

                            <div>
                              <span
                                className={`font-semibold ${
                                  topic.isCompleted
                                    ? 'line-through text-slate-500'
                                    : 'text-slate-200'
                                }`}
                              >
                                {topic.name}
                              </span>
                              <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                                <span>Est. {topic.estimatedHours}h</span>
                                <span>•</span>
                                <span>Difficulty: {topic.difficulty}/5</span>
                              </div>
                            </div>
                          </div>

                          {/* Confidence Level Badge */}
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-400">Confidence:</span>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((lvl) => (
                                <span
                                  key={lvl}
                                  className={`w-2 h-2 rounded-full ${
                                    lvl <= topic.confidence
                                      ? topic.confidence <= 2
                                      : 'bg-slate-700'
                                  } ${
                                    lvl <= topic.confidence
                                      ? topic.confidence <= 2
                                        ? 'bg-rose-400'
                                        : topic.confidence <= 3
                                        ? 'bg-amber-400'
                                        : 'bg-emerald-400'
                                      : 'bg-slate-700'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-[10px] font-mono text-slate-300 ml-1">
                              {topic.confidence}/5
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Exam Modal */}
      {(isOpenAddModal || editingExam) && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#10131E] border border-cyan-500/40 rounded-3xl p-6 max-w-xl w-full space-y-4 shadow-2xl animate-in fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-cyan-400" />
                <span>{editingExam ? 'Edit Exam Target' : 'Create Exam Countdown Target'}</span>
              </h3>
              <button
                onClick={() => {
                  if (editingExam) setEditingExam(null);
                  else setIsOpenAddModal(false);
                }}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Exam Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Calculus Midterm Examination"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Subject</label>
                  <select
                    value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                  >
                    {data.subjects.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.code} — {sub.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Target Grade</label>
                  <input
                    type="text"
                    placeholder="e.g. A or 95%"
                    value={targetGrade}
                    onChange={(e) => setTargetGrade(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Exam Date</label>
                  <input
                    type="date"
                    required
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Exam Time</label>
                  <input
                    type="time"
                    value={examTime}
                    onChange={(e) => setExamTime(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Final Weight %</label>
                  <input
                    type="number"
                    min="5"
                    max="100"
                    value={weightPercent}
                    onChange={(e) => setWeightPercent(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Topics Builder */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-300">
                    Syllabus Topics (Automated Study Breakdown)
                  </label>
                  <button
                    type="button"
                    onClick={handleAddTopicRow}
                    className="text-cyan-400 hover:text-cyan-300 font-semibold text-xs flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Topic</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {topics.map((t, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          required
                          placeholder="Topic Name (e.g. Green's Theorem & Line Integrals)"
                          value={t.name}
                          onChange={(e) => handleTopicChange(idx, 'name', e.target.value)}
                          className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-white text-xs focus:outline-none focus:border-cyan-400"
                        />
                        {topics.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveTopicRow(idx)}
                            className="text-slate-500 hover:text-rose-400 p-1"
                          >
                            ✕
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-[11px]">
                        <div>
                          <label className="text-slate-400 block mb-0.5">Difficulty</label>
                          <select
                            value={t.difficulty}
                            onChange={(e) =>
                              handleTopicChange(idx, 'difficulty', Number(e.target.value))
                            }
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-white"
                          >
                            <option value={1}>1 (Easy)</option>
                            <option value={2}>2 (Moderate)</option>
                            <option value={3}>3 (Normal)</option>
                            <option value={4}>4 (Hard)</option>
                            <option value={5}>5 (Demon)</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-slate-400 block mb-0.5">Confidence</label>
                          <select
                            value={t.confidence}
                            onChange={(e) =>
                              handleTopicChange(idx, 'confidence', Number(e.target.value))
                            }
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-white"
                          >
                            <option value={1}>1 (Lost)</option>
                            <option value={2}>2 (Shaky)</option>
                            <option value={3}>3 (Average)</option>
                            <option value={4}>4 (Solid)</option>
                            <option value={5}>5 (Mastered)</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-slate-400 block mb-0.5">Est. Hours</label>
                          <input
                            type="number"
                            min="1"
                            max="20"
                            value={t.estimatedHours}
                            onChange={(e) =>
                              handleTopicChange(idx, 'estimatedHours', Number(e.target.value))
                            }
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-white"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    if (editingExam) setEditingExam(null);
                    else setIsOpenAddModal(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow-glow-cyan"
                >
                  {editingExam ? 'Save Changes' : 'Create Exam'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
