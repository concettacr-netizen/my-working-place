import React, { useState } from 'react';
import {
  UserPlus,
  Users,
  Search,
  Filter,
  CheckCircle2,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  Briefcase,
  QrCode,
  Download,
  Trash2,
  Edit3,
  ShieldCheck,
  ChevronRight,
  ArrowLeft,
  X,
  Sparkles,
  Building2,
  Clock,
  Printer,
  Copy,
  Check,
  BarChart3,
  TrendingUp,
} from 'lucide-react';
import { Employee, Shift } from '../../types';
import { WorkloadDistributionChart } from '../admin/WorkloadDistributionChart';

interface AdminPortalScreenProps {
  employees: Employee[];
  shifts?: Shift[];
  onAddEmployee: (employee: Employee) => void;
  onRemoveEmployee: (id: string) => void;
  onUpdateEmployeeStatus: (id: string, status: 'attivo' | 'ferie' | 'non_attivo') => void;
  onSwitchToEmployeeView: () => void;
  onLogout: () => void;
}

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
];

export const AdminPortalScreen: React.FC<AdminPortalScreenProps> = ({
  employees,
  shifts,
  onAddEmployee,
  onRemoveEmployee,
  onUpdateEmployeeStatus,
  onSwitchToEmployeeView,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'elenco' | 'workload' | 'nuovo'>('elenco');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('Tutti');
  const [selectedBadgeEmployee, setSelectedBadgeEmployee] = useState<Employee | null>(null);
  const [copiedPin, setCopiedPin] = useState(false);

  // Form State for New Employee
  const [name, setName] = useState('');
  const [role, setRole] = useState('Tjener (Servering)');
  const [department, setDepartment] = useState<'Sala' | 'Cucina' | 'Pizzeria' | 'Bar' | 'Amministrazione'>('Sala');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+45 ');
  const [hourlyRate, setHourlyRate] = useState<number>(165.00);
  const [contractType, setContractType] = useState<string>('Fastansat (Fuldtid 37 t)');
  const [weeklyHours, setWeeklyHours] = useState<number>(37);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [avatar, setAvatar] = useState(AVATAR_PRESETS[0]);
  const [notes, setNotes] = useState('Fødevarehygiejnecertifikat (HACCP / Fødevarestyrelsen Smiley) gyldigt');

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDeptFilter === 'Tutti' || emp.department === selectedDeptFilter;
    return matchesSearch && matchesDept;
  });

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newId = `EMP-${Math.floor(1000 + Math.random() * 9000)}`;
    const newPin = Math.floor(1000 + Math.random() * 9000).toString();

    const newEmployee: Employee = {
      id: newId,
      name: name.trim(),
      role,
      department,
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '.')}@portaleristorante.dk`,
      phone: phone.trim() || '+45 20 12 34 56',
      hourlyRate: Number(hourlyRate) || 165.00,
      contractType,
      weeklyHours: Number(weeklyHours) || 37,
      startDate,
      status: 'attivo',
      avatar,
      notes,
      pinCode: newPin,
    };

    onAddEmployee(newEmployee);
    setSelectedBadgeEmployee(newEmployee);

    // Reset Form
    setName('');
    setEmail('');
    setPhone('+45 ');
    setNotes('Fødevarehygiejnecertifikat (HACCP / Fødevarestyrelsen Smiley) gyldigt');
    setActiveTab('elenco');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPin(true);
    setTimeout(() => setCopiedPin(false), 2000);
  };

  return (
    <div className="pb-24 pt-2 px-4 space-y-4">
      {/* Admin Portal Header Banner */}
      <div className="bg-[#0F2744] text-white rounded-3xl p-5 shadow-lg relative overflow-hidden">
        <div className="flex items-start justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-13 h-13 rounded-2xl bg-white p-1 border border-white/20 shadow-sm shrink-0">
              <img
                src="/src/assets/images/restaurant_logo_1794344925528.jpg"
                alt="Portale Ristorante"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain rounded-xl"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#10B981] text-white px-2 py-0.5 rounded-full">
                  Direzione & HR
                </span>
                <span className="text-[11px] text-slate-300">Amministrazione</span>
              </div>
              <h1 className="text-xl font-extrabold text-white tracking-tight mt-0.5">
                Portale Gestione Dipendenti
              </h1>
              <p className="text-xs text-slate-300">Portale Ristorante • Staff & Contratti</p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1.5">
            <button
              onClick={onSwitchToEmployeeView}
              className="h-8 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 border border-white/10 transition-colors"
              title="Passa alla visualizzazione App del personale"
            >
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span>Vista Staff</span>
            </button>
            <button
              onClick={onLogout}
              className="text-[11px] text-red-300 hover:text-red-200 hover:underline"
            >
              Disconnetti Admin
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-4 gap-2 mt-4 pt-4 border-t border-white/10 relative z-10 text-center">
          <div className="bg-white/10 rounded-xl p-2">
            <div className="text-[10px] text-slate-300 uppercase font-bold">Dipendenti</div>
            <div className="text-lg font-black text-white">{employees.length}</div>
          </div>
          <div className="bg-white/10 rounded-xl p-2">
            <div className="text-[10px] text-slate-300 uppercase font-bold">In Sala</div>
            <div className="text-lg font-black text-emerald-400">
              {employees.filter((e) => e.department === 'Sala' || e.department === 'Bar').length}
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-2">
            <div className="text-[10px] text-slate-300 uppercase font-bold">In Cucina</div>
            <div className="text-lg font-black text-amber-300">
              {employees.filter((e) => e.department === 'Cucina' || e.department === 'Pizzeria').length}
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-2">
            <div className="text-[10px] text-slate-300 uppercase font-bold">Attivi</div>
            <div className="text-lg font-black text-white">
              {employees.filter((e) => e.status === 'attivo').length}
            </div>
          </div>
        </div>
      </div>

      {/* Main Mode Toggle: Elenco vs Distribuzione Turni (Workload) vs Registra Nuovo */}
      <div className="bg-[#F1F5F9] p-1 rounded-2xl flex gap-1">
        <button
          onClick={() => setActiveTab('elenco')}
          className={`flex-1 h-[44px] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'elenco'
              ? 'bg-white text-[#0F2744] shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span className="truncate">Staff ({employees.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('workload')}
          className={`flex-1 h-[44px] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'workload'
              ? 'bg-[#0F2744] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-emerald-400" />
          <span className="truncate">Carico Turni (30 gg)</span>
        </button>

        <button
          onClick={() => setActiveTab('nuovo')}
          className={`flex-1 h-[44px] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'nuovo'
              ? 'bg-[#10B981] text-white shadow-xs'
              : 'bg-white/50 text-[#065F46] hover:bg-white'
          }`}
        >
          <UserPlus className="w-4 h-4" />
          <span className="truncate">+ Nuovo Staff</span>
        </button>
      </div>

      {/* TAB 1: ELENCO STAFF & DIRECTORY */}
      {activeTab === 'elenco' && (
        <div className="space-y-3">
          {/* Search & Department Filters */}
          <div className="bg-white p-3 rounded-2xl border border-[rgba(15,39,68,0.06)] nordic-card-shadow space-y-2.5">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cerca dipendente per nome, ID o mansione..."
                className="w-full h-[44px] pl-10 pr-4 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs sm:text-sm text-[#0B192C] focus:outline-none focus:border-[#1E3A8A]"
              />
            </div>

            <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              {['Tutti', 'Sala', 'Cucina', 'Pizzeria', 'Bar', 'Amministrazione'].map((dept) => (
                <button
                  key={dept}
                  onClick={() => setSelectedDeptFilter(dept)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                    selectedDeptFilter === dept
                      ? 'bg-[#0F2744] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>

          {/* Staff Cards List */}
          <div className="space-y-2.5">
            {filteredEmployees.map((emp) => (
              <div
                key={emp.id}
                className="bg-white rounded-2xl p-4 border border-[rgba(15,39,68,0.06)] nordic-card-shadow transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={emp.avatar}
                      alt={emp.name}
                      className="w-13 h-13 rounded-2xl object-cover border-2 border-slate-100 shadow-2xs"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-bold text-[#0F2744]">{emp.name}</h3>
                        <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          {emp.id}
                        </span>
                      </div>
                      <div className="text-xs text-emerald-700 font-semibold mt-0.5">{emp.role}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span>Reparto: <strong>{emp.department}</strong></span>
                        <span>•</span>
                        <span>{emp.weeklyHours} t/uge</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${
                        emp.status === 'attivo'
                          ? 'bg-[#ECFDF5] text-[#065F46]'
                          : emp.status === 'ferie'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {emp.status === 'attivo' ? 'Attivo' : emp.status === 'ferie' ? 'In Ferie' : 'Non Attivo'}
                    </span>
                    <div className="text-xs font-bold text-[#0F2744] mt-1.5">
                      {emp.hourlyRate.toFixed(2)} kr./t
                    </div>
                  </div>
                </div>

                {/* Contract and Contact Meta */}
                <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                  <div className="flex items-center gap-1.5 truncate">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{emp.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{emp.phone}</span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">
                    Contratto: {emp.contractType}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setSelectedBadgeEmployee(emp)}
                      className="h-8 px-2.5 rounded-xl bg-[#eff4ff] hover:bg-[#dce9ff] text-[#0F2744] text-xs font-semibold flex items-center gap-1 transition-colors"
                      title="Visualizza tesserino aziendale"
                    >
                      <QrCode className="w-3.5 h-3.5 text-[#1E3A8A]" />
                      <span>Tesserino</span>
                    </button>

                    <button
                      onClick={() =>
                        onUpdateEmployeeStatus(
                          emp.id,
                          emp.status === 'attivo' ? 'ferie' : 'attivo'
                        )
                      }
                      className="h-8 px-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-medium transition-colors"
                    >
                      {emp.status === 'attivo' ? 'Metti in Ferie' : 'Rendi Attivo'}
                    </button>

                    <button
                      onClick={() => onRemoveEmployee(emp.id)}
                      className="w-8 h-8 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-colors"
                      title="Rimuovi dipendente"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredEmployees.length === 0 && (
              <div className="text-center p-8 bg-white rounded-2xl border border-slate-200">
                <Users className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <h4 className="text-sm font-semibold text-slate-700">Nessun dipendente trovato</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Modifica i filtri di ricerca o registra un nuovo membro dello staff.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: WORKLOAD DISTRIBUTION CHART (RECHARTS) */}
      {activeTab === 'workload' && (
        <WorkloadDistributionChart employees={employees} shifts={shifts} />
      )}

      {/* TAB 3: MODULO REGISTRAZIONE NUOVO DIPENDENTE */}
      {activeTab === 'nuovo' && (
        <form onSubmit={handleRegisterSubmit} className="bg-white rounded-3xl p-5 border border-[rgba(15,39,68,0.06)] nordic-card-shadow space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-[#0F2744]">Registrazione Nuovo Dipendente</h2>
              <p className="text-xs text-slate-500">Inserisci i dati anagrafici e contrattuali per Portale Ristorante</p>
            </div>
            <div className="w-9 h-9 rounded-2xl bg-[#ECFDF5] text-[#065F46] flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-[#10B981]" />
            </div>
          </div>

          {/* Nome e Cognome */}
          <div>
            <label className="block text-xs font-semibold text-[#0F2744] uppercase tracking-wider mb-1.5">
              Nome e Cognome Dipendente *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Es. Marco Ferrari"
              className="w-full h-[50px] px-4 rounded-2xl bg-[#F8FAFC] border border-[rgba(15,39,68,0.12)] text-sm text-[#0B192C] focus:outline-none focus:border-[#1E3A8A]"
            />
          </div>

          {/* Reparto e Ruolo */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#0F2744] uppercase tracking-wider mb-1.5">
                Reparto Operativo *
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value as any)}
                className="w-full h-[50px] px-3.5 rounded-2xl bg-[#F8FAFC] border border-[rgba(15,39,68,0.12)] text-xs sm:text-sm font-medium text-[#0B192C] focus:outline-none focus:border-[#1E3A8A]"
              >
                <option value="Sala">Servering & Sal (Sala)</option>
                <option value="Cucina">Køkken & Varmt parti (Cucina)</option>
                <option value="Pizzeria">Pizzeria & Ovn</option>
                <option value="Bar">Bar & Drikkevarer</option>
                <option value="Amministrazione">Administration & Kasse</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F2744] uppercase tracking-wider mb-1.5">
                Mansione / Ruolo *
              </label>
              <input
                type="text"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="F.eks. Tjener, Pizzaiolo, Kok..."
                className="w-full h-[50px] px-3.5 rounded-2xl bg-[#F8FAFC] border border-[rgba(15,39,68,0.12)] text-xs sm:text-sm font-medium text-[#0B192C] focus:outline-none focus:border-[#1E3A8A]"
              />
            </div>
          </div>

          {/* Contatti: Email & Telefono */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#0F2744] uppercase tracking-wider mb-1.5">
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="navn@portaleristorante.dk"
                className="w-full h-[50px] px-3.5 rounded-2xl bg-[#F8FAFC] border border-[rgba(15,39,68,0.12)] text-xs sm:text-sm text-[#0B192C] focus:outline-none focus:border-[#1E3A8A]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F2744] uppercase tracking-wider mb-1.5">
                Telefon (+45 Danmark) *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+45 20 12 34 56"
                className="w-full h-[50px] px-3.5 rounded-2xl bg-[#F8FAFC] border border-[rgba(15,39,68,0.12)] text-xs sm:text-sm text-[#0B192C] focus:outline-none focus:border-[#1E3A8A]"
              />
            </div>
          </div>

          {/* Contratto, Paga Oraria e Ore Settimanali */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[11px] font-semibold text-[#0F2744] uppercase tracking-wider mb-1.5">
                Ansættelsesform / Contratto
              </label>
              <select
                value={contractType}
                onChange={(e) => setContractType(e.target.value)}
                className="w-full h-[50px] px-2 rounded-2xl bg-[#F8FAFC] border border-[rgba(15,39,68,0.12)] text-xs font-medium text-[#0B192C] focus:outline-none focus:border-[#1E3A8A]"
              >
                <option value="Fastansat (Fuldtid 37 t)">Fastansat (37 t/uge)</option>
                <option value="Deltid (Faste timer)">Deltid (Faste timer)</option>
                <option value="Tilkald / Ekstratjener">Tilkald / Ekstra</option>
                <option value="Kokkeelev / Tjenerlærling">Kokke-/Tjenerlærling</option>
                <option value="Tempo Indeterminato">Tempo Indeterminato</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#0F2744] uppercase tracking-wider mb-1.5">
                Timeløn (kr./t)
              </label>
              <input
                type="number"
                step="1"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(parseFloat(e.target.value) || 0)}
                className="w-full h-[50px] px-3 rounded-2xl bg-[#F8FAFC] border border-[rgba(15,39,68,0.12)] text-sm font-bold text-[#0B192C] focus:outline-none focus:border-[#1E3A8A]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#0F2744] uppercase tracking-wider mb-1.5">
                Timer/Uge (Std. 37)
              </label>
              <input
                type="number"
                value={weeklyHours}
                onChange={(e) => setWeeklyHours(parseInt(e.target.value) || 37)}
                className="w-full h-[50px] px-3 rounded-2xl bg-[#F8FAFC] border border-[rgba(15,39,68,0.12)] text-sm font-bold text-[#0B192C] focus:outline-none focus:border-[#1E3A8A]"
              />
            </div>
          </div>

          {/* Selezione Avatar */}
          <div>
            <label className="block text-xs font-semibold text-[#0F2744] uppercase tracking-wider mb-2">
              Seleziona Foto Profilo Staff
            </label>
            <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
              {AVATAR_PRESETS.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`Avatar ${i}`}
                  onClick={() => setAvatar(url)}
                  className={`w-12 h-12 rounded-2xl object-cover cursor-pointer border-2 transition-all shrink-0 ${
                    avatar === url
                      ? 'border-[#10B981] ring-2 ring-[#10B981]/30 scale-105'
                      : 'border-slate-200 opacity-60 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Note & HACCP / Fødevarestyrelsen */}
          <div>
            <label className="block text-xs font-semibold text-[#0F2744] uppercase tracking-wider mb-1.5">
              Certificazioni & Fødevarestyrelsen Smiley (HACCP, Kursus)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="F.eks. Fødevarehygiejnecertifikat (Smiley), sommelier, førstehjælp"
              className="w-full h-[50px] px-4 rounded-2xl bg-[#F8FAFC] border border-[rgba(15,39,68,0.12)] text-xs text-[#0B192C] focus:outline-none focus:border-[#1E3A8A]"
            />
          </div>

          {/* Buttons */}
          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={() => setActiveTab('elenco')}
              className="flex-1 h-[52px] rounded-2xl border border-slate-300 text-slate-700 text-xs sm:text-sm font-semibold hover:bg-slate-50 transition-colors"
            >
              Annulla
            </button>
            <button
              type="submit"
              className="flex-1 h-[52px] rounded-2xl bg-[#10B981] hover:bg-[#059669] text-white text-xs sm:text-sm font-bold shadow-md flex items-center justify-center gap-2 android-tap transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              Salva e Genera Badge
            </button>
          </div>
        </form>
      )}

      {/* POPUP: MODALE TESSERINO / CREDENZIALI ONBOARDING */}
      {selectedBadgeEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col">
            {/* Badge Card Header */}
            <div className="bg-[#0F2744] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src="/src/assets/images/restaurant_logo_1794344925528.jpg"
                  alt="Portale Ristorante"
                  referrerPolicy="no-referrer"
                  className="w-7 h-7 rounded-full object-cover border border-white/20"
                />
                <div>
                  <h4 className="text-xs font-bold leading-tight">Portale Ristorante</h4>
                  <span className="text-[10px] text-emerald-400">Tesserino Aziendale Dipendente</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedBadgeEmployee(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Badge Body */}
            <div className="p-5 text-center space-y-3">
              <div className="relative inline-block mx-auto">
                <img
                  src={selectedBadgeEmployee.avatar}
                  alt={selectedBadgeEmployee.name}
                  className="w-20 h-20 rounded-3xl object-cover border-4 border-emerald-500 shadow-md mx-auto"
                />
                <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-[#10B981] border-2 border-white flex items-center justify-center text-[10px] font-bold text-white">
                  ✓
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black text-[#0F2744]">{selectedBadgeEmployee.name}</h3>
                <p className="text-xs font-bold text-emerald-700">{selectedBadgeEmployee.role}</p>
                <p className="text-[11px] text-slate-500">Reparto {selectedBadgeEmployee.department}</p>
              </div>

              {/* ID & PIN Info Box */}
              <div className="bg-[#F8FAFC] p-3 rounded-2xl border border-slate-200 grid grid-cols-2 gap-2 text-left">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">ID Dipendente</span>
                  <span className="font-mono font-bold text-xs text-[#0F2744]">
                    {selectedBadgeEmployee.id}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">PIN Primo Accesso</span>
                  <span className="font-mono font-bold text-xs text-emerald-700">
                    {selectedBadgeEmployee.pinCode || '8842'}
                  </span>
                </div>
              </div>

              {/* QR Code Simulation */}
              <div className="p-3 bg-white border border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center">
                <QrCode className="w-20 h-20 text-[#0F2744]" />
                <span className="text-[10px] text-slate-400 mt-1">Valido per timbratura cartellino e orari</span>
              </div>

              {/* Actions */}
              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => copyToClipboard(`ID: ${selectedBadgeEmployee.id} | PIN: ${selectedBadgeEmployee.pinCode || '8842'}`)}
                  className="flex-1 h-[46px] rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 flex items-center justify-center gap-1.5 transition-colors"
                >
                  {copiedPin ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPin ? 'Copiato!' : 'Copia Credenziali'}</span>
                </button>
                <button
                  onClick={() => {
                    alert(`Tesserino per ${selectedBadgeEmployee.name} pronto per la stampa o invio via email a ${selectedBadgeEmployee.email}.`);
                    setSelectedBadgeEmployee(null);
                  }}
                  className="flex-1 h-[46px] rounded-xl bg-[#0F2744] text-white text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 hover:bg-[#0A1C30] transition-colors"
                >
                  <Printer className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Stampa Tesserino</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
