import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Card, FeeBadge, PageHeader, StatCard, Tabs, Toast, useToast } from '../../components/ui.jsx';
import { Wallet, Clock, AlertTriangle } from 'lucide-react';
import { pkr } from '../../data/mock.js';
import { useSchool } from '../../context/SchoolContext.jsx';

export default function Fees() {
  const { invoices, allStudents, markInvoicePaid } = useSchool();
  const rows = invoices.filter((i) => i.term === 'November 2026');
  const [tab, setTab] = useState('all');
  const [toast, show] = useToast();
  const name = (id) => allStudents.find((s) => s.id === id);
  const sum = (st) => rows.filter((r) => r.status === st).reduce((a, r) => a + r.amount, 0);
  const list = rows.filter((r) => tab === 'all' || r.status === tab);

  const markPaid = (id) => {
    // TODO(backend): PATCH /api/fees/:id { status: 'paid' }
    markInvoicePaid(id);
    show('Marked as paid. Parent portal updated.');
  };

  return (
    <>
      <PageHeader title="Fee management" subtitle="November 2026 · tuition invoices" />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Collected" value={pkr(sum('paid'))} icon={Wallet} />
        <StatCard label="Pending" value={pkr(sum('pending'))} icon={Clock} tone="amber" />
        <StatCard label="Overdue" value={pkr(sum('overdue'))} icon={AlertTriangle} tone="red" />
      </div>

      <div className="mt-6"><Tabs value={tab} onChange={setTab} tabs={[
        { value: 'all', label: 'All', count: rows.length },
        { value: 'overdue', label: 'Overdue', count: rows.filter((r) => r.status === 'overdue').length },
        { value: 'pending', label: 'Pending', count: rows.filter((r) => r.status === 'pending').length },
        { value: 'paid', label: 'Paid', count: rows.filter((r) => r.status === 'paid').length },
      ]} /></div>

      <Card pad={false} className="mt-4">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50"><tr>{['Invoice', 'Student', 'Amount', 'Due', 'Status', ''].map((h) => <th key={h} className="th">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-slate-100">
              {list.map((r) => { const s = name(r.studentId); return (
                <tr key={r.id} className="hover:bg-slate-50/60">
                  <td className="td font-mono text-xs text-slate-500">{r.id}</td>
                  <td className="td"><p className="font-semibold">{s?.name}</p><p className="text-xs text-slate-500">{s?.classId}</p></td>
                  <td className="td font-semibold">{pkr(r.amount)}</td>
                  <td className="td text-slate-500">{r.due}</td>
                  <td className="td"><FeeBadge status={r.status} /></td>
                  <td className="td text-right">{r.status !== 'paid' && <button className="btn-ghost !py-1.5" onClick={() => markPaid(r.id)}><CheckCircle2 size={15} /> Mark paid</button>}</td>
                </tr>); })}
            </tbody>
          </table>
        </div>
      </Card>
      <Toast msg={toast} />
    </>
  );
}
