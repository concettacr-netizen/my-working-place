import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  description?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 w-full max-w-sm px-4 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-[#0F2744] text-white p-3.5 rounded-2xl shadow-xl flex items-start gap-3 border border-white/10 animate-in fade-in slide-in-from-top-3 duration-200"
        >
          {toast.type === 'success' && (
            <div className="w-7 h-7 rounded-full bg-[#10B981]/20 text-[#10B981] flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          )}
          {toast.type === 'error' && (
            <div className="w-7 h-7 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center shrink-0">
              <AlertCircle className="w-4 h-4" />
            </div>
          )}
          {toast.type === 'info' && (
            <div className="w-7 h-7 rounded-full bg-[#1E3A8A]/40 text-[#6cf8bb] flex items-center justify-center shrink-0">
              <Info className="w-4 h-4" />
            </div>
          )}
          <div className="flex-1 min-w-0 pr-1">
            <h4 className="text-sm font-semibold text-white leading-tight">{toast.title}</h4>
            {toast.description && (
              <p className="text-xs text-slate-300 mt-0.5 leading-snug">{toast.description}</p>
            )}
          </div>
          <button
            onClick={() => onDismiss(toast.id)}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
