import { useState } from 'react';
import { Search } from 'lucide-react';
import { Card, PageHeader } from '../../components/ui.jsx';
import { useSchool } from '../../context/SchoolContext.jsx';

export default function AuditLog() {
  const { audit } = useSchool();
  const [q, setQ] = useState('');
  const rows = audit.filter((a) => [a.time, a.user, a.action, a.target].join(' ').toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <PageHeader title="Audit log" subtitle="Every sensitive action on student data is recorded." />
      <Card pad={false}>
        <div className="relative border-b border-slate-100 p-4">
          <Search size={16} className="absolute left-7 top-7 text-slate-400" />
          <input className="input !pl-9" placeholder="Filter by user, action or target…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50"><tr>{['Time', 'User', 'Action', 'Target'].map((h) => <th key={h} className="th">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((a) => (
                <tr key={a.id}><td className="td whitespace-nowrap text-slate-500">{a.time}</td><td className="td font-semibold">{a.user}</td><td className="td">{a.action}</td><td className="td text-slate-500">{a.target}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
