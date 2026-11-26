import { Card, PageHeader, StatCard } from '../../components/ui.jsx';
import { CalendarCheck, UserX, Clock } from 'lucide-react';
import { useChild } from '../../context/SchoolContext.jsx';
import { MONTH, YEAR, attStats, monthDays } from './helpers.js';

const cell = {
  P: 'bg-brand-50 text-brand-700 border-brand-200', A: 'bg-red-50 text-red-700 border-red-200 font-bold',
  L: 'bg-amber-50 text-amber-700 border-amber-200', N: 'bg-white text-slate-500 border-dashed border-slate-300', W: 'bg-slate-50 text-slate-300 border-transparent', F: 'bg-white text-slate-300 border-slate-100',
};
const label = { P: 'Present', A: 'Absent', L: 'Late', N: 'Not marked yet', W: 'Weekend', F: '' };

export default function Attendance() {
  const child = useChild();
  const days = monthDays(child);
  const st = attStats(days);
  const offset = (new Date(YEAR, MONTH, 1).getDay() + 6) % 7; // Monday-first grid

  return (
    <>
      <PageHeader title="Attendance" subtitle={`${child.name} · {child.classId} · November 2026`} />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Attendance rate" value={`${st.pct}%`} hint={`${st.p} days present`} icon={CalendarCheck} />
        <StatCard label="Absent" value={st.a} hint={st.a >= 3 ? 'Flagged to administration' : 'Days this month'} icon={UserX} tone={st.a >= 3 ? 'red' : 'amber'} />
        <StatCard label="Late arrivals" value={st.l} hint="Counted as present" icon={Clock} tone="blue" />
      </div>

      <Card title="Calendar" className="mt-6">
        <div className="grid grid-cols-7 gap-2 text-center">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => <div key={d} className="pb-1 text-xs font-bold uppercase text-slate-400">{d}</div>)}
          {Array.from({ length: offset }).map((_, i) => <div key={'e' + i} />)}
          {days.map(({ d, s }) => (
            <div key={d} title={label[s]} className={`flex aspect-square flex-col items-center justify-center rounded-xl border text-sm ${cell[s]}`}>
              <span>{d}</span><span className="hidden text-[10px] font-semibold sm:block">{s === 'A' ? 'Absent' : s === 'L' ? 'Late' : s === 'N' ? 'Pending' : ''}</span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-slate-500">Parents are alerted by WhatsApp or SMS the moment their child is marked absent.</p>
      </Card>
    </>
  );
}
