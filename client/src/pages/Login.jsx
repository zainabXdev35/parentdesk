import { useState } from 'react';
import { Bot, BellRing, ShieldCheck, School, ShieldHalf, UsersRound, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useSchool } from '../context/SchoolContext.jsx';

const features = [
  { icon: Bot, t: 'AI chatbot with sources', d: 'Answers only from approved school documents.' },
  { icon: BellRing, t: 'Automated reminders', d: 'Fee and absence alerts on WhatsApp, SMS or email.' },
  { icon: ShieldCheck, t: 'Role-based access', d: 'Parents see only their own child.' },
];

export default function Login() {
  const { login } = useAuth();
  const { resetData } = useSchool();
  const [role, setRole] = useState('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!email.trim() || password.length < 4) return setError('Enter your email and a password of at least 4 characters.');
    login(role);
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-brand-900 p-12 text-white lg:flex">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-brand-700/60" />
        <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-brand-800" />
        <div className="relative flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-500"><School size={24} /></div>
          <span className="text-2xl font-extrabold">ParentDesk</span>
        </div>
        <div className="relative">
          <h2 className="max-w-md text-4xl font-extrabold leading-tight">The school front office that never sleeps.</h2>
          <p className="mt-4 max-w-md text-brand-200">AI-powered parent communication and fee management for Pakistani private schools.</p>
          <ul className="mt-10 space-y-5">
            {features.map(({ icon: Icon, t, d }) => (
              <li key={t} className="flex gap-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10"><Icon size={20} /></div>
                <div><p className="font-bold">{t}</p><p className="text-sm text-brand-200">{d}</p></div>
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-xs text-brand-300">Bright Future School, Lahore · Demo environment</p>
      </div>

      <div className="grid place-items-center p-6">
        <form onSubmit={submit} className="w-full max-w-sm">
          <h1 className="text-3xl font-extrabold">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-500">Sign in to continue to your portal.</p>

          <div className="mt-8 grid grid-cols-3 gap-3">
            {[{ v: 'admin', l: 'Admin', i: ShieldHalf }, { v: 'teacher', l: 'Teacher', i: BookOpen }, { v: 'parent', l: 'Parent', i: UsersRound }].map(({ v, l, i: Icon }) => (
              <button type="button" key={v} onClick={() => setRole(v)}
                className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-4 text-sm font-bold transition ${role === v ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                <Icon size={22} />{l}
              </button>
            ))}
          </div>

          <div className="mt-6 space-y-4">
            <div><label className="label" htmlFor="email">Email</label>
              <input id="email" className="input" type="email" placeholder="you@school.pk" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
            <div><label className="label" htmlFor="pw">Password</label>
              <input id="pw" className="input" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
          </div>
          {error && <p className="mt-3 text-sm font-medium text-red-600">{error}</p>}
          <button className="btn-primary mt-6 w-full !py-3" type="submit">Sign in as {{ admin: 'Administrator', teacher: 'Teacher', parent: 'Parent' }[role]}</button>
          <p className="mt-4 text-center text-xs text-slate-400">Demo mode: any email and password (4+ characters) works.</p>
          <button type="button" onClick={() => { resetData(); setError(''); }} className="mx-auto mt-2 block text-xs font-semibold text-brand-600 hover:underline">Reset demo data</button>
        </form>
      </div>
    </div>
  );
}
