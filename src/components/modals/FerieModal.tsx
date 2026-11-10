import React, { useState } from 'react';
import { X, Calendar, CheckCircle2, Palmtree, Clock } from 'lucide-react';
import { UserProfile } from '../../types';

interface FerieModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onSubmit: (details: { type: string; startDate: string; endDate: string; daysCount: number; comment: string }) => void;
}

export const FerieModal: React.FC<FerieModalProps> = ({ isOpen, onClose, userProfile, onSubmit }) => {
  const [vacationType, setVacationType] = useState('Hovedferie / Almindelig ferie');
  const [startDate, setStartDate] = useState('2026-12-21');
  const [endDate, setEndDate] = useState('2026-12-28');
  const [comment, setComment] = useState('Juleferie med familien');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      onSubmit({
        type: vacationType,
        startDate,
        endDate,
        daysCount: 5,
        comment,
      });
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
            <div className="w-10 h-10 rounded-2xl bg-[#ECFDF5] text-[#065F46] flex items-center justify-center">
              <Palmtree className="w-5 h-5 text-[#10B981]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold leading-snug">Ansøg om Ferie & Fravær</h3>
              <p className="text-xs text-slate-300">Ansættelse: Fastansat (37 timer/uge)</p>
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
            <h4 className="text-xl font-bold text-[#0F2744]">Ferieansøgning afsendt</h4>
            <p className="text-sm text-slate-600 mt-2 max-w-xs">
              Din ansøgning for perioden {startDate} til {endDate} (5 arbejdsdage) er sendt til Jens Peter Hauge til godkendelse.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4">
            {/* Balance Overview */}
            <div className="grid grid-cols-2 gap-3 p-3.5 bg-[#F1F5F9] rounded-2xl border border-slate-200">
              <div>
                <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
                  Restferie
                </span>
                <span className="text-lg font-bold text-[#0F2744]">
                  {userProfile.vacationDaysLeft} <span className="text-xs font-normal text-slate-500">dage</span>
                </span>
              </div>
              <div>
                <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
                  Feriefridage
                </span>
                <span className="text-lg font-bold text-[#0F2744]">
                  {userProfile.careDaysLeft} <span className="text-xs font-normal text-slate-500">dage</span>
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F2744] uppercase tracking-wider mb-2">
                Fraværstype
              </label>
              <select
                value={vacationType}
                onChange={(e) => setVacationType(e.target.value)}
                className="w-full h-[52px] px-4 rounded-2xl bg-white border border-[rgba(15,39,68,0.12)] text-sm font-medium text-[#0B192C] focus:outline-none focus:border-[#1E3A8A]"
              >
                <option value="Hovedferie / Almindelig ferie">Almindelig ferie (Optjent feriekonto)</option>
                <option value="Feriefridag (6. ferieuge)">Feriefridag / Omsorgsdag</option>
                <option value="Afspadsering (Overarbejde)">Afspadsering (Opsparet timebank: 14.5t)</option>
                <option value="Tjenestefri / Orlov">Tjenestefri uden løn</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#0F2744] uppercase tracking-wider mb-1.5">
                  Fra dato
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full h-[52px] px-3.5 rounded-2xl bg-white border border-[rgba(15,39,68,0.12)] text-sm text-[#0B192C] focus:outline-none focus:border-[#1E3A8A]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0F2744] uppercase tracking-wider mb-1.5">
                  Til og med
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full h-[52px] px-3.5 rounded-2xl bg-white border border-[rgba(15,39,68,0.12)] text-sm text-[#0B192C] focus:outline-none focus:border-[#1E3A8A]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F2744] uppercase tracking-wider mb-2">
                Bemærkning / Formål
              </label>
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="F.eks. Sommerferie med familien..."
                className="w-full h-[52px] px-4 rounded-2xl bg-white border border-[rgba(15,39,68,0.12)] text-sm text-[#0B192C] focus:outline-none focus:border-[#1E3A8A]"
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
                <Calendar className="w-4 h-4" />
                Indsend ansøgning
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
