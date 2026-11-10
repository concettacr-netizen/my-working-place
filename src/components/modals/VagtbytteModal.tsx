import React, { useState } from 'react';
import { X, ArrowLeftRight, Check, UserCheck, Calendar } from 'lucide-react';
import { Shift, Colleague } from '../../types';

interface VagtbytteModalProps {
  isOpen: boolean;
  onClose: () => void;
  myShifts: Shift[];
  colleagues: Colleague[];
  preselectedShift?: Shift;
  onSubmit: (shiftId: string, colleagueName: string, reason: string) => void;
}

export const VagtbytteModal: React.FC<VagtbytteModalProps> = ({
  isOpen,
  onClose,
  myShifts,
  colleagues,
  preselectedShift,
  onSubmit,
}) => {
  const [selectedShiftId, setSelectedShiftId] = useState<string>(
    preselectedShift?.id || myShifts[0]?.id || ''
  );
  const [targetColleague, setTargetColleague] = useState<string>('Freja Møller');
  const [reason, setReason] = useState('Skal til forældremøde');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      onSubmit(selectedShiftId, targetColleague, reason);
      setSubmitted(false);
      onClose();
    }, 1000);
  };

  const selectedShift = myShifts.find((s) => s.id === selectedShiftId) || myShifts[0];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#0F2744] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-emerald-400">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold leading-snug">Anmod om Vagtbytte</h3>
              <p className="text-xs text-slate-300">Byt vagt med en godkendt kollega</p>
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
              <Check className="w-9 h-9" />
            </div>
            <h4 className="text-xl font-bold text-[#0F2744]">Bytteanmodning afsendt</h4>
            <p className="text-sm text-slate-600 mt-2 max-w-xs">
              {targetColleague} har modtaget din forespørgsel i Min Arbejdsplads. Når kollegaen accepterer, videresendes den til ledergodkendelse.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#0F2744] uppercase tracking-wider mb-2">
                1. Vælg din vagt du ønsker at bytte
              </label>
              <div className="space-y-2">
                {myShifts.slice(0, 3).map((shift) => (
                  <div
                    key={shift.id}
                    onClick={() => setSelectedShiftId(shift.id)}
                    className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                      selectedShiftId === shift.id
                        ? 'border-[#0F2744] bg-[#eff4ff] ring-1 ring-[#0F2744]'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-semibold text-[#0F2744]">{shift.dayLabel}</div>
                      <div className="text-xs text-slate-500">
                        {shift.startTime} - {shift.endTime} ({shift.durationHours} timer) • {shift.department}
                      </div>
                    </div>
                    {selectedShiftId === shift.id && (
                      <div className="w-6 h-6 rounded-full bg-[#0F2744] text-white flex items-center justify-center">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F2744] uppercase tracking-wider mb-2">
                2. Vælg kollega (eller tilbyd alle i Hal 4)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTargetColleague('Åben for alle i Hal 4')}
                  className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                    targetColleague === 'Åben for alle i Hal 4'
                      ? 'border-[#0F2744] bg-[#eff4ff]'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-[#10B981]/20 text-[#006c49] flex items-center justify-center font-bold text-xs">
                    ALL
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-semibold text-[#0F2744]">Åben pulje</p>
                    <p className="text-[11px] text-slate-500">Alle kvalificerede</p>
                  </div>
                </button>

                {colleagues.slice(0, 3).map((col) => (
                  <button
                    key={col.id}
                    type="button"
                    onClick={() => setTargetColleague(col.name)}
                    className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                      targetColleague === col.name
                        ? 'border-[#0F2744] bg-[#eff4ff]'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <img
                      src={col.avatar}
                      alt={col.name}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200"
                    />
                    <div className="truncate">
                      <p className="text-xs font-semibold text-[#0F2744] truncate">{col.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{col.role}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F2744] uppercase tracking-wider mb-2">
                Begrundelse for bytte
              </label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="F.eks. Lægeaftale, familiebegivenhed..."
                className="w-full h-[52px] px-4 rounded-2xl bg-white border border-[rgba(15,39,68,0.12)] text-sm text-[#0B192C] focus:outline-none focus:border-[#1E3A8A]"
              />
            </div>

            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 leading-relaxed">
              Bemærk: Begge parter skal have gyldigt truck-certifikat Kat. B for vagter i Hal 4 jf. virksomhedens sikkerhedspolitik.
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
                <ArrowLeftRight className="w-4 h-4" />
                Send Bytteanmodning
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
