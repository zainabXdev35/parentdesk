import { Download, Info } from 'lucide-react';
import { Card, FeeBadge, PageHeader, StatCard } from '../../components/ui.jsx';
import { Wallet, AlertTriangle } from 'lucide-react';
import { useChild, useSchool } from '../../context/SchoolContext.jsx';
import { pkr } from '../../data/mock.js';

export default function Fees() {
  const child = useChild();
  const { invoices } = useSchool();
  const rows = invoices.filter((i) => i.studentId === child.id);
  const due = rows.filter((r) => r.status !== 'paid').reduce((a, r) => a + r.amount, 0);
  const paid = rows.filter((r) => r.status === 'paid').reduce((a, r) => a + r.amount, 0);

  return (
    <>
      <PageHeader title="Fees" subtitle={`${child.name} · ${child.classId}`} />
      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard label="Outstanding" value={pkr(due)} hint={due ? 'Please clear at the school office' : 'You are all caught up'} icon={AlertTriangle} tone={due ? 'red' : 'brand'} />
        <StatCard label="Paid this session" value={pkr(paid)} icon={Wallet} />
      </div>

      <Card pad={false} className="mt-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50"><tr>{['Invoice', 'Description', 'Amount', 'Due', 'Status', ''].map((h) => <th key={h} className="th">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((r) => (
                <tr key={r.id}>
                  <td className="td font-mono text-xs text-slate-500">{r.id}</td>
                  <td className="td font-semibold">{r.term}</td>
                  <td className="td">{pkr(r.amount)}</td>
                  <td className="td text-slate-500">{r.due}</td>
                  <td className="td"><FeeBadge status={r.status} />{r.paidOn && <p className="mt-1 text-[11px] text-slate-400">on {r.paidOn}</p>}</td>
                  <td className="td text-right"><button className="btn-ghost !py-1.5" onClick={() => window.print()}><Download size={14} /> Receipt</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <p className="mt-4 flex items-center gap-2 text-xs text-slate-500"><Info size={14} /> Online payment is planned for a future release. For now, pay at the school office or by bank transfer.</p>
    </>
  );
}
