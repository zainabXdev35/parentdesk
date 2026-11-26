import { useState } from 'react';
import { Bell, CalendarX, GraduationCap, Megaphone, Wallet } from 'lucide-react';
import { Badge, Card, PageHeader, Tabs } from '../../components/ui.jsx';
import { useChild, useMyChildren, useSchool } from '../../context/SchoolContext.jsx';

const icon = { fee: Wallet, absence: CalendarX, notice: Megaphone, result: GraduationCap };
const tone = { fee: 'bg-amber-50 text-amber-600', absence: 'bg-red-50 text-red-600', notice: 'bg-sky-50 text-sky-600', result: 'bg-brand-50 text-brand-600' };

export default function Notifications() {
  const child = useChild();
  const kids = useMyChildren();
  const { notifications: items, markRead } = useSchool();
  const [tab, setTab] = useState('all');
  const mine = items.filter((n) => n.studentId === child.id || n.studentId === null);
  const list = mine.filter((n) => tab === 'all' || n.type === tab);

  return (
    <>
      <PageHeader title="Notifications" subtitle="Everything the school has sent you by WhatsApp, SMS and email.">
        <button className="btn-ghost" onClick={() => markRead(kids.map((k) => k.id))}>Mark all as read</button>
      </PageHeader>
      <Tabs value={tab} onChange={setTab} tabs={[{ value: 'all', label: 'All' }, { value: 'fee', label: 'Fees' }, { value: 'absence', label: 'Absence' }, { value: 'notice', label: 'Notices' }, { value: 'result', label: 'Results' }]} />
      <Card pad={false} className="mt-5">
        <ul className="divide-y divide-slate-100">
          {list.map((n) => { const Icon = icon[n.type] ?? Bell; return (
            <li key={n.id} className={`flex gap-4 px-5 py-4 ${n.unread ? 'bg-brand-50/40' : ''}`}>
              <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${tone[n.type]}`}><Icon size={19} /></div>
              <div className="min-w-0 flex-1"><p className="text-sm font-bold">{n.title} {n.unread && <span className="ml-1 inline-block h-2 w-2 rounded-full bg-brand-500" />}</p>
                <p className="mt-0.5 text-sm text-slate-600">{n.body}</p></div>
              <div className="text-right"><p className="text-xs text-slate-400">{n.date}</p><div className="mt-1"><Badge>{n.channel}</Badge></div></div>
            </li>); })}
        </ul>
        {!list.length && <p className="py-10 text-center text-sm text-slate-400">Nothing here yet.</p>}
      </Card>
    </>
  );
}
