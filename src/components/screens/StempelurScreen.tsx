import React, { useState } from 'react';
import {
  Clock,
  Play,
  Square,
  Coffee,
  CheckCircle2,
  MapPin,
  Calendar,
  AlertCircle,
  FileCheck,
  PlusCircle,
  TrendingUp,
  ShieldCheck,
  ChevronRight,
  QrCode,
  Camera,
  Sparkles,
} from 'lucide-react';
import { TimeEntry } from '../../types';
import { QrScannerModal, SiteLocation, VERIFIED_SITES } from '../stempelur/QrScannerModal';

interface StempelurScreenProps {
  isClockedIn: boolean;
  isOnBreak: boolean;
  elapsedTimeString: string;
  clockInTimeFormatted: string;
  onClockIn: (locationName?: string) => void;
  onClockOut: (locationName?: string) => void;
  onToggleBreak: () => void;
  timeEntries: TimeEntry[];
  onOpenManualModal: () => void;
  onNotification?: (type: 'success' | 'error' | 'info', title: string, desc?: string) => void;
}

export const StempelurScreen: React.FC<StempelurScreenProps> = ({
  isClockedIn,
  isOnBreak,
  elapsedTimeString,
  clockInTimeFormatted,
  onClockIn,
  onClockOut,
  onToggleBreak,
  timeEntries,
  onOpenManualModal,
  onNotification,
}) => {
  const [activeTab, setActiveTab] = useState<'stempel' | 'timeseddel'>('stempel');
  const [isQrScannerOpen, setIsQrScannerOpen] = useState<boolean>(false);
  const [verifiedSite, setVerifiedSite] = useState<SiteLocation | null>(null);

  const totalWeeklyHours = 29.5;
  const weeklyTarget = 37.0;
  const progressPercent = Math.min(100, Math.round((totalWeeklyHours / weeklyTarget) * 100));

  const handleQrVerified = (site: SiteLocation, actionType: 'in' | 'out') => {
    setVerifiedSite(site);
    if (actionType === 'in') {
      onClockIn(`${site.name} (${site.code})`);
      if (onNotification) {
        onNotification(
          'success',
          'QR-Kode Verificeret!',
          `Stemplet IND på arbejdsstation: ${site.name} (${site.zone})`
        );
      }
    } else {
      onClockOut(`${site.name} (${site.code})`);
      if (onNotification) {
        onNotification(
          'info',
          'QR-Kode Verificeret!',
          `Stemplet UD fra: ${site.name}`
        );
      }
    }
  };

  return (
    <div className="pb-24 pt-2 px-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Tidsregistrering • Portale Ristorante
          </span>
          <h1 className="text-2xl font-bold text-[#0F2744] tracking-tight">Stempelur</h1>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsQrScannerOpen(true)}
            className="h-10 px-3.5 rounded-2xl bg-[#eff4ff] border border-blue-200 text-[#0F2744] text-xs font-bold flex items-center gap-1.5 shadow-2xs hover:bg-[#dce9ff] android-tap transition-colors"
            title="Scan arbejdsstationens QR-kode"
          >
            <QrCode className="w-4 h-4 text-[#1E3A8A]" />
            <span>QR-Scan</span>
          </button>

          <button
            onClick={onOpenManualModal}
            className="h-10 px-3.5 rounded-2xl bg-white border border-[rgba(15,39,68,0.12)] text-[#0F2744] text-xs font-semibold flex items-center gap-1.5 shadow-xs hover:bg-slate-50 android-tap"
          >
            <PlusCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Manuel</span>
          </button>
        </div>
      </div>

      {/* Switch between Live Stempelur and Timeseddel */}
      <div className="bg-[#F1F5F9] p-1 rounded-2xl flex gap-1">
        <button
          onClick={() => setActiveTab('stempel')}
          className={`flex-1 h-[42px] rounded-xl text-xs font-bold transition-all ${
            activeTab === 'stempel'
              ? 'bg-white text-[#0F2744] shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Aktiv Stempling
        </button>
        <button
          onClick={() => setActiveTab('timeseddel')}
          className={`flex-1 h-[42px] rounded-xl text-xs font-bold transition-all ${
            activeTab === 'timeseddel'
              ? 'bg-white text-[#0F2744] shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Godkendt Timeseddel ({timeEntries.length})
        </button>
      </div>

      {activeTab === 'stempel' ? (
        <>
          {/* Main Tactile Stempelur Container */}
          <div className="bg-white rounded-3xl p-6 border border-[rgba(15,39,68,0.06)] nordic-card-shadow text-center relative overflow-hidden">
            {/* Location & QR-Status Badge */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] text-xs font-semibold mb-4">
              <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
              <span>
                {verifiedSite
                  ? `${verifiedSite.name} • QR Verificeret`
                  : 'Portale Ristorante, Danmark • På Lokation'}
              </span>
            </div>

            {/* Current Status Pill */}
            <div className="mb-2">
              <span
                className={`text-xs font-extrabold uppercase tracking-widest px-3 py-1 rounded-full ${
                  isClockedIn
                    ? isOnBreak
                      ? 'bg-amber-100 text-amber-900'
                      : 'bg-[#ECFDF5] text-[#065F46]'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {isClockedIn ? (isOnBreak ? '☕️ PAUSE I GANG' : '🟢 PÅ ARBEJDE NU') : '⚪️ IKKE STEMPLET IND'}
              </span>
            </div>

            {/* Huge Digital Timer */}
            <div className="font-mono text-5xl font-black text-[#0F2744] tracking-tight my-4">
              {isClockedIn ? elapsedTimeString : '00:00:00'}
            </div>

            <div className="text-xs text-slate-500 mb-6">
              {isClockedIn ? (
                <span>
                  Stemplet ind kl. <strong>{clockInTimeFormatted}</strong> • Planlagt fri kl. <strong>22:30</strong>
                </span>
              ) : (
                <span>Klar til start. Scan on-site QR-kode eller tryk på knappen nedenfor.</span>
              )}
            </div>

            {/* Primary Punch Clock Actions */}
            <div className="space-y-3">
              {/* Highlighted QR Code Scanner Action */}
              <button
                onClick={() => setIsQrScannerOpen(true)}
                className="w-full h-[52px] rounded-2xl bg-gradient-to-r from-[#0F2744] to-[#1E3A8A] text-white text-xs sm:text-sm font-bold shadow-md flex items-center justify-center gap-2.5 android-tap transition-all hover:from-[#0A1C30] hover:to-[#172E6C]"
              >
                <Camera className="w-4 h-4 text-emerald-400" />
                <span>
                  {isClockedIn
                    ? 'Scan QR-Kode for at stemple UD'
                    : 'Scan On-Site QR-Kode for at stemple IND'}
                </span>
              </button>

              {!isClockedIn ? (
                <button
                  onClick={() => onClockIn()}
                  className="w-full h-[54px] rounded-2xl bg-[#10B981] hover:bg-[#059669] text-white text-base font-bold shadow-xs flex items-center justify-center gap-2.5 android-tap transition-all"
                >
                  <Play className="w-5 h-5 fill-current" />
                  Stempel Ind (Hurtigstart)
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={onToggleBreak}
                    className={`h-[54px] rounded-2xl font-bold text-sm flex items-center justify-center gap-2 android-tap transition-all ${
                      isOnBreak
                        ? 'bg-[#10B981] text-white hover:bg-[#059669]'
                        : 'bg-[#eff4ff] text-[#0F2744] border border-blue-200 hover:bg-blue-100'
                    }`}
                  >
                    <Coffee className="w-4 h-4" />
                    {isOnBreak ? 'Afslut Pause' : 'Start Pause'}
                  </button>

                  <button
                    onClick={() => onClockOut()}
                    className="h-[54px] rounded-2xl bg-[#BA1A1A] hover:bg-[#93000A] text-white font-bold text-sm shadow-sm flex items-center justify-center gap-2 android-tap transition-all"
                  >
                    <Square className="w-4 h-4 fill-current" />
                    Stempel Ud
                  </button>
                </div>
              )}
            </div>

            {/* Geofence notice footer */}
            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>Nøjagtighed: 5 meter • QR-verificeret restaurantstation</span>
            </div>
          </div>

          {/* Weekly Hours Breakdown Card */}
          <div className="bg-white rounded-2xl p-4 border border-[rgba(15,39,68,0.06)] nordic-card-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#0F2744] uppercase tracking-wider">
                Ugestatus (Uge 45)
              </span>
              <span className="text-xs font-bold text-[#10B981]">{progressPercent}% opnået</span>
            </div>

            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden mb-3">
              <div
                className="bg-[#10B981] h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="grid grid-cols-3 gap-2 text-center pt-1">
              <div className="p-2.5 rounded-xl bg-[#F8FAFC]">
                <div className="text-[10px] text-slate-500 uppercase font-semibold">Udført</div>
                <div className="text-sm font-extrabold text-[#0F2744] mt-0.5">{totalWeeklyHours} t</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#F8FAFC]">
                <div className="text-[10px] text-slate-500 uppercase font-semibold">Norm</div>
                <div className="text-sm font-extrabold text-[#0F2744] mt-0.5">{weeklyTarget} t</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#ECFDF5]">
                <div className="text-[10px] text-[#065F46] uppercase font-semibold">Timebank</div>
                <div className="text-sm font-extrabold text-[#065F46] mt-0.5">+2,5 t</div>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Timeseddel list */
        <div className="space-y-3">
          <div className="p-3.5 rounded-2xl bg-white border border-[rgba(15,39,68,0.06)] nordic-card-shadow flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#0F2744]">Nuværende Lønperiode</h3>
              <p className="text-xs text-slate-500 mt-0.5">Godkendes ugentligt • Portale Ristorante</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-extrabold text-[#10B981] bg-[#ECFDF5] px-2.5 py-1 rounded-full">
                Alt Godkendt
              </span>
            </div>
          </div>

          {timeEntries.map((entry) => (
            <div
              key={entry.id}
              className="bg-white rounded-2xl p-4 border border-[rgba(15,39,68,0.06)] nordic-card-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#0F2744]">{entry.dayName}</span>
                  <span className="text-xs text-slate-500">• {entry.date}</span>
                </div>
                {entry.approved ? (
                  <span className="text-[11px] font-semibold bg-[#ECFDF5] text-[#065F46] px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Godkendt
                  </span>
                ) : (
                  <span className="text-[11px] font-semibold bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full">
                    Afventer
                  </span>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Stempling</span>
                  <span className="font-semibold text-slate-800">{entry.checkIn} – {entry.checkOut}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Pause</span>
                  <span className="font-semibold text-slate-800">{entry.breakDuration}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[10px]">Netto</span>
                  <span className="font-extrabold text-[#0F2744] text-sm">{entry.nettoHours} timer</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 text-[11px] text-slate-500">
                <span className="truncate">{entry.location}</span>
                <span className="text-slate-400">Leder: {entry.approvedBy || 'Ledelse'}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* QR SCANNER MODAL */}
      <QrScannerModal
        isOpen={isQrScannerOpen}
        onClose={() => setIsQrScannerOpen(false)}
        onVerified={handleQrVerified}
        isClockedIn={isClockedIn}
      />
    </div>
  );
};
