import { useState } from 'react';
import { Check, MessageCircle, Sparkles, X } from 'lucide-react';
import { Badge, Card, Empty, PageHeader, Tabs, Toast, useToast } from '../../components/ui.jsx';
import { pkr } from '../../data/mock.js';
import { useSchool } from '../../context/SchoolContext.jsx';

export default function Reminders() {
  const { reminders: items, updateReminder, approveReminder, rejectReminder } = useSchool();
  const [tab, setTab] = useState('pending');
  const [toast, show] = useToast();
  const set = (id, patch) => updateReminder(id, patch);
  const count = (s) => items.filter((r) => r.status === s).length;

  const approve = (r) => {
    // TODO(backend): POST /api/reminders/:id/approve → triggers the n8n "send" workflow
    approveReminder(r.id); show(`Sent to ${r.parent} via ${r.channel}`);
  };

  return (
    <>
      <PageHeader title="Reminder approvals" subtitle="AI drafts the wording. You stay in control of what gets sent." />
      <Tabs value={tab} onChange={setTab} tabs={[
        { value: 'pending', label: 'Pending', count: count('pending') },
        { value: 'sent', label: 'Sent', count: count('sent') },
        { value: 'rejected', label: 'Rejected', count: count('rejected') },
      ]} />

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        {items.filter((r) => r.status === tab).map((r) => (
          <Card key={r.id}>
            <div className="flex items-start justify-between gap-3">
              <div><p className="font-bold">{r.student}</p><p className="text-sm text-slate-500">To {r.parent} · {pkr(r.amount)} · {r.days} days overdue</p></div>
              <Badge tone="brand"><Sparkles size={12} /> AI draft</Badge>
            </div>
            <label className="label mt-4">Message</label>
            <textarea rows={5} disabled={tab !== 'pending'} className="input resize-none leading-relaxed" value={r.draft} onChange={(e) => set(r.id, { draft: e.target.value })} />
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm"><MessageCircle size={16} className="text-slate-400" />
                <select disabled={tab !== 'pending'} className="input !w-auto !py-1.5" value={r.channel} onChange={(e) => set(r.id, { channel: e.target.value })}>
                  {['WhatsApp', 'SMS', 'Email'].map((c) => <option key={c}>{c}</option>)}</select></div>
              {tab === 'pending' && (
                <div className="flex gap-2">
                  <button className="btn-danger !py-1.5" onClick={() => rejectReminder(r.id)}><X size={15} /> Reject</button>
                  <button className="btn-primary !py-1.5" onClick={() => approve(r)}><Check size={15} /> Approve &amp; send</button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
      {!count(tab) && <Empty text={`No ${tab} reminders.`} />}
      <Toast msg={toast} />
    </>
  );
}
