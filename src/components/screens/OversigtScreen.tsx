import React from 'react';
import {
  Clock,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  MapPin,
  Users,
  ShieldAlert,
  ChevronRight,
  TrendingUp,
  FileCheck2,
  Coffee,
  ArrowLeftRight,
  BellRing,
  Sparkles,
} from 'lucide-react';
import { Shift, Colleague, Notice, UserProfile } from '../../types';

interface OversigtScreenProps {
  userProfile: UserProfile;
  todayShift?: Shift;
  upcomingShifts: Shift[];
  colleagues: Colleague[];
  notices: Notice[];
  isClockedIn: boolean;
  isOnBreak: boolean;
  elapsedTimeString: string;
  onClockToggle: () => void;
  onOpenSygemelding: () => void;
  onOpenVagtbytte: () => void;
  onNavigateTab: (tab: 'vagter' | 'stempelur' | 'beskeder' | 'profil') => void;
  onReadNotice: (id: string) => void;
}

export const OversigtScreen: React.FC<OversigtScreenProps> = ({
  userProfile,
  todayShift,
  upcomingShifts,
  colleagues,
  notices,
  isClockedIn,
  isOnBreak,
  elapsedTimeString,
  onClockToggle,
  onOpenSygemelding,
  onOpenVagtbytte,
  onNavigateTab,
  onReadNotice,
}) => {
  const activeColleagues = colleagues.filter((c) => c.status === 'på_vagt');
  const unreadUrgentNotice = notices.find((n) => !n.read && n.urgent);

  return (
    <div className="pb-24 pt-2 px-4 space-y-4">
      {/* Top Greeting & Operational Status */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span>Tirsdag d. 3. nov</span>
            <span>•</span>
            <span className="text-[#10B981] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
              Drift normal
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#0F2744] tracking-tight mt-0.5">
            Goddag, {userProfile.name.split(' ')[0]} 👋
          </h1>
        </div>
        <button
          onClick={() => onNavigateTab('beskeder')}
          className="relative w-11 h-11 rounded-2xl bg-white border border-[rgba(15,39,68,0.08)] flex items-center justify-center text-[#0F2744] shadow-sm android-tap"
          title="Notifikationer"
        >
          <BellRing className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-[#10B981] ring-2 ring-white"></span>
        </button>
      </div>

      {/* Urgent Operations Notice if present */}
      {unreadUrgentNotice && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 flex items-start gap-3 shadow-xs animate-in slide-in-from-top-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-800 shrink-0 mt-0.5">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded-full">
                Vigtig driftsinfo
              </span>
              <span className="text-[11px] text-amber-800/80">{unreadUrgentNotice.date.split('kl.')[1] || ''}</span>
            </div>
            <h4 className="text-sm font-bold text-amber-950 mt-1 leading-snug">{unreadUrgentNotice.title}</h4>
            <p className="text-xs text-amber-900/90 mt-1 line-clamp-2 leading-relaxed">{unreadUrgentNotice.content}</p>
            <div className="mt-2.5 flex items-center gap-2">
              <button
                onClick={() => onReadNotice(unreadUrgentNotice.id)}
                className="h-8 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Forstået & bekræftet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Primary Shift Card (Nordic Navy) */}
      <div className="bg-[#0F2744] text-white rounded-3xl p-5 shadow-lg relative overflow-hidden">
        {/* Decorative subtle ambient circle */}
        <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-gradient-to-br from-emerald-500/10 to-blue-500/10 blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between mb-3 relative z-10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-ping" />
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              {isClockedIn ? (isOnBreak ? 'På Pause' : 'Aktiv På Vagt Nu') : 'Planlagt Vagt I Dag'}
            </span>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-white/10 text-white font-medium border border-white/10">
            {todayShift?.department || 'Logistik Hal 4'}
          </span>
        </div>

        <div className="relative z-10">
          <div className="text-3xl font-extrabold tracking-tight">
            {todayShift?.startTime || '14:30'} – {todayShift?.endTime || '22:30'}
          </div>
          <div className="text-xs text-slate-300 mt-1 flex items-center gap-2">
            <span>Rolle: {todayShift?.role || 'Aftenhold Koordinator'}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Coffee className="w-3.5 h-3.5 text-emerald-400" /> 30 min pause
            </span>
          </div>
        </div>

        {/* Live Punch Clock Status Box */}
        <div className="mt-4 p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-sm ${
              isClockedIn ? 'bg-[#10B981] text-white' : 'bg-white/20 text-white'
            }`}>
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-300 uppercase tracking-wider font-medium">
                {isClockedIn ? (isOnBreak ? 'Pause tid' : 'Arbejdstid i dag') : 'Stempelur status'}
              </div>
              <div className="text-base font-mono font-bold text-white tracking-wide">
                {isClockedIn ? elapsedTimeString : 'Ikke stemplet ind endnu'}
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-emerald-300 flex items-center gap-1 justify-end font-medium">
              <MapPin className="w-3 h-3" /> CPH Hub Port 12
            </span>
            <span className="text-[10px] text-slate-400">GPS & WiFi verificeret</span>
          </div>
        </div>

        {/* Primary Action Button (Tactile Emerald) */}
        <div className="mt-4 relative z-10 flex gap-2">
          <button
            onClick={onClockToggle}
            className={`flex-1 h-[52px] rounded-2xl text-sm font-bold shadow-md flex items-center justify-center gap-2 android-tap transition-all ${
              isClockedIn
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-[#10B981] hover:bg-[#059669] text-white'
            }`}
          >
            <Clock className="w-4 h-4" />
            {isClockedIn ? 'Tjek Ud Nu' : 'Tjek Ind (Start Vagt)'}
          </button>
          <button
            onClick={() => onNavigateTab('stempelur')}
            className="h-[52px] px-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center justify-center transition-colors"
            title="Gå til Stempelur"
          >
            Flere valg
          </button>
        </div>
      </div>

      {/* 4-Item Quick Workplace Actions Grid */}
      <div>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-1">
          Hurtige Handlinger
        </h3>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => onNavigateTab('stempelur')}
            className="p-3.5 rounded-2xl bg-white border border-[rgba(15,39,68,0.06)] nordic-card-shadow text-left android-tap flex items-start gap-3 hover:border-slate-300 transition-all"
          >
            <div className="w-9 h-9 rounded-xl bg-[#eff4ff] text-[#0F2744] flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#0F2744]">Stempelur & Tid</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Se ugetimer & log</p>
            </div>
          </button>

          <button
            onClick={onOpenVagtbytte}
            className="p-3.5 rounded-2xl bg-white border border-[rgba(15,39,68,0.06)] nordic-card-shadow text-left android-tap flex items-start gap-3 hover:border-slate-300 transition-all"
          >
            <div className="w-9 h-9 rounded-xl bg-[#ecfdf5] text-[#065F46] flex items-center justify-center shrink-0">
              <ArrowLeftRight className="w-5 h-5 text-[#10B981]" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#0F2744]">Byt Vagt</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Byt med kollega</p>
            </div>
          </button>

          <button
            onClick={() => onNavigateTab('vagter')}
            className="p-3.5 rounded-2xl bg-white border border-[rgba(15,39,68,0.06)] nordic-card-shadow text-left android-tap flex items-start gap-3 hover:border-slate-300 transition-all"
          >
            <div className="w-9 h-9 rounded-xl bg-[#eff4ff] text-[#1E3A8A] flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-bold text-[#0F2744]">Ledige Vagter</h4>
                <span className="text-[10px] bg-emerald-100 text-[#065F46] font-bold px-1.5 py-0.2 rounded-full">
                  2 nye
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">Tag ekstra vagt</p>
            </div>
          </button>

          <button
            onClick={onOpenSygemelding}
            className="p-3.5 rounded-2xl bg-white border border-[rgba(15,39,68,0.06)] nordic-card-shadow text-left android-tap flex items-start gap-3 hover:border-slate-300 transition-all"
          >
            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#0F2744]">Meld Sygdom</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Hurtig sygemelding</p>
            </div>
          </button>
        </div>
      </div>

      {/* Team on Shift Today (Aftenholdet Hal 4) */}
      <div className="bg-white rounded-2xl p-4 border border-[rgba(15,39,68,0.06)] nordic-card-shadow">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#0F2744]" />
            <h3 className="text-sm font-bold text-[#0F2744]">På Vagt I Dag ({activeColleagues.length} kolleger)</h3>
          </div>
          <button
            onClick={() => onNavigateTab('beskeder')}
            className="text-xs font-semibold text-[#1E3A8A] hover:underline flex items-center gap-0.5"
          >
            Gruppechat <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
          {colleagues.map((col) => (
            <div
              key={col.id}
              onClick={() => onNavigateTab('beskeder')}
              className="flex flex-col items-center shrink-0 w-20 cursor-pointer text-center group"
            >
              <div className="relative">
                <img
                  src={col.avatar}
                  alt={col.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-xs group-hover:ring-2 group-hover:ring-[#0F2744] transition-all"
                />
                <span
                  className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full ring-2 ring-white ${
                    col.status === 'på_vagt'
                      ? 'bg-[#10B981]'
                      : col.status === 'kommer_senere'
                      ? 'bg-amber-400'
                      : 'bg-slate-300'
                  }`}
                />
              </div>
              <span className="text-xs font-semibold text-[#0F2744] mt-1.5 truncate w-full">
                {col.name.split(' ')[0]}
              </span>
              <span className="text-[10px] text-slate-500 truncate w-full">
                {col.status === 'på_vagt' ? 'På vagt' : col.status === 'kommer_senere' ? 'Kl. 18' : 'Fri'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Next Upcoming Shifts Preview */}
      <div className="bg-white rounded-2xl p-4 border border-[rgba(15,39,68,0.06)] nordic-card-shadow">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#0F2744]" />
            <h3 className="text-sm font-bold text-[#0F2744]">Kommende Vagter</h3>
          </div>
          <button
            onClick={() => onNavigateTab('vagter')}
            className="text-xs font-semibold text-[#1E3A8A] hover:underline flex items-center gap-0.5"
          >
            Se vagtplan <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2">
          {upcomingShifts.slice(1, 4).map((shift) => (
            <div
              key={shift.id}
              onClick={() => onNavigateTab('vagter')}
              className="p-3 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-slate-100 flex items-center justify-between transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex flex-col items-center justify-center shrink-0">
                  <span className="text-[10px] font-bold uppercase text-slate-400">
                    {shift.dayLabel.includes('Ons') ? 'ONS' : shift.dayLabel.includes('Tor') ? 'TOR' : 'FRE'}
                  </span>
                  <span className="text-xs font-extrabold text-[#0F2744]">
                    {shift.date.split('-')[2]}
                  </span>
                </div>
                <div>
                  <div className="text-xs font-bold text-[#0F2744]">{shift.dayLabel}</div>
                  <div className="text-[11px] text-slate-500">
                    {shift.startTime} – {shift.endTime} • {shift.department}
                  </div>
                </div>
              </div>

              {shift.status === 'bytte_tilbudt' ? (
                <span className="text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full">
                  Bytte afventer
                </span>
              ) : (
                <span className="text-[11px] font-semibold bg-[#ECFDF5] text-[#065F46] px-2 py-0.5 rounded-full">
                  Bekræftet
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Hours Progress Widget */}
      <div className="p-4 rounded-2xl bg-white border border-[rgba(15,39,68,0.06)] nordic-card-shadow">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="font-semibold text-[#0F2744]">Arbejdstimer denne uge (Uge 45)</span>
          <span className="font-bold text-[#10B981]">29,5 / 37,0 timer</span>
        </div>
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-[#10B981] h-full rounded-full transition-all duration-500"
            style={{ width: `${(29.5 / 37.0) * 100}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
          <span>7,5 timer tilbage mod norm</span>
          <span className="text-emerald-700 font-semibold">+2,5 timer overtid opsparet</span>
        </div>
      </div>
    </div>
  );
};
