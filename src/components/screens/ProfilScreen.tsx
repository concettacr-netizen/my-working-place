import React from 'react';
import {
  User,
  ShieldCheck,
  Palmtree,
  FileText,
  Bell,
  Fingerprint,
  Phone,
  ChevronRight,
  LogOut,
  QrCode,
  Download,
  AlertCircle,
  Clock,
  Sparkles,
  Building2,
} from 'lucide-react';
import { UserProfile, Payslip } from '../../types';

interface ProfilScreenProps {
  userProfile: UserProfile;
  payslips: Payslip[];
  onOpenFerieModal: () => void;
  onOpenSygemeldingModal: () => void;
  onSelectPayslip: (payslip: Payslip) => void;
  onToggleBiometric: () => void;
  onToggleNotifications: () => void;
  onLogout: () => void;
  onOpenAdminPortal?: () => void;
  onOpenPhoneInstall?: () => void;
}

export const ProfilScreen: React.FC<ProfilScreenProps> = ({
  userProfile,
  payslips,
  onOpenFerieModal,
  onOpenSygemeldingModal,
  onSelectPayslip,
  onToggleBiometric,
  onToggleNotifications,
  onLogout,
  onOpenAdminPortal,
  onOpenPhoneInstall,
}) => {
  return (
    <div className="pb-24 pt-2 px-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Medarbejderportal
          </span>
          <h1 className="text-2xl font-bold text-[#0F2744] tracking-tight">Min Profil</h1>
        </div>
      </div>

      {/* Employee ID Digital Badge Card */}
      <div className="bg-[#0F2744] text-white rounded-3xl p-5 shadow-lg relative overflow-hidden">
        <div className="absolute top-3 right-3 z-10">
          <img
            src="/src/assets/images/restaurant_logo_1794344925528.jpg"
            alt="Portale Ristorante"
            referrerPolicy="no-referrer"
            className="w-12 h-12 rounded-full object-cover border-2 border-white/20 shadow-md"
          />
        </div>

        <div className="flex items-start gap-3.5 relative z-10">
          <img
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80"
            alt={userProfile.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-400 shadow-sm"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-mono font-bold text-emerald-400 bg-white/10 px-2 py-0.5 rounded-full">
                {userProfile.idNumber}
              </span>
              <span className="text-[10px] text-slate-300">Aktiv ansættelse</span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1 truncate">{userProfile.name}</h2>
            <p className="text-xs text-slate-300 truncate">{userProfile.title}</p>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-xs relative z-10">
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-medium">Afdeling</span>
            <div className="font-semibold text-white truncate">{userProfile.department}</div>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-medium">Ansættelse</span>
            <div className="font-semibold text-white truncate">{userProfile.contract || 'Fastansat (37 t)'}</div>
          </div>
        </div>
      </div>

      {/* Ferie & Fraværsbalance Card */}
      <div className="bg-white rounded-2xl p-4 border border-[rgba(15,39,68,0.06)] nordic-card-shadow">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Palmtree className="w-4 h-4 text-[#10B981]" />
            <h3 className="text-sm font-bold text-[#0F2744]">Ferie & Fraværssaldo</h3>
          </div>
          <button
            onClick={onOpenFerieModal}
            className="text-xs font-semibold text-[#1E3A8A] hover:underline flex items-center gap-0.5"
          >
            Ansøg om fri <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="p-3 rounded-xl bg-[#F8FAFC] border border-slate-100 text-center">
            <div className="text-[10px] text-slate-500 uppercase font-bold">Restferie</div>
            <div className="text-lg font-extrabold text-[#0F2744] mt-0.5">
              {userProfile.vacationDaysLeft} <span className="text-xs font-normal text-slate-500">dg</span>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-[#F8FAFC] border border-slate-100 text-center">
            <div className="text-[10px] text-slate-500 uppercase font-bold">Feriefridage</div>
            <div className="text-lg font-extrabold text-[#0F2744] mt-0.5">
              {userProfile.careDaysLeft} <span className="text-xs font-normal text-slate-500">dg</span>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-[#ECFDF5] border border-emerald-100 text-center">
            <div className="text-[10px] text-[#065F46] uppercase font-bold">Timebank</div>
            <div className="text-lg font-extrabold text-[#065F46] mt-0.5">
              +{userProfile.timeBankHours} <span className="text-xs font-normal">t</span>
            </div>
          </div>
        </div>

        <div className="mt-3 flex gap-2">
          <button
            onClick={onOpenFerieModal}
            className="flex-1 h-[48px] rounded-xl bg-[#0F2744] hover:bg-[#0A1C30] text-white text-xs font-bold android-tap transition-colors"
          >
            Planlæg Ferie
          </button>
          <button
            onClick={onOpenSygemeldingModal}
            className="h-[48px] px-3.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold android-tap transition-colors"
          >
            Sygemelding
          </button>
        </div>
      </div>

      {/* Lønsedler (Payslips List) */}
      <div className="bg-white rounded-2xl p-4 border border-[rgba(15,39,68,0.06)] nordic-card-shadow">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#0F2744]" />
            <h3 className="text-sm font-bold text-[#0F2744]">Lønsedler (Seneste 3 mdr)</h3>
          </div>
          <span className="text-[11px] text-slate-400">NemKonto</span>
        </div>

        <div className="space-y-2">
          {payslips.map((slip) => (
            <div
              key={slip.id}
              onClick={() => onSelectPayslip(slip)}
              className="p-3 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-slate-100 flex items-center justify-between cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#0F2744] font-bold text-xs">
                  {slip.month.slice(0, 3)}
                </div>
                <div>
                  <div className="text-xs font-bold text-[#0F2744]">{slip.month}</div>
                  <div className="text-[11px] text-slate-500">Udbetalt: {slip.netPayout.toLocaleString('da-DK')} kr</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          ))}
        </div>
      </div>

      {/* Android Device & App Preferences */}
      <div className="bg-white rounded-2xl p-4 border border-[rgba(15,39,68,0.06)] nordic-card-shadow space-y-4">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Enhedsindstillinger & Sikkerhed
        </h3>

        {/* Biometrics Switch */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#eff4ff] text-[#1E3A8A] flex items-center justify-center">
              <Fingerprint className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#0F2744]">Biometrisk Android Login</div>
              <div className="text-[11px] text-slate-500">Fingeraftryk / Face Unlock</div>
            </div>
          </div>
          <button
            onClick={onToggleBiometric}
            className={`w-12 h-7 rounded-full p-1 transition-colors ${
              userProfile.biometricEnabled ? 'bg-[#10B981]' : 'bg-slate-300'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                userProfile.biometricEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Notifications Switch */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#eff4ff] text-[#1E3A8A] flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#0F2744]">Vagtnotifikationer</div>
              <div className="text-[11px] text-slate-500">Påmindelse 45 min før vagt</div>
            </div>
          </div>
          <button
            onClick={onToggleNotifications}
            className={`w-12 h-7 rounded-full p-1 transition-colors ${
              userProfile.notificationsEnabled ? 'bg-[#10B981]' : 'bg-slate-300'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                userProfile.notificationsEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Smartphone Install & QR Code Banner */}
      <div className="bg-gradient-to-r from-[#0F2744] to-[#1E3A8A] rounded-2xl p-4 text-white shadow-md flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
            <QrCode className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Installa App su Telefono</h4>
            <p className="text-[11px] text-slate-300">
              Genera QR Code per scaricarla su iPhone o Android
            </p>
          </div>
        </div>

        {onOpenPhoneInstall && (
          <button
            onClick={onOpenPhoneInstall}
            className="h-9 px-3.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold shrink-0 transition-colors shadow-xs flex items-center gap-1.5"
          >
            <span>Mostra QR</span>
          </button>
        )}
      </div>

      {/* Emergency Contact & Vagtcentral Box */}
      <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-600 space-y-1.5">
        <div className="flex items-center gap-2 font-bold text-[#0F2744]">
          <Phone className="w-4 h-4 text-emerald-600" />
          <span>Døgnbemandet Driftstelefon: +45 70 20 88 40</span>
        </div>
        <p className="text-[11px] text-slate-500">
          Brug ved akutte hændelser på distributionsrampen, skader eller forsinkelser.
        </p>
      </div>

      {/* Admin Portal Action */}
      {onOpenAdminPortal && (
        <button
          onClick={onOpenAdminPortal}
          className="w-full h-[52px] rounded-2xl bg-[#0F2744] hover:bg-[#0A1C30] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 android-tap transition-colors shadow-xs"
        >
          <Building2 className="w-4 h-4 text-emerald-400" />
          <span>Apri Portale Admin (Gestione Dipendenti)</span>
        </button>
      )}

      {/* Logout Action */}
      <button
        onClick={onLogout}
        className="w-full h-[52px] rounded-2xl bg-white border border-red-200 hover:bg-red-50 text-red-600 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 android-tap transition-colors shadow-xs"
      >
        <LogOut className="w-4 h-4" />
        Disconnetti Account
      </button>
    </div>
  );
};
