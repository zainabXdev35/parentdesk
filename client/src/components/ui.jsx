import { useState, useCallback } from 'react';
import { X } from 'lucide-react';

export function PageHeader({ title, subtitle, children }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}

const tones = {
  green: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  amber: 'bg-amber-50 text-amber-700 ring-amber-200',
  red: 'bg-red-50 text-red-700 ring-red-200',
  blue: 'bg-sky-50 text-sky-700 ring-sky-200',
  slate: 'bg-slate-100 text-slate-600 ring-slate-200',
  brand: 'bg-brand-50 text-brand-700 ring-brand-200',
};
export const Badge = ({ tone = 'slate', children }) => (
  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${tones[tone]}`}>{children}</span>
);

export const feeTone = { paid: 'green', pending: 'amber', overdue: 'red' };
export const FeeBadge = ({ status }) => <Badge tone={feeTone[status]}>{status[0].toUpperCase() + status.slice(1)}</Badge>;

const iconTones = {
  brand: 'bg-brand-50 text-brand-600', amber: 'bg-amber-50 text-amber-600',
  red: 'bg-red-50 text-red-600', blue: 'bg-sky-50 text-sky-600',
};
export function StatCard({ label, value, hint, icon: Icon, tone = 'brand' }) {
  return (
    <div className="card flex items-start gap-4 p-5">
      <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${iconTones[tone]}`}><Icon size={22} /></div>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
        <p className="mt-0.5 truncate text-2xl font-extrabold">{value}</p>
        {hint && <p className="mt-0.5 text-xs text-slate-500">{hint}</p>}
      </div>
    </div>
  );
}

export const Card = ({ title, action, children, className = '', pad = true }) => (
  <section className={`card ${className}`}>
    {(title || action) && (
      <header className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <h2 className="text-sm font-bold">{title}</h2>{action}
      </header>
    )}
    <div className={pad ? 'p-5' : ''}>{children}</div>
  </section>
);

export const Empty = ({ text }) => <p className="py-10 text-center text-sm text-slate-400">{text}</p>;

export function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 p-4" onClick={onClose}>
      <div className="card w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold">{title}</h3>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100" aria-label="Close"><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

export const Tabs = ({ tabs, value, onChange }) => (
  <div className="inline-flex flex-wrap rounded-xl bg-slate-100 p-1">
    {tabs.map((t) => (
      <button key={t.value} onClick={() => onChange(t.value)}
        className={`rounded-lg px-3.5 py-1.5 text-sm font-semibold transition ${value === t.value ? 'bg-white text-ink shadow-sm' : 'text-slate-500 hover:text-ink'}`}>
        {t.label}{t.count != null && <span className="ml-1.5 text-xs text-slate-400">{t.count}</span>}
      </button>
    ))}
  </div>
);

export const Toast = ({ msg }) => msg ? (
  <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-ink px-4 py-3 text-sm font-medium text-white shadow-lg">{msg}</div>
) : null;

export function useToast() {
  const [msg, setMsg] = useState('');
  const show = useCallback((m) => { setMsg(m); setTimeout(() => setMsg(''), 2600); }, []);
  return [msg, show];
}
