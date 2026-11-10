import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  ArrowLeftRight,
  Check,
  Plus,
  Filter,
  Sparkles,
  Info,
  MapPin,
  Coffee,
  CheckCircle2,
  Download,
} from 'lucide-react';
import { Shift, Colleague } from '../../types';
import { downloadIcsFile } from '../../utils/exportIcs';

interface VagterScreenProps {
  shifts: Shift[];
  colleagues: Colleague[];
  onClaimOpenShift: (shiftId: string) => void;
  onOpenSwapModal: (shift?: Shift) => void;
  onNotification?: (type: 'success' | 'error' | 'info', title: string, desc?: string) => void;
}

export const VagterScreen: React.FC<VagterScreenProps> = ({
  shifts,
  colleagues,
  onClaimOpenShift,
  onOpenSwapModal,
  onNotification,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'mine' | 'ledige' | 'bytte'>('mine');
  const [selectedDay, setSelectedDay] = useState<number>(3); // 3rd Nov

  // Days of current week (Nov 2 - Nov 8, 2026)
  const weekDays = [
    { dayNumber: 2, label: 'Lun', date: '2026-11-02', hasShift: false, hours: '7.5' },
    { dayNumber: 3, label: 'Mar', date: '2026-11-03', hasShift: true, hours: '8.0', isToday: true },
    { dayNumber: 4, label: 'Mer', date: '2026-11-04', hasShift: true, hours: '8.0' },
    { dayNumber: 5, label: 'Gio', date: '2026-11-05', hasShift: true, hours: '8.0' },
    { dayNumber: 6, label: 'Ven', date: '2026-11-06', hasShift: true, hours: '8.0' },
    { dayNumber: 7, label: 'Sab', date: '2026-11-07', hasShift: false, hasOpen: true },
    { dayNumber: 8, label: 'Dom', date: '2026-11-08', hasShift: false, hasOpen: true },
  ];

  const myShifts = shifts.filter((s) => s.status !== 'ledig');
  const openShifts = shifts.filter((s) => s.status === 'ledig');
  const swapShifts = shifts.filter((s) => s.status === 'bytte_tilbudt');

  const handleExportIcs = () => {
    downloadIcsFile(myShifts);
    if (onNotification) {
      onNotification(
        'success',
        'Calendario Esportato!',
        'Il file .ics con i tuoi turni di Portale Ristorante è stato scaricato.'
      );
    }
  };

  return (
    <div className="pb-24 pt-2 px-4 space-y-4">
      {/* Header with Actions */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Portale Ristorante
          </span>
          <h1 className="text-2xl font-bold text-[#0F2744] tracking-tight">Vagtplan & Turni</h1>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleExportIcs}
            className="h-10 px-3 rounded-2xl bg-white border border-slate-200 text-[#0F2744] text-xs font-semibold flex items-center gap-1 shadow-xs hover:bg-slate-50 android-tap transition-colors"
            title="Scarica file calendario standard .ICS"
          >
            <Download className="w-3.5 h-3.5 text-[#10B981]" />
            <span className="hidden sm:inline">Esporta</span> .ICS
          </button>

          <button
            onClick={() => onOpenSwapModal()}
            className="h-10 px-3.5 rounded-2xl bg-[#0F2744] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm android-tap"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-emerald-400" />
            <span>Scambia</span>
          </button>
        </div>
      </div>

      {/* Week Navigator Card */}
      <div className="bg-white rounded-2xl p-3.5 border border-[rgba(15,39,68,0.06)] nordic-card-shadow">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-[#0F2744]" />
            <span className="text-sm font-bold text-[#0F2744]">Uge 45 (2. – 8. nov 2026)</span>
          </div>
          <div className="flex items-center gap-1">
            <button className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 7-day strip */}
        <div className="grid grid-cols-7 gap-1.5">
          {weekDays.map((d) => {
            const isSelected = selectedDay === d.dayNumber;
            return (
              <button
                key={d.dayNumber}
                onClick={() => setSelectedDay(d.dayNumber)}
                className={`py-2 rounded-xl flex flex-col items-center justify-center transition-all ${
                  isSelected
                    ? 'bg-[#0F2744] text-white shadow-sm'
                    : d.isToday
                    ? 'bg-[#eff4ff] text-[#0F2744] border border-blue-200 font-bold'
                    : 'bg-[#F8FAFC] text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className={`text-[10px] uppercase font-semibold ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                  {d.label}
                </span>
                <span className="text-sm font-extrabold my-0.5">{d.dayNumber}</span>
                <div className="h-1.5 flex items-center gap-0.5">
                  {d.hasShift && (
                    <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-emerald-400' : 'bg-[#10B981]'}`} />
                  )}
                  {d.hasOpen && (
                    <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-amber-400' : 'bg-amber-500'}`} />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Segmented Filter Control */}
      <div className="bg-[#F1F5F9] p-1 rounded-2xl flex gap-1">
        <button
          onClick={() => setActiveSubTab('mine')}
          className={`flex-1 h-[42px] rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'mine'
              ? 'bg-white text-[#0F2744] shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          I Miei Turni ({myShifts.length})
        </button>
        <button
          onClick={() => setActiveSubTab('ledige')}
          className={`flex-1 h-[42px] rounded-xl text-xs font-bold transition-all relative ${
            activeSubTab === 'ledige'
              ? 'bg-white text-[#0F2744] shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Turni Liberi ({openShifts.length})
          {openShifts.length > 0 && (
            <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-[#065F46]">
              +{openShifts.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveSubTab('bytte')}
          className={`flex-1 h-[42px] rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'bytte'
              ? 'bg-white text-[#0F2744] shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Scambi ({swapShifts.length})
        </button>
      </div>

      {/* Subtab Content: I Miei Turni */}
      {activeSubTab === 'mine' && (
        <div className="space-y-3">
          {myShifts.map((shift) => (
            <div
              key={shift.id}
              className="bg-white rounded-2xl p-4 border border-[rgba(15,39,68,0.06)] nordic-card-shadow relative overflow-hidden"
            >
              {shift.status === 'aktiv' && (
                <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-[#10B981]" />
              )}

              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#0F2744] uppercase tracking-wide">
                      {shift.dayLabel}
                    </span>
                    {shift.status === 'aktiv' ? (
                      <span className="text-[11px] font-bold bg-[#ECFDF5] text-[#065F46] px-2 py-0.5 rounded-full flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                        In Turno Ora
                      </span>
                    ) : shift.status === 'bytte_tilbudt' ? (
                      <span className="text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full">
                        Scambio In Attesa
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                        Confermato
                      </span>
                    )}
                  </div>
                  <div className="text-xl font-extrabold text-[#0F2744] mt-1 tracking-tight">
                    {shift.startTime} – {shift.endTime}
                  </div>
                  <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                    <span>{shift.role}</span>
                    <span>•</span>
                    <span>{shift.durationHours} ore</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-[#F8FAFC] text-slate-700 border border-slate-200 inline-block">
                    {shift.department}
                  </span>
                </div>
              </div>

              {shift.notes && (
                <div className="mt-3 p-2.5 rounded-xl bg-[#F8FAFC] text-xs text-slate-600 flex items-start gap-2 border border-slate-100">
                  <Info className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                  <span>{shift.notes}</span>
                </div>
              )}

              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Coffee className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{shift.breakDurationMinutes} min pausa</span>
                </div>

                <button
                  onClick={() => onOpenSwapModal(shift)}
                  className="h-9 px-3 rounded-xl border border-slate-200 hover:border-slate-300 text-xs font-semibold text-[#0F2744] flex items-center gap-1.5 transition-colors"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                  Scambia
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Subtab Content: Turni Liberi */}
      {activeSubTab === 'ledige' && (
        <div className="space-y-3">
          <div className="p-3.5 rounded-2xl bg-[#eff4ff] border border-blue-100 text-xs text-[#0F2744] flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-[#1E3A8A] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Indennità e Maggiorazioni:</span> I turni liberi nel weekend includono indennità oraria aggiuntiva accreditata in busta paga.
            </div>
          </div>

          {openShifts.map((shift) => (
            <div
              key={shift.id}
              className="bg-white rounded-2xl p-4 border border-emerald-100 nordic-card-shadow relative overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold text-[#0F2744] uppercase tracking-wide">
                    {shift.dayLabel}
                  </span>
                  <div className="text-xl font-extrabold text-[#0F2744] mt-0.5">
                    {shift.startTime} – {shift.endTime}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {shift.role} • {shift.durationHours} ore
                  </div>
                </div>

                {shift.hourlyRateBonus && (
                  <span className="text-xs font-bold text-[#065F46] bg-[#ECFDF5] border border-emerald-200 px-2.5 py-1 rounded-xl">
                    +{shift.hourlyRateBonus} kr./t
                  </span>
                )}
              </div>

              {shift.notes && (
                <div className="mt-3 p-2.5 rounded-xl bg-emerald-50/50 text-xs text-[#065F46] border border-emerald-100">
                  {shift.notes}
                </div>
              )}

              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">
                  {shift.department}
                </span>

                <button
                  onClick={() => onClaimOpenShift(shift.id)}
                  className="h-9 px-4 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold shadow-xs flex items-center gap-1.5 android-tap transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Prendi Turno
                </button>
              </div>
            </div>
          ))}

          {openShifts.length === 0 && (
            <div className="text-center p-8 bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
              Nessun turno libero al momento.
            </div>
          )}
        </div>
      )}

      {/* Subtab Content: Scambi Turni */}
      {activeSubTab === 'bytte' && (
        <div className="space-y-3">
          {swapShifts.map((shift) => (
            <div
              key={shift.id}
              className="bg-white rounded-2xl p-4 border border-amber-200 nordic-card-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md uppercase">
                    Scambio Proposto
                  </span>
                  <div className="text-lg font-bold text-[#0F2744] mt-1.5">
                    {shift.dayLabel}: {shift.startTime} – {shift.endTime}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Destinatario: <strong>{shift.swapRequestedWith || 'Collega'}</strong>
                  </div>
                </div>
              </div>

              {shift.notes && (
                <div className="mt-3 p-2.5 rounded-xl bg-[#F8FAFC] text-xs text-slate-600 border border-slate-100">
                  {shift.notes}
                </div>
              )}

              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-amber-700 font-medium">In attesa di approvazione</span>
                <button
                  onClick={() => {
                    if (onNotification) {
                      onNotification('info', 'Richiesta Annullata', 'La richiesta di scambio turno è stata ritirata.');
                    }
                  }}
                  className="h-8 px-3 rounded-xl border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-50"
                >
                  Annulla
                </button>
              </div>
            </div>
          ))}

          {swapShifts.length === 0 && (
            <div className="text-center p-8 bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
              Nessuna richiesta di scambio attiva. Clicca su "Scambia" per cedere o scambiare un turno con un collega.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
