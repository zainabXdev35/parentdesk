import { Link } from 'react-router-dom';
import { Users, Wallet, AlertTriangle, LifeBuoy, ArrowRight, BellRing, CalendarCheck } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, PageHeader, StatCard, Badge } from '../../components/ui.jsx';
import { attTrend, feeTrend, pkr } from '../../data/mock.js';
import { useSchool } from '../../context/SchoolContext.jsx';

export default function Dashboard() {
  const { summary, invoices, audit, classes, pendingReminders, openTickets } = useSchool();
  const nov = invoices.filter((i) => i.term === 'November 2026');
  const sum = (st) => nov.filter((i) => i.status === st).reduce((a, i) => a + i.amount, 0);
  const overdueFamilies = nov.filter((i) => i.status === 'overdue').length;
  const flagged = summary.flaggedStudents;

  return (
    <>
      <PageHeader title="Good morning, Sana 👋" subtitle="Here is what needs your attention at Bright Future School today." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Students" value={summary.totalStudents} hint={`${classes.length} classes · ${summary.markedClassesCount}/${summary.totalClassesCount} marked today`} icon={Users} />
        <StatCard label="Collected (Nov)" value={pkr(sum('paid'))} hint={`${nov.filter((i) => i.status === 'paid').length} of ${nov.length} invoices`} icon={Wallet} tone="blue" />
        <StatCard label="Overdue fees" value={pkr(sum('overdue'))} hint={`${overdueFamilies} families`} icon={AlertTriangle} tone="red" />
        <StatCard label="Open tickets" value={openTickets} hint="Chatbot couldn't answer" icon={LifeBuoy} tone="amber" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card title="Fee collection (PKR millions)" className="lg:col-span-2">
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={feeTrend} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8eeec" />
                <XAxis dataKey="m" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} width={30} />
                <Tooltip cursor={{ fill: '#f4f7f6' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="collected" name="Collected" fill="#1f9d7a" radius={[6, 6, 0, 0]} />
                <Bar dataKey="pending" name="Pending" fill="#f5b942" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Approvals waiting" action={<Link to="/admin/reminders" className="text-xs font-semibold text-brand-600">Review</Link>}>
          <div className="flex items-center gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-600"><BellRing size={26} /></div>
            <div><p className="text-3xl font-extrabold">{pendingReminders}</p><p className="text-sm text-slate-500">AI-drafted fee reminders</p></div>
          </div>
          <p className="mt-4 rounded-xl bg-slate-50 p-3 text-xs text-slate-500">The n8n workflow drafts these every morning at 8:00. Nothing is sent until you approve.</p>
          <Link to="/admin/reminders" className="btn-primary mt-4 w-full">Review drafts <ArrowRight size={16} /></Link>
        </Card>

        <Card title="Attendance today, by class">
          <ul className="space-y-3">
            {classes.map((c) => {
              const absent = c.students.filter((s) => s.status === 'Absent').length;
              return (
                <li key={c.id} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                  <div><p className="text-sm font-bold">{c.id}</p><p className="text-xs text-slate-500">{c.submittedToday ? `${absent} absent · ${c.students.length - absent} present` : 'Waiting for teacher'}</p></div>
                  <Badge tone={c.submittedToday ? 'green' : 'amber'}><CalendarCheck size={12} />{c.submittedToday ? 'Marked' : 'Pending'}</Badge>
                </li>
              );
            })}
          </ul>
          <div className="mt-4 h-28">
            <ResponsiveContainer>
              <LineChart data={attTrend}>
                <XAxis dataKey="w" hide /><YAxis domain={[80, 100]} hide /><Tooltip />
                <Line type="monotone" dataKey="pct" name="School-wide %" stroke="#1f9d7a" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Flagged students" action={<Badge tone="red">3+ absences</Badge>}>
          {flagged.length === 0 ? <p className="py-6 text-center text-sm text-slate-400">No students flagged.</p> : (
            <ul className="divide-y divide-slate-100">
              {flagged.map((s) => (
                <li key={s.id} className="flex items-center justify-between py-2.5">
                  <div><p className="text-sm font-semibold">{s.name}</p><p className="text-xs text-slate-500">{s.classId} · {s.parent}</p></div>
                  <span className="text-sm font-bold text-red-600">{s.absences} absences</span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Recent activity" action={<Link to="/admin/audit" className="text-xs font-semibold text-brand-600">View all</Link>}>
          <ul className="space-y-3">
            {audit.slice(0, 5).map((a) => (
              <li key={a.id} className="text-sm">
                <p className="font-semibold">{a.action}</p>
                <p className="text-xs text-slate-500">{a.target} · {a.user} · {a.time}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}
