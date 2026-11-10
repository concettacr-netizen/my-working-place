export type TabType = 'oversigt' | 'vagter' | 'stempelur' | 'beskeder' | 'profil';

export type ShiftStatus = 'bekræftet' | 'aktiv' | 'afventer' | 'ledig' | 'bytte_tilbudt' | 'gennemført';

export interface Shift {
  id: string;
  date: string; // YYYY-MM-DD
  dayLabel: string; // e.g. "I dag, 3. nov"
  startTime: string; // "14:30"
  endTime: string; // "22:30"
  durationHours: number; // 8.0
  breakDurationMinutes: number; // 30
  department: string; // "Logistik Hal 4"
  role: string; // "Truckfører & Koordinator"
  status: ShiftStatus;
  hourlyRateBonus?: number; // e.g. 125 for overtime/weekend
  swapRequestedWith?: string;
  notes?: string;
  assignedTo?: string; // Colleague name
}

export interface Employee {
  id: string; // e.g. "EMP-8842"
  name: string;
  role: string;
  department: 'Sala' | 'Cucina' | 'Pizzeria' | 'Bar' | 'Amministrazione';
  email: string;
  phone: string;
  hourlyRate: number;
  contractType:
    | 'Fastansat (Fuldtid 37 t)'
    | 'Deltid (Faste timer)'
    | 'Tilkald / Ekstratjener'
    | 'Kokkeelev / Tjenerlærling'
    | 'Tempo Indeterminato'
    | 'Tempo Determinato'
    | 'Chiamata / Extra'
    | 'Apprendistato'
    | string;
  weeklyHours: number;
  startDate: string;
  status: 'attivo' | 'ferie' | 'non_attivo';
  avatar: string;
  notes?: string;
  pinCode?: string;
}

export interface Colleague {
  id: string;
  name: string;
  role: string;
  avatar: string;
  phone: string;
  department: string;
  status: 'på_vagt' | 'kommer_senere' | 'fri' | 'sygemeldt';
  currentShift?: string;
}

export interface TimeEntry {
  id: string;
  date: string;
  dayName: string;
  checkIn: string;
  checkOut: string;
  breakDuration: string;
  nettoHours: number;
  approved: boolean;
  approvedBy?: string;
  location: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderRole?: string;
  isMe: boolean;
  text: string;
  timestamp: string;
  attachment?: {
    type: 'document' | 'shift';
    title: string;
    detail: string;
  };
}

export interface Channel {
  id: string;
  title: string;
  subtitle: string;
  unreadCount: number;
  avatar: string;
  isGroup: boolean;
  lastMessage: string;
  lastTime: string;
}

export interface Notice {
  id: string;
  title: string;
  category: 'Sikkerhed' | 'Drift' | 'HR' | 'Vigtigt';
  date: string;
  author: string;
  content: string;
  read: boolean;
  urgent?: boolean;
}

export interface UserProfile {
  name: string;
  idNumber: string;
  title: string;
  department: string;
  email: string;
  phone: string;
  startDate: string;
  contract: string;
  vacationDaysLeft: number;
  vacationDaysTotal: number;
  careDaysLeft: number; // Feriefridage
  timeBankHours: number; // Afspadsering
  weeklyStandardHours: number; // 37.0
  biometricEnabled: boolean;
  notificationsEnabled: boolean;
  reminderMinutesBeforeShift: number;
}

export interface Payslip {
  id: string;
  month: string;
  period: string;
  grossSalary: number;
  netPayout: number;
  taxAmount: number;
  amBidrag: number;
  pensionEmployer: number;
  pensionEmployee: number;
  overtimePayout: number;
  pdfUrl?: string;
}
