import { Link } from 'react-router-dom';
import { Bot, CalendarCheck, GraduationCap, Wallet, ArrowRight, AlertCircle, CalendarX } from 'lucide-react';
import { Card, PageHeader, StatCard } from '../../components/ui.jsx';
import { useChild, useMyChildren, useSchool } from '../../context/SchoolContext.jsx';
import { TEACHER, pkr } from '../../data/mock.js';
import { attStats, monthDays } from './helpers.js';

const dot = { P: 'bg-brand-500', A: 'bg-red-500', L: 'bg-amber-400', W: 'bg-slate-200', F: 'bg-slate-100', N: 'bg-white ring-2 ring-slate-300' };

export default function Dashboard() {
  const child = useChild();
  const kids = useMyChildren();
  const { invoices, notifications } = useSchool();
  const days = monthDays(child);
  const st = attStats(days);
  const due = invoices.filter((i) => i.studentId === child.id && i.status !== 'paid');
  const owed = due.reduce((a, i) => a + i.amount, 0);
  const marked = child.quiz1 || child.midterm;
  const ids = kids.map((k) => k.id);
  const alerts = notifications.filter((n) => n.studentId === child.id || n.studentId === null).slice(0, 4);
  const today = days.find((x) => x.s !== 'F' && x.d === days.filter((y) => y.s !== 'F').length);
  const approved = child.commentStatus === 'approved' ? child.commentText : null;

  return (
    <>
      <PageHeader title={`${child.name}'s overview`} subtitle={`${child.classId} · Roll ${child.roll} · Class teacher: ${TEACHER.name} (${TEACHER.subject})`} />

      {child.absences >= 3 && (
        <div className="mb-4 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <AlertCircle size={20} className="mt-0.5 shrink-0" />
          <p><b>{child.name} has {child.absences} recorded absences.</b> The school administration has been notified. Please contact the class teacher if there is a reason.</p>
        </div>
      )}
      {today?.s === 'A' && (
        <div className="mb-4 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <CalendarX size={20} className="mt-0.5 shrink-0" /><p><b>{child.name} was marked absent today.</b> You were alerted on WhatsApp.</p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Attendance" value={`${st.pct}%`} hint={`${st.a} absent · ${st.l} late this month`} icon={CalendarCheck} tone={st.pct >= 85 ? 'brand' : 'red'} />
        <StatCard label="Fee due" value={owed ? pkr(owed) : 'All clear'} hint={owed ? 'Overdue since 10 Nov' : 'No pending invoices'} icon={Wallet} tone={owed ? 'red' : 'brand'} />
        <StatCard label="Mathematics avg" value={marked ? `${child.avg}%` : '—'} hint="Quiz 1 + Midterm" icon={GraduationCap} tone="blue" />
        <Link to="/parent/assistant" className="card flex items-center gap-4 bg-brand-600 p-5 text-white transition hover:bg-brand-700">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-white/15"><Bot size={22} /></div>
          <div className="flex-1"><p className="font-bold">Ask ParentDesk</p><p className="text-xs text-brand-100">Fee kab due hai?</p></div><ArrowRight size={18} />
        </Link>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card title="This month at a glance" className="lg:col-span-2" action={<Link to="/parent/attendance" className="text-xs font-semibold text-brand-600">Full calendar</Link>}>
          <div className="flex flex-wrap gap-1.5">
            {days.map(({ d, s }) => <div key={d} title={`${d} Nov`} className={`grid h-8 w-8 place-items-center rounded-lg text-[11px] font-bold ${dot[s]} ${s === 'P' || s === 'A' ? 'text-white' : 'text-slate-500'}`}>{d}</div>)}
          </div>
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500">
            {[['Present', 'bg-brand-500'], ['Absent', 'bg-red-500'], ['Late', 'bg-amber-400'], ['Weekend', 'bg-slate-200']].map(([l, c]) => <span key={l} className="flex items-center gap-1.5"><i className={`h-2.5 w-2.5 rounded-full ${c}`} />{l}</span>)}
          </div>
          <div className="mt-6 rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Latest teacher comment</p>
            {approved ? (<>
              <p className="mt-2 text-sm leading-relaxed">{approved}</p>
              <p className="mt-2 text-xs text-slate-500">— {TEACHER.name}</p>
            </>) : <p className="mt-2 text-sm text-slate-400">No comment has been shared yet. You will be notified when your child's teacher approves one.</p>}
          </div>
        </Card>

        <Card title="Recent alerts" action={<Link to="/parent/notifications" className="text-xs font-semibold text-brand-600">All</Link>}>
          <ul className="space-y-4">
            {alerts.map((n) => (
              <li key={n.id} className="flex gap-3">
                <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.unread ? 'bg-brand-500' : 'bg-slate-300'}`} />
                <div><p className="text-sm font-semibold">{n.title}</p><p className="text-xs leading-relaxed text-slate-500">{n.body}</p><p className="mt-0.5 text-[11px] text-slate-400">{n.date} · {n.channel}</p></div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}
