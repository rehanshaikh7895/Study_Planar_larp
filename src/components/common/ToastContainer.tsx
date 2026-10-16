import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, Sparkles, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isLevel = toast.type === 'level';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-xl shadow-xl backdrop-blur-md border text-sm font-medium transition-all duration-300 animate-in fade-in slide-in-from-bottom-3 ${
              isLevel
                ? 'bg-purple-950/90 border-purple-500/80 text-purple-200 shadow-purple-500/20'
                : isSuccess
                ? 'bg-slate-900/90 border-emerald-500/60 text-emerald-200 shadow-emerald-500/20'
                : isWarning
                ? 'bg-slate-900/90 border-amber-500/60 text-amber-200 shadow-amber-500/20'
                : 'bg-slate-900/90 border-cyan-500/60 text-cyan-200 shadow-cyan-500/20'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {isLevel && <Sparkles className="w-5 h-5 text-purple-400 shrink-0 animate-bounce" />}
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
              {isWarning && <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />}
              {!isLevel && !isSuccess && !isWarning && <Info className="w-5 h-5 text-cyan-400 shrink-0" />}
              <span className="leading-snug">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

