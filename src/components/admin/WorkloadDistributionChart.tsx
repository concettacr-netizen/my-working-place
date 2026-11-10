import React, { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import {
  Calendar,
  Clock,
  TrendingUp,
  Users,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Award,
  Layers,
  ArrowUpDown,
  Utensils,
  Code2,
  Copy,
  Check,
  X,
} from 'lucide-react';
import { Employee, Shift } from '../../types';

interface WorkloadDistributionChartProps {
  employees: Employee[];
  shifts?: Shift[];
}

interface EmployeeWorkloadStat {
  id: string;
  name: string;
  shortName: string;
  role: string;
  department: string;
  avatar: string;
  shiftsCount: number;
  totalHours: number;
  lunchShifts: number;
  dinnerShifts: number;
  weekendShifts: number;
  weeklyAvgHours: number;
  targetWeeklyHours: number;
  overtimeHours: number;
  status: 'bilanciato' | 'alto' | 'part_time';
}

const DEPT_COLORS: Record<string, string> = {
  Sala: '#0F2744',
  Cucina: '#059669',
  Pizzeria: '#D97706',
  Bar: '#7C3AED',
  Amministrazione: '#2563EB',
};

// Known baseline stats for default employees over the last 30 days
const BASELINE_30_DAYS: Record<string, { shifts: number; hours: number; lunch: number; dinner: number; weekend: number }> = {
  'EMP-8842': { shifts: 23, hours: 184, lunch: 6, dinner: 17, weekend: 7 }, // Marco (Caposala)
  'EMP-4219': { shifts: 21, hours: 168, lunch: 9, dinner: 12, weekend: 6 }, // Sofia (Chef)
  'EMP-3144': { shifts: 24, hours: 192, lunch: 4, dinner: 20, weekend: 8 }, // Matteo (Pizzaiolo)
  'EMP-6078': { shifts: 17, hours: 128, lunch: 2, dinner: 15, weekend: 5 }, // Elena (Bar)
  'EMP-2911': { shifts: 16, hours: 120, lunch: 10, dinner: 6, weekend: 4 }, // Luca (Commis)
};

export const WorkloadDistributionChart: React.FC<WorkloadDistributionChartProps> = ({
  employees,
}) => {
  const [selectedDept, setSelectedDept] = useState<string>('Tutti');
  const [viewMetric, setViewMetric] = useState<'shifts' | 'hours' | 'split'>('shifts');
  const [sortBy, setSortBy] = useState<'desc' | 'asc' | 'alpha'>('desc');
  const [showJsonModal, setShowJsonModal] = useState<boolean>(false);
  const [copiedJson, setCopiedJson] = useState<boolean>(false);

  // Compute workload statistics for all employees
  const workloadData: EmployeeWorkloadStat[] = useMemo(() => {
    return employees.map((emp) => {
      const baseline = BASELINE_30_DAYS[emp.id];
      const targetWeekly = emp.weeklyHours || 40;
      
      let shiftsCount: number;
      let totalHours: number;
      let lunchShifts: number;
      let dinnerShifts: number;
      let weekendShifts: number;

      if (baseline) {
        shiftsCount = baseline.shifts;
        totalHours = baseline.hours;
        lunchShifts = baseline.lunch;
        dinnerShifts = baseline.dinner;
        weekendShifts = baseline.weekend;
      } else {
        // Deterministic extrapolation for newly added employees based on weekly hours
        const factor = targetWeekly / 40;
        shiftsCount = Math.max(8, Math.round(20 * factor));
        totalHours = Math.round(shiftsCount * (targetWeekly <= 30 ? 6.5 : 8));
        lunchShifts = Math.round(shiftsCount * 0.4);
        dinnerShifts = shiftsCount - lunchShifts;
        weekendShifts = Math.round(shiftsCount * 0.3);
      }

      const weeklyAvgHours = Number((totalHours / 4.28).toFixed(1)); // 30 days ≈ 4.28 weeks
      const overtimeHours = Math.max(0, Number((weeklyAvgHours - targetWeekly).toFixed(1)));

      let status: 'bilanciato' | 'alto' | 'part_time' = 'bilanciato';
      if (shiftsCount >= 23 || overtimeHours > 3) {
        status = 'alto';
      } else if (shiftsCount < 16 || targetWeekly < 35) {
        status = 'part_time';
      }

      // Short name for clear X-axis labels
      const nameParts = emp.name.split(' ');
      const shortName = nameParts.length > 1
        ? `${nameParts[0]} ${nameParts[1].charAt(0)}.`
        : emp.name;

      return {
        id: emp.id,
        name: emp.name,
        shortName,
        role: emp.role,
        department: emp.department,
        avatar: emp.avatar,
        shiftsCount,
        totalHours,
        lunchShifts,
        dinnerShifts,
        weekendShifts,
        weeklyAvgHours,
        targetWeeklyHours: targetWeekly,
        overtimeHours,
        status,
      };
    });
  }, [employees]);

  // Filter & Sort
  const filteredData = useMemo(() => {
    let result = workloadData;
    if (selectedDept !== 'Tutti') {
      result = result.filter((item) => item.department === selectedDept);
    }

    return [...result].sort((a, b) => {
      if (sortBy === 'desc') {
        return viewMetric === 'hours'
          ? b.totalHours - a.totalHours
          : b.shiftsCount - a.shiftsCount;
      }
      if (sortBy === 'asc') {
        return viewMetric === 'hours'
          ? a.totalHours - b.totalHours
          : a.shiftsCount - b.shiftsCount;
      }
      return a.name.localeCompare(b.name);
    });
  }, [workloadData, selectedDept, viewMetric, sortBy]);

  // Aggregate KPI metrics
  const totalShiftsAssigned = useMemo(
    () => workloadData.reduce((acc, curr) => acc + curr.shiftsCount, 0),
    [workloadData]
  );
  const totalHoursWorked = useMemo(
    () => workloadData.reduce((acc, curr) => acc + curr.totalHours, 0),
    [workloadData]
  );
  const avgShiftsPerEmployee = useMemo(
    () => (workloadData.length > 0 ? (totalShiftsAssigned / workloadData.length).toFixed(1) : '0'),
    [totalShiftsAssigned, workloadData]
  );
  const highestWorkloadEmp = useMemo(() => {
    if (workloadData.length === 0) return null;
    return [...workloadData].sort((a, b) => b.shiftsCount - a.shiftsCount)[0];
  }, [workloadData]);

  // Department distribution pie data
  const departmentPieData = useMemo(() => {
    const counts: Record<string, number> = {};
    workloadData.forEach((d) => {
      counts[d.department] = (counts[d.department] || 0) + d.shiftsCount;
    });
    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
      color: DEPT_COLORS[name] || '#64748B',
    }));
  }, [workloadData]);

  // Full Workload JSON payload for inspection & integration
  const fullJsonPayload = useMemo(() => {
    return {
      restaurant: "Portale Ristorante",
      report: 'Distribuzione Carico di Lavoro (Workload Distribution)',
      period: 'Ultimi 30 giorni',
      generatedAt: new Date().toISOString(),
      summary: {
        totalEmployees: workloadData.length,
        totalShiftsAssigned,
        totalHoursWorked,
        averageShiftsPerEmployee: Number(avgShiftsPerEmployee),
        highestWorkloadEmployee: highestWorkloadEmp
          ? {
              id: highestWorkloadEmp.id,
              name: highestWorkloadEmp.name,
              department: highestWorkloadEmp.department,
              shifts: highestWorkloadEmp.shiftsCount,
              hours: highestWorkloadEmp.totalHours,
            }
          : null,
      },
      departmentBreakdown: departmentPieData,
      employees: workloadData.map((e) => ({
        id: e.id,
        name: e.name,
        role: e.role,
        department: e.department,
        shiftsCount: e.shiftsCount,
        totalHours: e.totalHours,
        lunchShifts: e.lunchShifts,
        dinnerShifts: e.dinnerShifts,
        weekendShifts: e.weekendShifts,
        weeklyAvgHours: e.weeklyAvgHours,
        targetWeeklyHours: e.targetWeeklyHours,
        overtimeHours: e.overtimeHours,
        workloadStatus: e.status,
      })),
    };
  }, [
    workloadData,
    totalShiftsAssigned,
    totalHoursWorked,
    avgShiftsPerEmployee,
    highestWorkloadEmp,
    departmentPieData,
  ]);

  const copyJsonToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(fullJsonPayload, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  // Custom Chart Tooltip safely guarded against null/undefined payload
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length && payload[0]?.payload) {
      const data: EmployeeWorkloadStat = payload[0].payload;
      if (!data || !data.name) return null;
      return (
        <div className="bg-[#0F2744] text-white p-3 rounded-2xl shadow-xl border border-white/10 text-xs space-y-1.5 min-w-[200px]">
          <div className="flex items-center gap-2 border-b border-white/10 pb-1.5">
            <img
              src={data.avatar}
              alt={data.name}
              className="w-6 h-6 rounded-full object-cover border border-white/30"
            />
            <div>
              <p className="font-bold text-white leading-tight">{data.name}</p>
              <p className="text-[10px] text-emerald-400">{data.role} ({data.department})</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <div>
              <span className="text-[10px] text-slate-300 block">Turni Totali (30 gg)</span>
              <span className="font-bold text-sm text-white">{data.shiftsCount} turni</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-300 block">Ore Totali</span>
              <span className="font-bold text-sm text-emerald-400">{data.totalHours} ore</span>
            </div>
          </div>

          <div className="pt-1.5 border-t border-white/10 text-[10px] text-slate-300 space-y-0.5">
            <div className="flex justify-between">
              <span>Pranzo / Cena:</span>
              <span className="font-medium text-white">{data.lunchShifts} pr. / {data.dinnerShifts} ce.</span>
            </div>
            <div className="flex justify-between">
              <span>Turni Weekend:</span>
              <span className="font-medium text-amber-300">{data.weekendShifts} turni</span>
            </div>
            <div className="flex justify-between">
              <span>Media settimanale:</span>
              <span className="font-medium text-white">{data.weeklyAvgHours}h / {data.targetWeeklyHours}h contr.</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      {/* Header & Subtitle */}
      <div className="bg-white rounded-3xl p-5 border border-[rgba(15,39,68,0.06)] nordic-card-shadow">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#eff4ff] text-[#1E3A8A] flex items-center justify-center shrink-0">
              <TrendingUp className="w-6 h-6 text-[#10B981]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#10B981] text-white px-2 py-0.5 rounded-full">
                  Analisi Recharts
                </span>
                <span className="text-xs text-slate-400">Ultimi 30 Giorni</span>
              </div>
              <h2 className="text-lg font-extrabold text-[#0F2744] tracking-tight mt-0.5">
                Distribuzione Carico di Lavoro (Workload)
              </h2>
              <p className="text-xs text-slate-500">
                Turni assegnati ed ore lavorate per dipendente a Portale Ristorante
              </p>
            </div>
          </div>

          {/* Quick Metrics Badges & JSON Inspection Button */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowJsonModal(true)}
              className="h-9 px-3 rounded-xl bg-[#0F2744] hover:bg-[#0A1C30] text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
              title="Ispeziona Payload JSON"
            >
              <Code2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Payload JSON</span>
            </button>

            <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Totale Turni</span>
              <span className="text-sm font-black text-[#0F2744]">{totalShiftsAssigned}</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-right">
              <span className="text-[10px] uppercase font-bold text-emerald-700 block">Media / Dipendente</span>
              <span className="text-sm font-black text-emerald-800">{avgShiftsPerEmployee}</span>
            </div>
          </div>
        </div>

        {/* 4 Summary Mini Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4 pt-4 border-t border-slate-100">
          <div className="p-3 bg-[#F8FAFC] rounded-2xl border border-slate-200">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-semibold mb-1">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              <span>Turni Coperti</span>
            </div>
            <div className="text-xl font-black text-[#0F2744]">{totalShiftsAssigned}</div>
            <span className="text-[10px] text-slate-400">negli ultimi 30 giorni</span>
          </div>

          <div className="p-3 bg-[#F8FAFC] rounded-2xl border border-slate-200">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-semibold mb-1">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Ore Lavorate</span>
            </div>
            <div className="text-xl font-black text-emerald-700">{totalHoursWorked} h</div>
            <span className="text-[10px] text-slate-400">su turni di sala & cucina</span>
          </div>

          <div className="p-3 bg-[#F8FAFC] rounded-2xl border border-slate-200">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-semibold mb-1">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>Punta di Carico</span>
            </div>
            <div className="text-sm font-black text-[#0F2744] truncate">
              {highestWorkloadEmp?.name || 'N/A'}
            </div>
            <span className="text-[10px] text-amber-600 font-bold">
              {highestWorkloadEmp?.shiftsCount} turni ({highestWorkloadEmp?.totalHours}h)
            </span>
          </div>

          <div className="p-3 bg-[#F8FAFC] rounded-2xl border border-slate-200">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-semibold mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
              <span>Indice Equità</span>
            </div>
            <div className="text-xl font-black text-[#10B981]">92%</div>
            <span className="text-[10px] text-slate-400">distribuzione omogenea</span>
          </div>
        </div>
      </div>

      {/* Controls Bar: Metric Toggle, Department Filter, Sort */}
      <div className="bg-white p-3.5 rounded-2xl border border-[rgba(15,39,68,0.06)] nordic-card-shadow space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          {/* Metric Selector Toggle */}
          <div className="bg-[#F1F5F9] p-1 rounded-xl flex gap-1">
            <button
              onClick={() => setViewMetric('shifts')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMetric === 'shifts'
                  ? 'bg-white text-[#0F2744] shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Turni Assegnati
            </button>
            <button
              onClick={() => setViewMetric('hours')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMetric === 'hours'
                  ? 'bg-white text-[#0F2744] shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Ore Lavorate
            </button>
            <button
              onClick={() => setViewMetric('split')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMetric === 'split'
                  ? 'bg-white text-[#0F2744] shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pranzo vs Cena
            </button>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#F8FAFC] border border-slate-200 rounded-xl px-2.5 py-1 text-xs font-medium text-slate-700 focus:outline-none"
            >
              <option value="desc">Carico più elevato ↓</option>
              <option value="asc">Carico più leggero ↑</option>
              <option value="alpha">Ordine Alfabetico</option>
            </select>
          </div>
        </div>

        {/* Department Chips Filter */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar pt-1">
          {['Tutti', 'Sala', 'Cucina', 'Pizzeria', 'Bar'].map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                selectedDept === dept
                  ? 'bg-[#0F2744] text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Main Recharts Chart Card */}
      <div className="bg-white rounded-3xl p-5 border border-[rgba(15,39,68,0.06)] nordic-card-shadow">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-[#0F2744]">
              {viewMetric === 'shifts'
                ? 'Turni Assegnati per Dipendente'
                : viewMetric === 'hours'
                ? 'Ore Lavorate Totali per Dipendente'
                : 'Ripartizione Turni: Servizio Pranzo vs Cena'}
            </h3>
            <span className="text-[11px] text-slate-400">
              Visualizzazione comparativa ultimi 30 giorni
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px]">
            {viewMetric === 'split' ? (
              <>
                <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                  Pranzo
                </span>
                <span className="inline-flex items-center gap-1 text-[#0F2744] font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0F2744]" />
                  Cena
                </span>
              </>
            ) : (
              <span className="text-slate-400 text-[10px]">
                {filteredData.length} collaboratori mostrati
              </span>
            )}
          </div>
        </div>

        {/* Recharts Responsive Container */}
        <div className="w-full h-[320px] pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={filteredData}
              margin={{ top: 15, right: 10, left: -20, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis
                dataKey="shortName"
                tick={{ fill: '#475569', fontSize: 11, fontWeight: 500 }}
                interval={0}
                angle={-15}
                textAnchor="end"
                stroke="#CBD5E1"
              />
              <YAxis
                tick={{ fill: '#64748B', fontSize: 11 }}
                stroke="#CBD5E1"
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />

              {viewMetric === 'shifts' && (
                <Bar
                  dataKey="shiftsCount"
                  name="Turni Assegnati"
                  fill="#0F2744"
                  radius={[8, 8, 0, 0]}
                  barSize={32}
                >
                  {filteredData.map((entry) => (
                    <Cell
                      key={`cell-${entry.id}`}
                      fill={
                        entry.status === 'alto'
                          ? '#D97706'
                          : DEPT_COLORS[entry.department] || '#0F2744'
                      }
                    />
                  ))}
                </Bar>
              )}

              {viewMetric === 'hours' && (
                <Bar
                  dataKey="totalHours"
                  name="Ore Lavorate"
                  fill="#059669"
                  radius={[8, 8, 0, 0]}
                  barSize={32}
                >
                  {filteredData.map((entry) => (
                    <Cell
                      key={`cell-hours-${entry.id}`}
                      fill={entry.status === 'alto' ? '#F59E0B' : '#059669'}
                    />
                  ))}
                </Bar>
              )}

              {viewMetric === 'split' && (
                <>
                  <Bar
                    dataKey="lunchShifts"
                    stackId="a"
                    name="Pranzo"
                    fill="#10B981"
                    radius={[0, 0, 0, 0]}
                    barSize={32}
                  />
                  <Bar
                    dataKey="dinnerShifts"
                    stackId="a"
                    name="Cena"
                    fill="#0F2744"
                    radius={[8, 8, 0, 0]}
                    barSize={32}
                  />
                </>
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend note */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0F2744]" /> Sala
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#059669]" /> Cucina
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]" /> Pizzeria
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#7C3AED]" /> Bar
            </span>
          </div>

          <span className="text-slate-400">
            💡 Suggerimento: tocca una barra per vedere il dettaglio completo
          </span>
        </div>
      </div>

      {/* Secondary Card: Workload Balance Breakdown & Table */}
      <div className="bg-white rounded-3xl p-5 border border-[rgba(15,39,68,0.06)] nordic-card-shadow space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-[#0F2744]">Riepilogo Carichi di Lavoro</h3>
            <p className="text-xs text-slate-400">Stato di saturazione turni per dipendente</p>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
            {filteredData.length} Dipendenti attivi
          </span>
        </div>

        {/* Detailed Table */}
        <div className="space-y-2">
          {filteredData.map((emp) => (
            <div
              key={emp.id}
              className="p-3 bg-[#F8FAFC] rounded-2xl border border-slate-200/80 hover:border-slate-300 transition-all flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={emp.avatar}
                  alt={emp.name}
                  className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-[#0F2744] truncate">{emp.name}</span>
                    <span className="text-[9px] font-mono font-bold text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                      {emp.id}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    {emp.role} • <strong>{emp.department}</strong>
                  </div>
                </div>
              </div>

              {/* Workload Stats & Badge */}
              <div className="flex items-center gap-3 shrink-0 text-right">
                <div>
                  <div className="text-xs font-black text-[#0F2744]">
                    {emp.shiftsCount} turni
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {emp.totalHours} ore ({emp.weeklyAvgHours}h/sett)
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 ${
                    emp.status === 'alto'
                      ? 'bg-amber-100 text-amber-800'
                      : emp.status === 'bilanciato'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {emp.status === 'alto'
                    ? 'Carico Alto'
                    : emp.status === 'bilanciato'
                    ? 'Bilanciato'
                    : 'Part-Time'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* JSON Payload Inspection Modal */}
      {showJsonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="bg-[#0F2744] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
                  <Code2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white leading-tight">
                    Payload JSON • Carico di Lavoro (30 Giorni)
                  </h4>
                  <p className="text-[10px] text-slate-300">
                    Formato strutturato valido per export, reporting e API
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowJsonModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body: JSON Code Viewer */}
            <div className="p-4 overflow-y-auto flex-1 bg-[#0B1526] font-mono text-xs">
              <pre className="text-emerald-400 whitespace-pre-wrap leading-relaxed select-all">
                {JSON.stringify(fullJsonPayload, null, 2)}
              </pre>
            </div>

            {/* Modal Footer: Copy & Close */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                {workloadData.length} record dipendenti • {totalShiftsAssigned} turni totali
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={copyJsonToClipboard}
                  className="h-10 px-4 rounded-xl bg-[#0F2744] hover:bg-[#0A1C30] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  {copiedJson ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Copiato negli appunti!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-slate-300" />
                      <span>Copia JSON</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setShowJsonModal(false)}
                  className="h-10 px-4 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors"
                >
                  Chiudi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
