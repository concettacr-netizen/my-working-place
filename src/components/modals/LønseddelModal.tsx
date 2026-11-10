import React from 'react';
import { X, Download, FileText, CheckCircle, ShieldCheck, Printer } from 'lucide-react';
import { Payslip, UserProfile } from '../../types';

interface LønseddelModalProps {
  isOpen: boolean;
  onClose: () => void;
  payslip: Payslip;
  userProfile: UserProfile;
  onDownload: () => void;
}

export const LønseddelModal: React.FC<LønseddelModalProps> = ({
  isOpen,
  onClose,
  payslip,
  userProfile,
  onDownload,
}) => {
  if (!isOpen) return null;

  const formatDkk = (val: number) =>
    new Intl.NumberFormat('da-DK', { style: 'currency', currency: 'DKK', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#0F2744] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-[#6cf8bb]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold leading-snug">Lønseddel: {payslip.month}</h3>
              <p className="text-xs text-slate-300">Periode: {payslip.period}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-[#0B192C]">
          {/* Company & Employee Identity Banner */}
          <div className="p-4 bg-[#F8FAFC] rounded-2xl border border-slate-200 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500 font-medium">Medarbejder</div>
              <div className="text-sm font-bold text-[#0F2744]">{userProfile.name}</div>
              <div className="text-xs text-slate-600">CPR / ID: {userProfile.idNumber}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500 font-medium">Virksomhed</div>
              <div className="text-sm font-bold text-[#0F2744]">Nordic Logistics A/S</div>
              <div className="text-xs text-slate-600">CVR: 38291044</div>
            </div>
          </div>

          {/* Payout Hero Card */}
          <div className="p-4 bg-[#ECFDF5] border border-[#A7F3D0] rounded-2xl text-center">
            <div className="text-xs font-semibold text-[#065F46] uppercase tracking-wider">
              Nettoløn til udbetaling på NemKonto
            </div>
            <div className="text-3xl font-extrabold text-[#065F46] my-1">
              {formatDkk(payslip.netPayout)}
            </div>
            <div className="text-xs text-[#065F46]/80 flex items-center justify-center gap-1.5 mt-1">
              <CheckCircle className="w-3.5 h-3.5" /> Overført d. 30. {payslip.month.toLowerCase()}
            </div>
          </div>

          {/* Financial Breakdown Table */}
          <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
            <div className="p-3 bg-[#F1F5F9] text-xs font-bold text-[#0F2744] uppercase tracking-wider">
              Lønspecifikation & Satser
            </div>
            <div className="p-3.5 flex justify-between text-sm">
              <span className="text-slate-600">Grundløn (160,33 timer á 205 kr)</span>
              <span className="font-semibold text-slate-900">{formatDkk(payslip.grossSalary - payslip.overtimePayout)}</span>
            </div>
            <div className="p-3.5 flex justify-between text-sm bg-emerald-50/50">
              <span className="text-emerald-900">Overarbejde / Tillæg (Aften & Weekend)</span>
              <span className="font-semibold text-emerald-900">+{formatDkk(payslip.overtimePayout)}</span>
            </div>
            <div className="p-3.5 flex justify-between text-sm font-bold bg-slate-50">
              <span className="text-[#0F2744]">Bruttoløn i alt</span>
              <span className="text-[#0F2744]">{formatDkk(payslip.grossSalary)}</span>
            </div>
            <div className="p-3.5 flex justify-between text-sm text-red-600">
              <span>AM-bidrag (8%)</span>
              <span>-{formatDkk(payslip.amBidrag)}</span>
            </div>
            <div className="p-3.5 flex justify-between text-sm text-red-600">
              <span>A-skat (Trækprocent 38% efter fradrag)</span>
              <span>-{formatDkk(payslip.taxAmount)}</span>
            </div>
          </div>

          {/* Pension & Fritvalg Box */}
          <div className="grid grid-cols-2 gap-3 p-3.5 bg-[#eff4ff] rounded-2xl border border-blue-100 text-xs">
            <div>
              <div className="font-semibold text-[#0F2744]">Pension (Industriens Pension)</div>
              <div className="text-slate-600 mt-1">Arbejdsgiver (10%): {formatDkk(payslip.pensionEmployer)}</div>
              <div className="text-slate-600">Eget bidrag (2%): {formatDkk(payslip.pensionEmployee)}</div>
            </div>
            <div>
              <div className="font-semibold text-[#0F2744]">Fritvalgskonto</div>
              <div className="text-slate-600 mt-1">Saldo opsparet: 14.850 kr</div>
              <div className="text-slate-600">Feriepenge optjent: 2,08 dg/md</div>
            </div>
          </div>

          {/* Compliance Stamp */}
          <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Digitalt signeret og overført jf. dansk overenskomstpraksis.</span>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 h-[52px] rounded-2xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors"
            >
              Luk
            </button>
            <button
              onClick={onDownload}
              className="flex-1 h-[52px] rounded-2xl bg-[#0F2744] hover:bg-[#0A1C30] text-white text-sm font-semibold shadow-md flex items-center justify-center gap-2 android-tap transition-colors"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
