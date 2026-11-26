import { useRef, useState } from 'react';
import { CheckCircle2, FileText, Loader2, Trash2, UploadCloud } from 'lucide-react';
import { Badge, Card, PageHeader, Toast, useToast } from '../../components/ui.jsx';
import { documents as seed } from '../../data/mock.js';

const steps = ['Upload', 'Extract text', 'Split into chunks', 'Create embeddings', 'Ready'];

export default function Documents() {
  const [docs, setDocs] = useState(seed);
  const [drag, setDrag] = useState(false);
  const [toast, show] = useToast();
  const ref = useRef();

  const addFiles = (files) => {
    [...files].forEach((f) => {
      if (!f.name.toLowerCase().endsWith('.pdf')) return show('Only PDF files are supported');
      const id = 'u' + Date.now() + Math.random();
      const doc = { id, name: f.name, type: 'Document', size: (f.size / 1024).toFixed(0) + ' KB', date: 'Today', status: 'Processing', chunks: 0 };
      setDocs((d) => [doc, ...d]);
      // TODO(backend): POST /api/documents (multipart/form-data via Multer). Server runs pdf-parse → chunks → embeddings → Atlas Vector Search.
      setTimeout(() => setDocs((d) => d.map((x) => (x.id === id ? { ...x, status: 'Ready', chunks: Math.ceil(f.size / 4000) } : x))), 3000);
    });
  };

  return (
    <>
      <PageHeader title="Knowledge base" subtitle="The chatbot answers only from these approved documents." />

      <div onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); addFiles(e.dataTransfer.files); }}
        onClick={() => ref.current.click()}
        className={`cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition ${drag ? 'border-brand-500 bg-brand-50' : 'border-slate-300 bg-white hover:border-brand-400'}`}>
        <input ref={ref} type="file" accept="application/pdf" multiple hidden onChange={(e) => addFiles(e.target.files)} />
        <UploadCloud className="mx-auto text-brand-500" size={36} />
        <p className="mt-3 font-bold">Drop PDFs here or click to browse</p>
        <p className="mt-1 text-sm text-slate-500">Handbooks, fee policies, timetables, circulars</p>
      </div>

      <ol className="my-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold text-slate-500">
        {steps.map((s, i) => <li key={s} className="flex items-center gap-2"><span className="grid h-5 w-5 place-items-center rounded-full bg-brand-100 text-[10px] text-brand-700">{i + 1}</span>{s}{i < steps.length - 1 && <span className="text-slate-300">→</span>}</li>)}
      </ol>

      <Card pad={false}>
        <ul className="divide-y divide-slate-100">
          {docs.map((d) => (
            <li key={d.id} className="flex items-center gap-4 px-5 py-4">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-red-50 text-red-500"><FileText size={20} /></div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{d.name}</p>
                <p className="text-xs text-slate-500">{d.type} · {d.size} · {d.date}{d.chunks ? ` · ${d.chunks} chunks` : ''}</p>
              </div>
              {d.status === 'Ready'
                ? <Badge tone="green"><CheckCircle2 size={12} /> Ready</Badge>
                : <Badge tone="amber"><Loader2 size={12} className="animate-spin" /> Processing</Badge>}
              <button onClick={() => { setDocs(docs.filter((x) => x.id !== d.id)); show('Document removed'); }} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600" aria-label="Delete"><Trash2 size={17} /></button>
            </li>
          ))}
        </ul>
      </Card>
      <Toast msg={toast} />
    </>
  );
}
