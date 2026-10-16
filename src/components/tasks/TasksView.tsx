import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import type { Task, Priority } from '../../types';
import {
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Calendar,
  Trash2,
  Edit2,
  AlertCircle,
  Filter,
  Check,
  Flame,
  ArrowUpDown,
  BookOpen,
} from 'lucide-react';

export const TasksView: React.FC<{
  isOpenAddModal: boolean;
  onCloseAddModal: () => void;
  onOpenAddModal: () => void;
}> = ({ isOpenAddModal, onCloseAddModal, onOpenAddModal }) => {
  const { data, addTask, updateTask, deleteTask, toggleTaskComplete } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'todo' | 'completed' | 'overdue'>('all');
  const [sortBy, setSortBy] = useState<'deadline' | 'priority' | 'duration'>('deadline');

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [subjectId, setSubjectId] = useState(data.subjects[0]?.id || '');
  const [topic, setTopic] = useState('');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueTime, setDueTime] = useState('20:00');
  const [duration, setDuration] = useState(45);
  const [priority, setPriority] = useState<Priority>('medium');
  const [difficulty, setDifficulty] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [notes, setNotes] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  const handleOpenEdit = (task: Task) => {
    setEditingTask(task);
    setTitle(task.title);
    setSubjectId(task.subjectId);
    setTopic(task.topic || '');
    setDueDate(task.dueDate);
    setDueTime(task.dueTime || '20:00');
    setDuration(task.estimatedDuration);
    setPriority(task.priority);
    setDifficulty(task.difficulty);
    setNotes(task.notes || '');
  };

  const handleResetForm = () => {
    setTitle('');
    setSubjectId(data.subjects[0]?.id || '');
    setTopic('');
    setDueDate(new Date().toISOString().split('T')[0]);
    setDueTime('20:00');
    setDuration(45);
    setPriority('medium');
    setDifficulty(3);
    setNotes('');
    setEditingTask(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingTask) {
      updateTask({
        ...editingTask,
        title: title.trim(),
        subjectId,
        topic: topic.trim() || undefined,
        dueDate,
        dueTime,
        estimatedDuration: Number(duration),
        priority,
        difficulty,
        notes: notes.trim() || undefined,
      });
      setEditingTask(null);
    } else {
      addTask({
        title: title.trim(),
        subjectId,
        topic: topic.trim() || undefined,
        dueDate,
        dueTime,
        estimatedDuration: Number(duration),
        priority,
        difficulty,
        status: 'todo',
        notes: notes.trim() || undefined,
      });
      onCloseAddModal();
    }
    handleResetForm();
  };

  const filteredTasks = useMemo(() => {
    return data.tasks.filter((t) => {
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = t.title.toLowerCase().includes(query);
        const matchesTopic = t.topic?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesTopic) return false;
      }

      if (selectedSubject !== 'all' && t.subjectId !== selectedSubject) {
        return false;
      }

      if (selectedPriority !== 'all' && t.priority !== selectedPriority) {
        return false;
      }

      if (selectedStatus === 'completed' && t.status !== 'completed') return false;
      if (selectedStatus === 'todo' && t.status === 'completed') return false;
      if (selectedStatus === 'overdue') {
        if (t.status === 'completed' || t.dueDate >= todayStr) return false;
      }

      return true;
    });
  }, [data.tasks, searchQuery, selectedSubject, selectedPriority, selectedStatus, todayStr]);

  const sortedTasks = useMemo(() => {
    const list = [...filteredTasks];
    const priorityWeight: Record<Priority, number> = {
      urgent: 4,
      high: 3,
      medium: 2,
      low: 1,
    };

    if (sortBy === 'deadline') {
      list.sort((a, b) => a.dueDate.localeCompare(b.dueDate));
    } else if (sortBy === 'priority') {
      list.sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority]);
    } else if (sortBy === 'duration') {
      list.sort((a, b) => b.estimatedDuration - a.estimatedDuration);
    }
    return list;
  }, [filteredTasks, sortBy]);

  const overdueCount = data.tasks.filter(
    (t) => t.status !== 'completed' && t.dueDate < todayStr
  ).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 flex items-center gap-2">
            <span>Tasks & Assignments</span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 font-mono font-bold border border-indigo-200">
              {data.tasks.filter((t) => t.status !== 'completed').length} Pending
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track problem sets, readings, code submissions, and projects with ease.
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all self-start sm:self-auto hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>

      {/* Overdue Alert banner */}
      {overdueCount > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-3 text-xs text-amber-900">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <span className="font-bold">You have {overdueCount} overdue target(s).</span>{' '}
              <span>No guilt, you're human! PadhloShawtys pe focus timer laga kar clear karte hain. 🎯</span>
            </div>
          </div>
          <button
            onClick={() => setSelectedStatus('overdue')}
            className="px-3 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-800 font-semibold shrink-0 transition-colors"
          >
            Show Overdue
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search assignments or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Subjects</option>
            {data.subjects.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.code} — {sub.name}
              </option>
            ))}
          </select>

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent 🔥</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-600">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'deadline' | 'priority' | 'duration')}
              className="bg-transparent text-slate-900 focus:outline-none text-xs"
            >
              <option value="deadline">Deadline</option>
              <option value="priority">Priority</option>
              <option value="duration">Estimated Duration</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1 overflow-x-auto scrollbar-none">
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Status:
          </span>
          {[
            { id: 'all', label: `All (${data.tasks.length})` },
            {
              id: 'todo',
              label: `Incomplete (${data.tasks.filter((t) => t.status !== 'completed').length})`,
            },
            {
              id: 'completed',
              label: `Completed (${data.tasks.filter((t) => t.status === 'completed').length})`,
            },
            { id: 'overdue', label: `Overdue (${overdueCount})` },
          ].map((chip) => (
            <button
              key={chip.id}
              onClick={() => setSelectedStatus(chip.id as 'all' | 'todo' | 'completed' | 'overdue')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedStatus === chip.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tasks List */}
      {sortedTasks.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white border border-dashed border-slate-300 text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900">No tasks matching criteria</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery
              ? 'Try modifying your search query or removing filters.'
              : 'Add your first assignment to organize your academic workflow!'}
          </p>
          <button
            onClick={onOpenAddModal}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md"
          >
            + Create Task
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedTasks.map((task) => {
            const subject = data.subjects.find((s) => s.id === task.subjectId);
            const isCompleted = task.status === 'completed';
            const isOverdue = !isCompleted && task.dueDate < todayStr;
            const isDueToday = task.dueDate === todayStr;

            return (
              <div
                key={task.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group design-card ${
                  isCompleted
                    ? 'bg-slate-50/70 border-slate-200 opacity-70'
                    : isOverdue
                    ? 'bg-rose-50/40 border-rose-200'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-start gap-3.5 overflow-hidden">
                  <button
                    onClick={() => toggleTaskComplete(task.id)}
                    className={`mt-1 p-1 rounded-lg border transition-colors shrink-0 ${
                      isCompleted
                        ? 'bg-emerald-500 border-emerald-400 text-white'
                        : 'border-slate-300 hover:border-indigo-500 text-transparent'
                    }`}
                    title={isCompleted ? 'Mark incomplete' : 'Complete task (+60 XP)'}
                  >
                    <Check className="w-4 h-4" />
                  </button>

                  <div className="space-y-1 overflow-hidden">
                    <div className="flex flex-wrap items-center gap-2">
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

                      {task.priority === 'urgent' && (
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-0.5">
                          <Flame className="w-3 h-3 fill-rose-500" />
                          Urgent
                        </span>
                      )}
                      {task.priority === 'high' && (
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                          High
                        </span>
                      )}

                      <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {task.estimatedDuration}m
                      </span>

                      <span className="text-[10px] text-indigo-600 font-mono">
                        {'★'.repeat(task.difficulty)}
                        <span className="text-slate-300">{'★'.repeat(5 - task.difficulty)}</span>
                      </span>
                    </div>

                    <h4
                      className={`text-sm font-semibold transition-all ${
                        isCompleted ? 'line-through text-slate-400' : 'text-slate-900'
                      }`}
                    >
                      {task.title}
                    </h4>

                    {task.topic && (
                      <p className="text-xs text-slate-500 italic">Topic: {task.topic}</p>
                    )}

                    {task.notes && (
                      <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg mt-1 border border-slate-200">
                        {task.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="text-left sm:text-right">
                    <div
                      className={`text-xs font-mono font-semibold flex items-center gap-1 ${
                        isOverdue
                          ? 'text-rose-600'
                          : isDueToday
                          ? 'text-amber-600'
                          : 'text-slate-700'
                      }`}
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{isDueToday ? 'Today' : task.dueDate}</span>
                      {task.dueTime && <span>{task.dueTime}</span>}
                    </div>
                    {isOverdue && <span className="text-[10px] text-rose-600 font-bold">Overdue</span>}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(task)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                      title="Edit task"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setTaskToDelete(task.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Task Modal */}
      {(isOpenAddModal || editingTask) && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-indigo-200 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-display font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                <span>{editingTask ? 'Edit Task' : 'Create New Assignment'}</span>
              </h3>
              <button
                onClick={() => {
                  if (editingTask) setEditingTask(null);
                  else onCloseAddModal();
                  handleResetForm();
                }}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Solve Multivariable Integrals Problem Set 3"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Subject</label>
                  <select
                    value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500"
                  >
                    {data.subjects.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.code} — {sub.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Topic / Sub-chapter
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Stokes Theorem"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Due Time</label>
                  <input
                    type="time"
                    value={dueTime}
                    onChange={(e) => setDueTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Est. Duration (Mins)
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="300"
                    step="5"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Priority)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="urgent">Urgent 🔥</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Difficulty ({difficulty}/5)
                  </label>
                  <div className="flex items-center gap-2 pt-1">
                    {[1, 2, 3, 4, 5].map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setDifficulty(lvl as 1 | 2 | 3 | 4 | 5)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          difficulty === lvl
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Optional Notes</label>
                <textarea
                  rows={2}
                  placeholder="Reference links, textbook page numbers, lab partners..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    if (editingTask) setEditingTask(null);
                    else onCloseAddModal();
                    handleResetForm();
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-md"
                >
                  {editingTask ? 'Save Changes' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {taskToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-rose-200 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Delete Task?</h3>
            <p className="text-xs text-slate-500">
              Are you sure you want to remove this task? This will also remove any linked sessions
              from your study schedule.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setTaskToDelete(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold"
              >
                Keep Task
              </button>
              <button
                onClick={() => {
                  deleteTask(taskToDelete);
                  setTaskToDelete(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
