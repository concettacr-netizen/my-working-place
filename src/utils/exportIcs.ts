import { Shift } from '../types';

export const downloadIcsFile = (shifts: Shift[], filename = 'turni-portale-ristorante.ics') => {
  const formatDateToIcs = (dateStr: string, timeStr: string) => {
    const cleanDate = dateStr.replace(/-/g, '');
    const cleanTime = timeStr.replace(/:/g, '') + '00';
    return `${cleanDate}T${cleanTime}`;
  };

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Portale Ristorante//Vagtplan//DK',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Portale Ristorante - Turni',
    'X-WR-TIMEZONE:Europe/Copenhagen',
  ];

  shifts.forEach((shift) => {
    const dtStart = formatDateToIcs(shift.date, shift.startTime);
    const dtEnd = formatDateToIcs(shift.date, shift.endTime);
    const uid = `shift-${shift.id}-${shift.date}@portaleristorante.dk`;

    lines.push(
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${formatDateToIcs(new Date().toISOString().split('T')[0], '00:00')}Z`,
      `DTSTART:${dtStart}`,
      `DTEND:${dtEnd}`,
      `SUMMARY:Portale Ristorante - ${shift.role}`,
      `DESCRIPTION:Turno ${shift.department} (${shift.startTime}-${shift.endTime}). Pausa: ${shift.breakDurationMinutes} min.`,
      'LOCATION:Portale Ristorante, Danmark',
      'STATUS:CONFIRMED',
      'END:VEVENT'
    );
  });

  lines.push('END:VCALENDAR');
  const icsContent = lines.join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
