import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Mail,
  Fingerprint,
  Eye,
  EyeOff,
  Building2,
  CheckCircle2,
  ArrowRight,
  UserCheck,
  Smartphone,
  Info,
  QrCode,
} from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: (userCredentials: { employeeId: string; name: string }, isAdmin?: boolean) => void;
  onOpenPhoneInstall?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess, onOpenPhoneInstall }) => {
  const [employeeId, setEmployeeId] = useState('EMP-8842');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isScanningBiometric, setIsScanningBiometric] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleStandardLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!employeeId.trim()) {
      setErrorMessage('Indtast venligst medarbejdernummer eller e-mail.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        employeeId: employeeId.trim(),
        name: employeeId.includes('EMP-8842') ? 'Marco Lindegaard' : 'Medarbejder',
      });
    }, 700);
  };

  const handleBiometricLogin = () => {
    setIsScanningBiometric(true);
    setErrorMessage('');
    setTimeout(() => {
      setIsScanningBiometric(false);
      onLoginSuccess({
        employeeId: 'EMP-8842',
        name: 'Marco Lindegaard',
      });
    }, 1200);
  };

  const handleQuickSelect = (id: string, name: string) => {
    setEmployeeId(id);
    setPassword('••••••••••••');
  };

  return (
    <div className="min-h-full px-5 py-8 flex flex-col justify-between">
      {/* Top Branding Section */}
      <div className="space-y-6">
        {/* Logo & Enterprise Identity */}
        <div className="text-center pt-2">
          <div className="w-24 h-24 mx-auto rounded-3xl overflow-hidden shadow-xl mb-3.5 border-2 border-[#10B981]/30 relative bg-white flex items-center justify-center p-1">
            <img
              src="/src/assets/images/restaurant_logo_1794344925528.jpg"
              alt="Portale Ristorante Logo"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain rounded-2xl"
            />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#10B981] border-2 border-white ring-1 ring-emerald-300 shadow-xs" />
          </div>

          <h1 className="text-2xl font-black text-[#0F2744] tracking-tight">
            Portale Ristorante
          </h1>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
            Portale Dipendenti • Cucina, Sala & Pizzeria
          </p>
        </div>

        {/* Security Badge */}
        <div className="p-3 bg-[#ECFDF5] border border-[#A7F3D0] rounded-2xl flex items-center justify-center gap-2 text-xs font-semibold text-[#065F46]">
          <ShieldCheck className="w-4 h-4 text-[#10B981]" />
          <span>Accesso sicuro aziendale • 2-Fattori</span>
        </div>

        {/* Error Message if present */}
        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl animate-shake">
            {errorMessage}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleStandardLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#0F2744] uppercase tracking-wider mb-1.5">
              Medarbejder-ID / E-mail
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder="F.eks. EMP-8842 eller e-mail"
                className="w-full h-[52px] pl-10 pr-4 rounded-2xl bg-white border border-[rgba(15,39,68,0.12)] text-sm font-medium text-[#0B192C] focus:outline-none focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-[#0F2744] uppercase tracking-wider">
                Adgangskode
              </label>
              <a
                href="#glemt-kode"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Kontakt din vagtleder eller IT Helpdesk på +45 70 20 88 40 for at nulstille din adgangskode.');
                }}
                className="text-xs text-[#1E3A8A] hover:underline font-medium"
              >
                Glemt kode?
              </a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Indtast din adgangskode"
                className="w-full h-[52px] pl-10 pr-11 rounded-2xl bg-white border border-[rgba(15,39,68,0.12)] text-sm font-medium text-[#0B192C] focus:outline-none focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember me switch */}
          <div className="flex items-center justify-between py-1">
            <span className="text-xs font-medium text-slate-600">Husk mig på denne enhed</span>
            <button
              type="button"
              onClick={() => setRememberMe(!rememberMe)}
              className={`w-11 h-6 rounded-full p-0.5 transition-colors ${
                rememberMe ? 'bg-[#10B981]' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  rememberMe ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Primary Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-[52px] rounded-2xl bg-[#0F2744] hover:bg-[#0A1C30] text-white text-sm font-bold shadow-md flex items-center justify-center gap-2 android-tap transition-all disabled:opacity-70"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Validerer login...
              </span>
            ) : (
              <>
                <span>Log Ind På Portalen</span>
                <ArrowRight className="w-4 h-4 text-emerald-400" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-[#F8FAFC] px-3 font-semibold text-slate-400 uppercase tracking-wider">
              Eller hurtig biometri
            </span>
          </div>
        </div>

        {/* Android Biometric Login Action */}
        <button
          type="button"
          onClick={handleBiometricLogin}
          disabled={isScanningBiometric}
          className="w-full h-[52px] rounded-2xl bg-white border border-[#10B981]/40 hover:bg-[#ECFDF5] text-[#065F46] text-xs sm:text-sm font-bold shadow-xs flex items-center justify-center gap-2.5 android-tap transition-all"
        >
          {isScanningBiometric ? (
            <span className="flex items-center gap-2 text-emerald-700">
              <span className="w-4 h-4 border-2 border-emerald-500/30 border-t-emerald-600 rounded-full animate-spin" />
              Scansione biometrica in corso...
            </span>
          ) : (
            <>
              <Fingerprint className="w-5 h-5 text-[#10B981]" />
              <span>Accedi con Impronta Digitale / Biometria</span>
            </>
          )}
        </button>

        {/* Admin Portal Quick Access */}
        <button
          type="button"
          onClick={() => onLoginSuccess({ employeeId: 'ADMIN-01', name: 'Direzione Portale Ristorante' }, true)}
          className="w-full h-[48px] rounded-2xl bg-[#eff4ff] hover:bg-[#dce9ff] border border-blue-200 text-[#0F2744] text-xs font-bold flex items-center justify-center gap-2 android-tap transition-colors shadow-2xs"
        >
          <Building2 className="w-4 h-4 text-[#1E3A8A]" />
          <span>Portale Admin • Registra & Gestisci Dipendenti</span>
        </button>

        {/* Smartphone QR Code App Download CTA */}
        {onOpenPhoneInstall && (
          <button
            type="button"
            onClick={onOpenPhoneInstall}
            className="w-full h-[48px] rounded-2xl bg-gradient-to-r from-[#0F2744] to-[#1E3A8A] text-white hover:from-[#0A1C30] hover:to-[#172E6C] text-xs font-bold flex items-center justify-center gap-2 android-tap transition-all shadow-xs"
          >
            <QrCode className="w-4 h-4 text-emerald-400" />
            <span>📱 Scarica l'App su Telefono (QR Code)</span>
          </button>
        )}

        {/* Demo Fast-Fill Profiles */}
        <div className="p-3.5 bg-white rounded-2xl border border-slate-200 nordic-card-shadow">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Seleziona profilo dipendente rapido:
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickSelect('EMP-8842', 'Marco Lindegaard')}
              className="p-2 rounded-xl bg-[#F8FAFC] hover:bg-[#eff4ff] border border-slate-200 text-left text-xs transition-colors"
            >
              <div className="font-bold text-[#0F2744]">Marco (Caposala)</div>
              <div className="text-[10px] text-slate-500">ID: EMP-8842 • Sala & Cassa</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickSelect('EMP-4219', 'Sofia Møller')}
              className="p-2 rounded-xl bg-[#F8FAFC] hover:bg-[#eff4ff] border border-slate-200 text-left text-xs transition-colors"
            >
              <div className="font-bold text-[#0F2744]">Sofia (Chef)</div>
              <div className="text-[10px] text-slate-500">ID: EMP-4219 • Cucina & Pizze</div>
            </button>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-6 text-center text-[11px] text-slate-400 space-y-1">
        <div>Portale Ristorante • Assistenza Turni: <strong>+45 70 20 88 40</strong></div>
        <div>Portale Dipendenti v2.4 (Android Enterprise)</div>
      </div>
    </div>
  );
};
