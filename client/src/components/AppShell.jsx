import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, Wallet, BellRing, FileText, LifeBuoy, ScrollText, CalendarCheck,
  GraduationCap, Bot, Bell, LogOut, Menu, X, School, ClipboardList, Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useSchool, useMyChildren } from '../context/SchoolContext.jsx';

const NAV = {
  admin: [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/students', label: 'Students', icon: Users },
    { to: '/admin/fees', label: 'Fees', icon: Wallet },
    { to: '/admin/reminders', label: 'Reminder Approvals', icon: BellRing, badge: 'reminders' },
    { to: '/admin/documents', label: 'Knowledge Base', icon: FileText },
    { to: '/admin/tickets', label: 'Support Tickets', icon: LifeBuoy, badge: 'tickets' },
    { to: '/admin/audit', label: 'Audit Log', icon: ScrollText },
  ],
  teacher: [
    { to: '/teacher', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/teacher/attendance', label: 'Attendance', icon: CalendarCheck },
    { to: '/teacher/marks', label: 'Marks', icon: ClipboardList },
    { to: '/teacher/comments', label: 'AI Comments', icon: Sparkles, badge: 'review' },
    { to: '/teacher/students', label: 'My Students', icon: Users },
  ],
  parent: [
    { to: '/parent', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/parent/attendance', label: 'Attendance', icon: CalendarCheck },
    { to: '/parent/fees', label: 'Fees', icon: Wallet },
    { to: '/parent/progress', label: 'Progress', icon: GraduationCap },
    { to: '/parent/assistant', label: 'Ask ParentDesk', icon: Bot },
    { to: '/parent/notifications', label: 'Notifications', icon: Bell },
  ],
};

function Sidebar({ items, onNavigate }) {
  const { user, logout } = useAuth();
  const { summary, pendingReminders, openTickets } = useSchool();
  const counts = { review: summary.reviewCommentsCount, reminders: pendingReminders, tickets: openTickets };
  return (
    <div className="flex h-full flex-col bg-brand-900 text-brand-50">
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-500"><School size={22} className="text-white" /></div>
        <div>
          <p className="text-lg font-extrabold leading-none">ParentDesk</p>
          <p className="mt-1 text-[11px] uppercase tracking-wider text-brand-300">{user.role} portal</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        {items.map(({ to, label, icon: Icon, end, badge }) => (
          <NavLink key={to} to={to} end={end} onClick={onNavigate}
            className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${isActive ? 'bg-white text-brand-800 shadow-sm' : 'text-brand-100 hover:bg-white/10'}`}>
            <Icon size={18} /><span className="flex-1">{label}</span>
            {badge && counts[badge] > 0 && <span className="grid h-5 min-w-[20px] place-items-center rounded-full bg-amber-400 px-1.5 text-[11px] font-bold text-brand-900">{counts[badge]}</span>}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-white/10 p-4">
        <p className="truncate text-sm font-semibold">{user.name}</p>
        <p className="truncate text-xs text-brand-300">{user.title}</p>
        <button onClick={logout} className="mt-3 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-brand-100 hover:bg-white/10">
          <LogOut size={16} /> Sign out
        </button>
      </div>
    </div>
  );
}

export default function AppShell() {
  const { user, childId, setChildId } = useAuth();
  const kids = useMyChildren();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const items = NAV[user.role];
  const current = [...items].reverse().find((i) => pathname.startsWith(i.to))?.label;

  return (
    <div className="min-h-screen lg:pl-64">
      <aside className="fixed inset-y-0 left-0 hidden w-64 lg:block"><Sidebar items={items} /></aside>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72"><Sidebar items={items} onNavigate={() => setOpen(false)} /></aside>
          <button onClick={() => setOpen(false)} className="absolute right-4 top-4 rounded-lg bg-white p-2" aria-label="Close menu"><X size={18} /></button>
        </div>
      )}

      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-slate-200/70 bg-white/80 px-4 py-3 backdrop-blur lg:px-8">
        <button onClick={() => setOpen(true)} className="rounded-lg p-2 hover:bg-slate-100 lg:hidden" aria-label="Open menu"><Menu size={20} /></button>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold">{current}</p>
          <p className="truncate text-xs text-slate-500">{user.school}</p>
        </div>
        {user.role === 'parent' && (
          <label className="flex items-center gap-2 text-sm">
            <span className="hidden text-slate-500 sm:inline">Child</span>
            <select className="input !w-auto !py-2 font-semibold" value={childId ?? kids[0]?.id} onChange={(e) => setChildId(e.target.value)}>
              {kids.map((k) => <option key={k.id} value={k.id}>{k.name} · {k.cls}</option>)}
            </select>
          </label>
        )}
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 lg:px-8 lg:py-8"><Outlet /></main>
    </div>
  );
}
