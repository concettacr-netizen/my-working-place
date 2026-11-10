import React, { useState } from 'react';
import { X, Clock, PlusCircle, CheckCircle2 } from 'lucide-react';

interface ManualTimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (entry: { date: string; checkIn: string; checkOut: string; breakMin: number; note: string }) => void;
}

export const ManualTimeModal: React.FC<ManualTimeModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [date, setDate] = useState('2026-11-02');
  const [checkIn, setCheckIn] = useState('14:30');
  const [checkOut, setCheckOut] = useState('22:30');
  const [breakMin, setBreakMin] = useState(30);
  const [note, setNote] = useState('Glemt udstempling pga. akut overdragelse på distributionsrampen');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      onSubmit({ date, checkIn, checkOut, breakMin, note });
      setSubmitted(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#0F2744] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-emerald-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold leading-snug">Efterregistrering af tid</h3>
              <p className="text-xs text-slate-300">Tilføj manglende eller korrigeret stempling</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 rounded-full bg-[#ECFDF5] text-[#10B981] flex items-center justify-center mb-4">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h4 className="text-xl font-bold text-[#0F2744]">Tid sendt til godkendelse</h4>
            <p className="text-sm text-slate-600 mt-2 max-w-xs">
              Efterregistreringen er sendt til Jens Peter Hauge. Timerne fremgår med status 'Afventer' indtil godkendelse.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#0F2744] uppercase tracking-wider mb-1.5">
                Dato
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-[52px] px-4 rounded-2xl bg-white border border-[rgba(15,39,68,0.12)] text-sm text-[#0B192C] focus:outline-none focus:border-[#1E3A8A]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#0F2744] uppercase tracking-wider mb-1.5">
                  Tjek ind tidspunkt
                </label>
                <input
                  type="time"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full h-[52px] px-4 rounded-2xl bg-white border border-[rgba(15,39,68,0.12)] text-sm text-[#0B192C] focus:outline-none focus:border-[#1E3A8A]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0F2744] uppercase tracking-wider mb-1.5">
                  Tjek ud tidspunkt
                </label>
                <input
                  type="time"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full h-[52px] px-4 rounded-2xl bg-white border border-[rgba(15,39,68,0.12)] text-sm text-[#0B192C] focus:outline-none focus:border-[#1E3A8A]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F2744] uppercase tracking-wider mb-1.5">
                Pause afholdt (minutter)
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[0, 15, 30, 45].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setBreakMin(mins)}
                    className={`h-[48px] rounded-2xl text-xs font-semibold border transition-all ${
                      breakMin === mins
                        ? 'bg-[#0F2744] text-white border-[#0F2744]'
                        : 'bg-[#F8FAFC] text-slate-700 border-slate-200'
                    }`}
                  >
                    {mins} min
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F2744] uppercase tracking-wider mb-1.5">
                Begrundelse for manuel registrering
              </label>
              <textarea
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="F.eks. Skærmfejl på terminal, overarbejde..."
                className="w-full p-3.5 rounded-2xl bg-white border border-[rgba(15,39,68,0.12)] text-sm text-[#0B192C] focus:outline-none focus:border-[#1E3A8A]"
              />
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 h-[52px] rounded-2xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors"
              >
                Annuller
              </button>
              <button
                type="submit"
                className="flex-1 h-[52px] rounded-2xl bg-[#0F2744] hover:bg-[#0A1C30] text-white text-sm font-semibold shadow-md flex items-center justify-center gap-2 android-tap transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                Gem & Send til godkendelse
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
