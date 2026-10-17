import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import type { Exam, SyllabusTopic } from '../../types';
import { triggerEmojiBurst } from '../../utils/emojiPop';
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
  ArrowRight,
  BookOpen,
} from 'lucide-react';

export const ExamsView: React.FC = () => {
  const { data, addExam, updateExam, deleteExam, toggleExamTopicComplete, setActiveTab } = useApp();

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

  const handleTopicToggle = (e: React.MouseEvent, examId: string, topicId: string) => {
    toggleExamTopicComplete(examId, topicId);
    triggerEmojiBurst(e);
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
                FOCUS 1 OF 4: EXAMS & SYLLABUS
              </span>
              <span className="text-xs">🔥</span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-white leading-snug">
              "Exam date daal di? Abhi Smart Schedule generate karo, warna exam hall me ceiling fan ke blades mat ginna! 🗿😭"
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('scheduler')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-black font-bold text-xs hover:bg-neutral-200 transition-all shrink-0 hover:scale-105 active:scale-95 shadow-md"
        >
          <span>Next: Smart Schedule</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-neutral-200 shadow-xs">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-black flex items-center gap-2.5">
            <span>Subjects & Exam Deadlines</span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-800 font-mono font-bold border border-neutral-200">
              {data.exams.length} Tracked
            </span>
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Add exam dates and key syllabus modules. PadhloShawtys automatically computes priority scores and breaks them into daily study sprints.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingExam(null);
            setIsOpenAddModal(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-black hover:bg-neutral-800 text-white font-bold text-xs shadow-md transition-all self-start sm:self-auto hover:scale-105 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add Target Exam</span>
        </button>
      </div>

      {/* Exam Cards Grid */}
      {data.exams.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white border-2 border-dashed border-neutral-300 text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-neutral-100 flex items-center justify-center text-black font-bold text-2xl">
            🎓
          </div>
          <h3 className="text-base font-black text-black">No upcoming exams entered</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
            Enter your upcoming midterm or final exam. The deterministic scheduler uses these dates and topic difficulties to pace your entire study plan!
          </p>
          <button
            onClick={() => setIsOpenAddModal(true)}
            className="px-5 py-2.5 rounded-2xl bg-black hover:bg-neutral-800 text-white text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-all"
          >
            + Add Your First Exam Target
          </button>
        </div>
      ) : (
        <div className="space-y-5">
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
                className="rounded-3xl bg-white border border-neutral-200/90 shadow-sm hover:shadow-md transition-all overflow-hidden"
              >
                {/* Main Card Header Banner */}
                <div className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-neutral-100">
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
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200 font-semibold">
                          Weight: {exam.weightPercent}%
                        </span>
                      )}
                      {exam.targetGrade && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-800 border border-neutral-200 font-bold">
                          Target: {exam.targetGrade}
                        </span>
                      )}
                    </div>

                    <h2 className="text-xl sm:text-2xl font-black text-black">
                      {exam.name}
                    </h2>

                    <div className="flex items-center gap-3 text-xs text-neutral-500 font-mono">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-black" />
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
                        className="flex flex-col items-center justify-center w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-neutral-50 border border-neutral-200 text-center shadow-xs"
                      >
                        <span className="font-mono text-xl sm:text-2xl font-black text-black tabular-nums">
                          {String(unit.val).padStart(2, '0')}
                        </span>
                        <span className="text-[9px] font-mono font-bold text-neutral-400 tracking-wider">
                          {unit.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Progress & Weak Topics Bar */}
                <div className="px-6 py-4 bg-neutral-50/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border-b border-neutral-100">
                  <div className="flex-1 max-w-md space-y-1">
                    <div className="flex justify-between text-neutral-700 font-medium">
                      <span>Syllabus Mastered:</span>
                      <span className="font-mono font-bold text-black">{completionPct}% ({completedTopics}/{totalTopics})</span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-black h-full rounded-full transition-all duration-500"
                        style={{ width: `${completionPct}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {weakTopics.length > 0 && (
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        {weakTopics.length} low-confidence topics
                      </span>
                    )}

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(exam)}
                        className="p-2 rounded-xl text-neutral-500 hover:text-black hover:bg-neutral-200 transition-colors"
                        title="Edit exam & topics"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteExam(exam.id)}
                        className="p-2 rounded-xl text-neutral-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete exam"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() =>
                          setExpandedExamId(isExpanded ? null : exam.id)
                        }
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-neutral-700 hover:text-black bg-white hover:bg-neutral-100 border border-neutral-200 font-semibold transition-colors"
                      >
                        <span>{isExpanded ? 'Hide Syllabus' : 'View Syllabus'}</span>
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
                  <div className="p-6 bg-white space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                        Syllabus Modules (Click checkmark to mark mastered + Fire Emoji Burst!)
                      </h3>
                      <button
                        onClick={() => setActiveTab('focus')}
                        className="text-xs text-neutral-800 hover:text-black font-bold flex items-center gap-1 hover:underline"
                      >
                        <span>Focus on these in Timer</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-2">
                      {exam.topics.map((topic) => (
                        <div
                          key={topic.id}
                          className={`flex items-center justify-between p-3.5 rounded-2xl border text-xs transition-all ${
                            topic.isCompleted
                              ? 'bg-neutral-50 border-neutral-200 text-neutral-400'
                              : topic.confidence <= 2
                              ? 'bg-amber-50/60 border-amber-200 text-neutral-900'
                              : 'bg-white border-neutral-200 text-neutral-900 hover:border-neutral-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <button
                              onClick={(e) => handleTopicToggle(e, exam.id, topic.id)}
                              className={`p-1.5 rounded-xl border transition-all ${
                                topic.isCompleted
                                  ? 'bg-black border-black text-white'
                                  : 'border-neutral-300 hover:border-black text-transparent hover:text-neutral-300'
                              }`}
                              title={
                                topic.isCompleted
                                  ? 'Mark incomplete'
                                  : 'Mark topic mastered (+80 XP 🔥)'
                              }
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>

                            <div>
                              <span
                                className={`font-bold ${
                                  topic.isCompleted
                                    ? 'line-through text-neutral-400'
                                    : 'text-black'
                                }`}
                              >
                                {topic.name}
                              </span>
                              <div className="flex items-center gap-2 text-[10px] text-neutral-500 mt-0.5">
                                <span>Est. {topic.estimatedHours}h</span>
                                <span>•</span>
                                <span>Difficulty: {topic.difficulty}/5</span>
                              </div>
                            </div>
                          </div>

                          {/* Confidence Level Badge */}
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-neutral-500 font-medium">Confidence:</span>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((lvl) => (
                                <span
                                  key={lvl}
                                  className={`w-2 h-2 rounded-full ${
                                    lvl <= topic.confidence
                                      ? topic.confidence <= 2
                                        ? 'bg-rose-500'
                                        : topic.confidence <= 3
                                        ? 'bg-amber-500'
                                        : 'bg-emerald-500'
                                      : 'bg-neutral-200'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-[10px] font-mono text-neutral-600 font-bold ml-1">
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

      {/* Next Step Action Box */}
      <div className="p-6 rounded-3xl bg-neutral-100 border border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-black text-black">Ready for Focus Step 2?</h4>
          <p className="text-xs text-neutral-600 mt-0.5">
            Turn your exams and syllabus targets into a concrete day-by-day study schedule with 1 click.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('scheduler')}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-black hover:bg-neutral-800 text-white font-bold text-xs shadow-md transition-all hover:scale-105 active:scale-95 shrink-0"
        >
          <span>Auto-Generate Study Schedule</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Add / Edit Exam Modal */}
      {(isOpenAddModal || editingExam) && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-5 shadow-2xl animate-in fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <h3 className="text-base font-black text-black flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-black" />
                <span>{editingExam ? 'Edit Exam Target' : 'Create New Exam Target'}</span>
              </h3>
              <button
                onClick={() => {
                  if (editingExam) setEditingExam(null);
                  else setIsOpenAddModal(false);
                }}
                className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 hover:text-black hover:bg-neutral-200 transition-colors font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-neutral-800 mb-1">Exam Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Calculus Midterm Examination"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2.5 text-black placeholder-neutral-400 focus:outline-none focus:border-black font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-neutral-800 mb-1">Subject</label>
                  <select
                    value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2.5 text-black focus:outline-none focus:border-black font-sans"
                  >
                    {data.subjects.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.code} — {sub.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-neutral-800 mb-1">Target Grade</label>
                  <input
                    type="text"
                    placeholder="e.g. A or 95%"
                    value={targetGrade}
                    onChange={(e) => setTargetGrade(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2.5 text-black placeholder-neutral-400 focus:outline-none focus:border-black font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-neutral-800 mb-1">Exam Date</label>
                  <input
                    type="date"
                    required
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-black focus:outline-none focus:border-black font-sans"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-800 mb-1">Exam Time</label>
                  <input
                    type="time"
                    value={examTime}
                    onChange={(e) => setExamTime(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-black focus:outline-none focus:border-black font-sans"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-800 mb-1">Final Weight %</label>
                  <input
                    type="number"
                    min="5"
                    max="100"
                    value={weightPercent}
                    onChange={(e) => setWeightPercent(Number(e.target.value))}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-black focus:outline-none focus:border-black font-sans"
                  />
                </div>
              </div>

              {/* Topics Builder */}
              <div className="space-y-3 pt-3 border-t border-neutral-100">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-neutral-800 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-black" />
                    <span>Syllabus Topics & Difficulties</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAddTopicRow}
                    className="text-black hover:text-neutral-700 font-bold text-xs flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Topic</span>
                  </button>
                </div>

                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                  {topics.map((t, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2.5"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          required
                          placeholder="Topic Name (e.g. Green's Theorem & Integrals)"
                          value={t.name}
                          onChange={(e) => handleTopicChange(idx, 'name', e.target.value)}
                          className="flex-1 bg-white border border-neutral-300 rounded-xl px-3 py-1.5 text-black text-xs focus:outline-none focus:border-black"
                        />
                        {topics.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveTopicRow(idx)}
                            className="text-neutral-400 hover:text-rose-600 p-1 font-bold"
                          >
                            ✕
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-[11px]">
                        <div>
                          <label className="text-neutral-500 font-medium block mb-0.5">Difficulty</label>
                          <select
                            value={t.difficulty}
                            onChange={(e) =>
                              handleTopicChange(idx, 'difficulty', Number(e.target.value))
                            }
                            className="w-full bg-white border border-neutral-300 rounded-lg px-2 py-1 text-black font-sans"
                          >
                            <option value={1}>1 (Easy)</option>
                            <option value={2}>2 (Moderate)</option>
                            <option value={3}>3 (Normal)</option>
                            <option value={4}>4 (Hard)</option>
                            <option value={5}>5 (Demon)</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-neutral-500 font-medium block mb-0.5">Confidence</label>
                          <select
                            value={t.confidence}
                            onChange={(e) =>
                              handleTopicChange(idx, 'confidence', Number(e.target.value))
                            }
                            className="w-full bg-white border border-neutral-300 rounded-lg px-2 py-1 text-black font-sans"
                          >
                            <option value={1}>1 (Lost 💀)</option>
                            <option value={2}>2 (Shaky)</option>
                            <option value={3}>3 (Average)</option>
                            <option value={4}>4 (Solid)</option>
                            <option value={5}>5 (Mastered 🔥)</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-neutral-500 font-medium block mb-0.5">Est. Hours</label>
                          <input
                            type="number"
                            min="1"
                            max="20"
                            value={t.estimatedHours}
                            onChange={(e) =>
                              handleTopicChange(idx, 'estimatedHours', Number(e.target.value))
                            }
                            className="w-full bg-white border border-neutral-300 rounded-lg px-2 py-1 text-black font-sans"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => {
                    if (editingExam) setEditingExam(null);
                    else setIsOpenAddModal(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-neutral-100 text-neutral-700 font-bold hover:bg-neutral-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-black hover:bg-neutral-800 text-white font-bold shadow-md transition-all"
                >
                  {editingExam ? 'Save Changes' : 'Create Exam Target'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
