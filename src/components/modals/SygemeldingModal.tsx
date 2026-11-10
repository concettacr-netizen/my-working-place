import React, { useState } from 'react';
import { X, AlertTriangle, Send, Calendar, Clock, CheckCircle } from 'lucide-react';

interface SygemeldingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (details: { reason: string; duration: string; note: string }) => void;
}

export const SygemeldingModal: React.FC<SygemeldingModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [duration, setDuration] = useState('1 dag (dagens vagt)');
  const [reason, setReason] = useState('Almindelig sygdom / utilpashed');
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      onSubmit({ reason, duration, note });
      setSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#0F2744] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold leading-snug">Hurtig Sygemelding</h3>
              <p className="text-xs text-slate-300">Underretter automatisk din leder Jens Peter</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        {submitted ? (
          <div className="p-8 text-center flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 rounded-full bg-[#ECFDF5] text-[#10B981] flex items-center justify-center mb-4">
              <CheckCircle className="w-9 h-9" />
            </div>
            <h4 className="text-xl font-bold text-[#0F2744]">Sygemelding registreret</h4>
            <p className="text-sm text-slate-600 mt-2 max-w-xs">
              Din vagt i dag (14:30 - 22:30) er markeret som sygemeldt. Vagtplanlæggeren er informeret. Rigtig god bedring!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4">
            <div className="p-3.5 bg-red-50 rounded-2xl border border-red-100 flex items-start gap-3">
              <Clock className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div className="text-xs text-red-900 leading-relaxed">
                <span className="font-semibold">Frist for sygemelding:</span> Senest 2 timer før vagtstart (kl. 12:30). Sker henvendelsen efter fristen, bedes du også ringe til vagttelefonen på <strong>+45 70 20 88 40</strong>.
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F2744] uppercase tracking-wider mb-2">
                Forventet fravær
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  '1 dag (dagens vagt)',
                  '2 dage (til torsdag)',
                  'Ugen ud (3 dage)',
                  'Uvist / Langtidssyg',
                ].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setDuration(item)}
                    className={`p-3 rounded-2xl text-xs font-medium border text-left transition-all ${
                      duration === item
                        ? 'bg-[#0F2744] text-white border-[#0F2744] shadow-sm'
                        : 'bg-[#F8FAFC] text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F2744] uppercase tracking-wider mb-2">
                Årsagskategori (HR)
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full h-[52px] px-4 rounded-2xl bg-white border border-[rgba(15,39,68,0.12)] text-sm font-medium text-[#0B192C] focus:outline-none focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A]"
              >
                <option value="Almindelig sygdom / utilpashed">Almindelig sygdom / feber / influenza</option>
                <option value="Barns 1. sygedag">Barns 1. sygedag</option>
                <option value="Barns 2. sygedag">Barns 2. sygedag</option>
                <option value="Arbejdsskade">Arbejdsskade (kræver rapport)</option>
                <option value="Akut læge-/tandlægebesøg">Akut læge- eller tandlægebesøg</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F2744] uppercase tracking-wider mb-2">
                Valgfri besked til leder (Jens Peter)
              </label>
              <textarea
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="F.eks. Ligger med 39 i feber. Forventer at være frisk igen torsdag..."
                className="w-full p-3.5 rounded-2xl bg-white border border-[rgba(15,39,68,0.12)] text-sm text-[#0B192C] placeholder:text-slate-400 focus:outline-none focus:border-[#1E3A8A]"
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
                className="flex-1 h-[52px] rounded-2xl bg-[#BA1A1A] hover:bg-[#93000A] text-white text-sm font-semibold shadow-md flex items-center justify-center gap-2 android-tap transition-colors"
              >
                <Send className="w-4 h-4" />
                Bekræft Sygemelding
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
