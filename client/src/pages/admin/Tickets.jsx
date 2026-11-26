import { useState } from 'react';
import { Send } from 'lucide-react';
import { Badge, Card, PageHeader, Toast, useToast } from '../../components/ui.jsx';
import { useSchool } from '../../context/SchoolContext.jsx';

export default function Tickets() {
  const { tickets: items, replyTicket } = useSchool();
  const [selId, setSel] = useState(null);
  const sel = selId ?? items[0]?.id;
  const [reply, setReply] = useState('');
  const [toast, show] = useToast();
  const t = items.find((x) => x.id === sel);
  if (!t) return <PageHeader title="Support tickets" subtitle="No tickets yet." />;

  const send = () => {
    if (!reply.trim()) return;
    // TODO(backend): POST /api/tickets/:id/reply
    replyTicket(sel, reply);
    setReply(''); show('Reply sent to parent');
  };

  return (
    <>
      <PageHeader title="Support tickets" subtitle="Questions the chatbot couldn't answer confidently are escalated here." />
      <div className="grid gap-6 lg:grid-cols-5">
        <Card pad={false} className="lg:col-span-2">
          <ul className="divide-y divide-slate-100">
            {items.map((x) => (
              <li key={x.id}>
                <button onClick={() => setSel(x.id)} className={`w-full px-5 py-4 text-left transition hover:bg-slate-50 ${sel === x.id ? 'bg-brand-50/60' : ''}`}>
                  <div className="flex items-center justify-between"><span className="font-mono text-xs text-slate-500">{x.id}</span><Badge tone={x.status === 'open' ? 'amber' : 'green'}>{x.status}</Badge></div>
                  <p className="mt-1.5 line-clamp-2 text-sm font-semibold">{x.question}</p>
                  <p className="mt-1 text-xs text-slate-500">{x.parent} · {x.date}</p>
                </button>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="lg:col-span-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t.id} · via {t.channel}</p>
              <p className="mt-1 font-bold">{t.parent} <span className="font-normal text-slate-500">· parent of {t.child}</span></p></div>
            <Badge tone={t.status === 'open' ? 'amber' : 'green'}>{t.status}</Badge>
          </div>
          <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm leading-relaxed">{t.question}</div>
          <p className="mt-2 text-xs text-slate-500">AI note: {t.note}</p>

          {t.reply && <div className="mt-5 ml-8 rounded-xl bg-brand-50 p-4 text-sm leading-relaxed"><p className="mb-1 text-xs font-bold text-brand-700">Your reply</p>{t.reply}</div>}
          {t.status === 'open' && (
            <div className="mt-5">
              <label className="label">Reply</label>
              <textarea rows={4} className="input resize-none" placeholder="Write a reply to the parent…" value={reply} onChange={(e) => setReply(e.target.value)} />
              <div className="mt-3 flex justify-end"><button className="btn-primary" onClick={send}><Send size={15} /> Send &amp; resolve</button></div>
            </div>
          )}
        </Card>
      </div>
      <Toast msg={toast} />
    </>
  );
}
