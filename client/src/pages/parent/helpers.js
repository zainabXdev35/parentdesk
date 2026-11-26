import { TODAY } from '../../data/mock.js';

// Month grid for a student, built from the shared attendance history that teachers write.
// P present · A absent · L late · W weekend · F future · N today, not marked yet
export const YEAR = 2026, MONTH = 10;
export function monthDays(student) {
  const total = new Date(YEAR, MONTH + 1, 0).getDate();
  return Array.from({ length: total }, (_, i) => {
    const d = i + 1, dow = new Date(YEAR, MONTH, d).getDay();
    let s;
    if (d > TODAY) s = 'F';
    else if (dow === 0 || dow === 6) s = 'W';
    else s = student.history?.[d] ?? (d === TODAY ? 'N' : 'P');
    return { d, s };
  });
}
export const attStats = (days) => {
  const c = (k) => days.filter((x) => x.s === k).length;
  const p = c('P'), a = c('A'), l = c('L');
  return { p, a, l, pct: Math.round(((p + l) / Math.max(p + a + l, 1)) * 100) };
};
