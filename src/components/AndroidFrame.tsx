import React from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  Clock,
  MessageSquare,
  User,
  Wifi,
  Signal,
  Battery,
  Smartphone,
  Monitor,
  QrCode,
} from 'lucide-react';
import { TabType } from '../types';

interface AndroidFrameProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  unreadMessagesCount: number;
  openShiftsCount: number;
  isClockedIn: boolean;
  deviceMode: 'mobile' | 'fullscreen';
  onToggleDeviceMode: () => void;
  isAuthenticated?: boolean;
  isAdminMode?: boolean;
  onToggleAdminMode?: () => void;
  onOpenPhoneInstall?: () => void;
  children: React.ReactNode;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({
  currentTab,
  onTabChange,
  unreadMessagesCount,
  openShiftsCount,
  isClockedIn,
  deviceMode,
  onToggleDeviceMode,
  isAuthenticated = true,
  isAdminMode = false,
  onToggleAdminMode,
  onOpenPhoneInstall,
  children,
}) => {
  // Navigation destinations from the Danish spec:
  // Oversigt, Vagter, Stempelur, Beskeder, Profil
  const navItems = [
    {
      id: 'oversigt' as TabType,
      label: 'Oversigt',
      icon: LayoutDashboard,
    },
    {
      id: 'vagter' as TabType,
      label: 'Vagter',
      icon: CalendarDays,
      badge: openShiftsCount > 0 ? `${openShiftsCount}` : undefined,
    },
    {
      id: 'stempelur' as TabType,
      label: 'Stempelur',
      icon: Clock,
      dot: isClockedIn,
    },
    {
      id: 'beskeder' as TabType,
      label: 'Beskeder',
      icon: MessageSquare,
      badge: unreadMessagesCount > 0 ? `${unreadMessagesCount}` : undefined,
    },
    {
      id: 'profil' as TabType,
      label: 'Profil',
      icon: User,
    },
  ];

  return (
    <div className="min-h-screen bg-[#E2E8F0] flex flex-col items-center justify-start p-0 sm:py-6 sm:px-4 font-['Inter',sans-serif]">
      {/* Top Desktop Utility Toolbar */}
      <div className="w-full max-w-md sm:max-w-xl md:max-w-2xl mb-3 flex items-center justify-between px-3 py-1.5 text-xs text-slate-700">
        <div className="flex items-center gap-2">
          <img
            src="/src/assets/images/restaurant_logo_1794344925528.jpg"
            alt="Portale Ristorante"
            referrerPolicy="no-referrer"
            className="w-5 h-5 rounded-full object-cover border border-slate-300 shadow-2xs"
          />
          <span className="font-bold text-[#0F2744]">Portale Ristorante</span>
          <span className="text-slate-400">|</span>
          <span className="hidden sm:inline text-slate-500">Portale Dipendenti</span>
        </div>

        <div className="flex items-center gap-2">
          {onOpenPhoneInstall && (
            <button
              onClick={onOpenPhoneInstall}
              className="h-8 px-2.5 rounded-xl bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-50 flex items-center gap-1.5 font-bold shadow-2xs transition-all android-tap"
              title="Genera QR Code per scaricare l'app sul tuo telefono"
            >
              <QrCode className="w-3.5 h-3.5 text-emerald-600" />
              <span>📱 Scarica su Telefono (QR)</span>
            </button>
          )}

          {onToggleAdminMode && isAuthenticated && (
            <button
              onClick={onToggleAdminMode}
              className={`h-8 px-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs android-tap ${
                isAdminMode
                  ? 'bg-[#10B981] text-white hover:bg-[#059669]'
                  : 'bg-[#0F2744] text-white hover:bg-[#0A1C30]'
              }`}
            >
              <span>{isAdminMode ? '← Vista Staff' : '👔 Portale Admin'}</span>
            </button>
          )}

          <button
            onClick={onToggleDeviceMode}
            className="h-8 px-3 rounded-xl bg-white border border-slate-300 text-slate-700 hover:text-[#0F2744] hover:bg-slate-50 flex items-center gap-1.5 font-medium shadow-xs transition-all"
          >
            {deviceMode === 'mobile' ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-slate-500" />
                <span>Fuld skærm / Tablet</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-slate-500" />
                <span>Android telefonvisning</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div
        className={`w-full transition-all duration-300 ${
          deviceMode === 'mobile'
            ? 'max-w-[430px] sm:rounded-[40px] sm:border-[8px] sm:border-[#1E293B] shadow-2xl overflow-hidden bg-[#F8FAFC]'
            : 'max-w-3xl rounded-3xl border border-slate-200 shadow-xl overflow-hidden bg-[#F8FAFC]'
        }`}
        style={{ minHeight: '840px' }}
      >
        {/* Android Top Status Bar */}
        <div className="sticky top-0 z-40 bg-[#F8FAFC]/90 backdrop-blur-md px-5 pt-3 pb-2 flex items-center justify-between text-xs text-[#0F2744] border-b border-[rgba(15,39,68,0.04)] select-none">
          <span className="font-semibold font-mono tracking-tight text-[13px]">14:32</span>

          {/* Android Camera Punch Hole on mobile preview */}
          {deviceMode === 'mobile' && (
            <div className="hidden sm:block w-3.5 h-3.5 rounded-full bg-[#0F172A] border border-slate-700/60 shadow-inner" />
          )}

          <div className="flex items-center gap-1.5 text-slate-600">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <span className="text-[11px] font-mono font-medium ml-0.5">88%</span>
            <Battery className="w-4 h-4 fill-current text-[#10B981]" />
          </div>
        </div>

        {/* Screen Content Body */}
        <main className="relative min-h-[740px]">{children}</main>

        {/* Android Bottom Navigation Bar (64px + dynamic safe area inset) */}
        {isAuthenticated && !isAdminMode ? (
          <nav className="fixed sm:sticky bottom-0 left-0 right-0 z-40 max-w-[430px] mx-auto sm:max-w-none bg-white/95 backdrop-blur-lg border-t border-[rgba(15,39,68,0.06)] px-2 pt-1 pb-4 flex flex-col justify-end">
            <div className="h-[56px] flex items-center justify-around">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    className="flex-1 flex flex-col items-center justify-center relative py-1 group android-tap"
                  >
                    <div
                      className={`px-4 py-1 rounded-full transition-all duration-150 flex items-center justify-center relative ${
                        isActive ? 'bg-[#F1F5F9] text-[#0F2744]' : 'text-[#64748B] group-hover:text-slate-900'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />

                      {/* Numeric Badge */}
                      {item.badge && (
                        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#10B981] text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                          {item.badge}
                        </span>
                      )}

                      {/* Green status pulse dot (e.g. punched in) */}
                      {item.dot && (
                        <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-[#10B981] ring-2 ring-white animate-pulse" />
                      )}
                    </div>

                    <span
                      className={`text-[11px] mt-0.5 transition-colors ${
                        isActive ? 'font-bold text-[#0F2744]' : 'font-medium text-[#64748B]'
                      }`}
                    >
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Android Dynamic Navigation Pill / Home Indicator */}
            <div className="w-full flex items-center justify-center pt-1.5 pb-0.5">
              <div className="w-28 h-1 rounded-full bg-slate-300" />
            </div>
          </nav>
        ) : (
          <div className="w-full py-4 flex items-center justify-center bg-transparent">
            <div className="w-28 h-1 rounded-full bg-slate-300" />
          </div>
        )}
      </div>
    </div>
  );
};
