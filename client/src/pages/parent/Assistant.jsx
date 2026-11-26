import { useEffect, useRef, useState } from 'react';
import { Bot, FileText, LifeBuoy, Send, User } from 'lucide-react';
import { useChild, useSchool } from '../../context/SchoolContext.jsx';
import { knowledge } from '../../data/mock.js';

const suggestions = ['Fee kab due hai?', 'What are the school timings?', 'When do winter vacations start?', 'Uniform policy?'];

// TODO(backend): replace with POST /api/chat { question } → { answer, sources[], confidence }.
// The server runs the RAG pipeline (embed → Atlas Vector Search → LLM) and returns a ticket id when unsure.
const ask = (q) => {
  const text = q.toLowerCase();
  const hit = knowledge.find((k) => k.keys.some((w) => text.includes(w)));
  return hit ? { answer: hit.answer, source: hit.source } : null;
};

export default function Assistant() {
  const child = useChild();
  const { addTicket } = useSchool();
  const [msgs, setMsgs] = useState([{ from: 'bot', text: `Assalam-o-Alaikum! I can answer questions about ${child.name}'s school from approved documents. Urdu, Roman Urdu and English are all fine.` }]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const end = useRef();
  useEffect(() => { end.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs, busy]);

  const send = (q) => {
    const text = (q ?? input).trim(); if (!text || busy) return;
    setMsgs((m) => [...m, { from: 'me', text }]); setInput(''); setBusy(true);
    setTimeout(() => {
      const r = ask(text);
      // Unanswered → escalate: creates a ticket in the shared store, visible to the admin.
      const ticket = r ? null : addTicket({ studentId: child.id, parent: child.parent, child: child.name, question: text, note: 'No matching approved document found.' });
      setMsgs((m) => [...m, r ? { from: 'bot', text: r.answer, source: r.source }
        : { from: 'bot', ticket, text: "I couldn't find a reliable answer in the approved school documents, so I've passed your question to the school office. They will reply to you soon." }]);
      setBusy(false);
    }, 900);
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-11rem)] max-w-3xl flex-col">
      <div className="mb-4"><h1 className="text-2xl font-extrabold tracking-tight">Ask ParentDesk</h1>
        <p className="mt-1 text-sm text-slate-500">Answers come only from documents approved by the school, and every answer shows its source.</p></div>

      <div className="card flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {msgs.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.from === 'me' ? 'flex-row-reverse' : ''}`}>
              <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${m.from === 'me' ? 'bg-slate-200 text-slate-600' : 'bg-brand-600 text-white'}`}>{m.from === 'me' ? <User size={16} /> : <Bot size={16} />}</div>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${m.from === 'me' ? 'rounded-tr-sm bg-brand-600 text-white' : 'rounded-tl-sm bg-slate-100'}`}>
                {m.text}
                {m.source && <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1.5 text-xs font-medium text-slate-500"><FileText size={13} className="text-brand-600" />{m.source}</div>}
                {m.ticket && <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1.5 text-xs font-semibold text-amber-700"><LifeBuoy size={13} />Ticket {m.ticket} created</div>}
              </div>
            </div>
          ))}
          {busy && <div className="flex gap-3"><div className="grid h-8 w-8 place-items-center rounded-full bg-brand-600 text-white"><Bot size={16} /></div>
            <div className="flex items-center gap-1 rounded-2xl bg-slate-100 px-4 py-3">{[0, 1, 2].map((d) => <i key={d} className="h-2 w-2 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: `${d * 120}ms` }} />)}</div></div>}
          <div ref={end} />
        </div>

        <div className="border-t border-slate-100 p-4">
          <div className="mb-3 flex flex-wrap gap-2">
            {suggestions.map((s) => <button key={s} onClick={() => send(s)} className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 hover:border-brand-400 hover:text-brand-700">{s}</button>)}
          </div>
          <div className="flex gap-2">
            <input className="input" placeholder="Type your question…" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} />
            <button className="btn-primary" onClick={() => send()} disabled={busy} aria-label="Send"><Send size={16} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
