// ─────────────────────────────────────────────────────────────
// SchoolContext: ONE shared store for admin, teacher and parent portals.
// Teacher actions (attendance, marks, comments) update the same data that
// admins and parents read, so every interface stays in sync.
// It also persists to localStorage and listens to the `storage` event, so
// changes made in one browser tab appear live in another tab.
// TODO(backend): each action below becomes an API call; the store then
// just caches server responses.
// ─────────────────────────────────────────────────────────────
import { createContext, useContext, useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useAuth } from './AuthContext.jsx';
import { TEACHER, TODAY, avgOf, makeInitialData } from '../data/mock.js';

const KEY = 'pd_school_v1';
const Ctx = createContext(null);
export const useSchool = () => useContext(Ctx);

const load = () => {
  try { const raw = localStorage.getItem(KEY); if (raw) return JSON.parse(raw); } catch { /* ignore */ }
  return makeInitialData();
};

const hhmm = () => { const n = new Date(); return `${String(n.getHours()).padStart(2, '0')}:${String(n.getMinutes()).padStart(2, '0')}`; };
const stamp = () => `${TODAY} Nov, ${hhmm()}`;
const uid = (p = 'x') => `${p}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
const first = (n) => n.split(' ')[0];
const BG = ['bg-teal-500', 'bg-sky-500', 'bg-indigo-500', 'bg-emerald-500', 'bg-cyan-600', 'bg-indigo-400'];

// Personalised AI draft from marks & attendance (stand-in for the LLM call).
const generateAIDraftText = (student, variant = 0) => {
  const avg = avgOf(student);
  const f = first(student.name);
  const pick = (opts) => opts[variant % opts.length];
  if (avg < 60 || student.absences >= 3) return pick([
    `${f}'s results (${avg}% average) show gaps in a few key topics. A short daily practice routine at home would make a real difference. ${f} has missed ${student.absences} recent classes; regular attendance will help keep progress steady.`,
    `With a ${avg}% average across Quiz 1 and Midterm, ${f} needs focused revision on core Mathematics concepts. Reducing recent absences (${student.absences} missed classes) will help build classroom continuity.`,
  ]);
  if (avg >= 82) return pick([
    `${f} has achieved an impressive ${avg}% average across Quiz 1 and Midterm with strong classroom engagement. Keep up this steady focus heading into final term assessments.`,
    `${f}'s consistent effort is reflected in a ${avg}% average and reliable attendance. Practicing higher-order word problems will help maintain this top-tier performance.`,
  ]);
  return pick([
    `${f} is making steady progress in Mathematics with a ${avg}% average. Reviewing Quiz 1 and Midterm corrections regularly will help push scores above 80%.`,
    `${f} demonstrates good understanding of class concepts (${avg}% average). Consistent homework completion and active class participation will support further improvement.`,
  ]);
};

// pure helpers on the data object
const mapStudents = (d, fn) => ({ ...d, classes: d.classes.map((c) => ({ ...c, students: c.students.map(fn) })) });
const patchStudent = (d, id, patch) => mapStudents(d, (s) => (s.id === id ? { ...s, ...(typeof patch === 'function' ? patch(s) : patch) } : s));
const addAudit = (d, user, action, target) => ({ ...d, audit: [{ id: uid('a'), time: stamp(), user, action, target }, ...d.audit] });
const addNote = (d, n) => ({ ...d, notifications: [{ id: uid('n'), date: `${TODAY} Nov`, unread: true, ...n }, ...d.notifications] });

const T = `${TEACHER.name} (Teacher)`;
const ADMIN = 'Sana Rehman (Admin)';
const PARENT_PREFIX = 'Parent';

export function SchoolProvider({ children }) {
  const [data, setData] = useState(load);
  const ref = useRef(data);
  ref.current = data;
  const [toasts, setToasts] = useState([]);

  const commit = useCallback((next) => { ref.current = next; setData(next); }, []);

  // persist + cross-tab live sync
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch { /* ignore */ } }, [data]);
  useEffect(() => {
    const onStorage = (e) => { if (e.key === KEY && e.newValue) { try { setData(JSON.parse(e.newValue)); } catch { /* ignore */ } } };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const toast = useCallback((message) => {
    const id = uid('t');
    setToasts((p) => [...p.slice(-2), { id, message }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 5000);
  }, []);

  // ── derived views ──
  const allStudents = useMemo(() => data.classes.flatMap((c) =>
    c.students.map((s) => ({ ...s, classId: c.id, room: c.room, avg: avgOf(s) }))), [data.classes]);

  const summary = useMemo(() => {
    const classAverages = data.classes.map((c) => {
      const scored = c.students.filter((s) => s.quiz1 || s.midterm);
      const m = (k) => (scored.length ? Math.round(scored.reduce((a, s) => a + s[k], 0) / scored.length) : 0);
      return { id: c.id, quiz1: m('quiz1'), midterm: m('midterm') };
    });
    const marked = data.classes.filter((c) => c.submittedToday).length;
    return {
      allStudents, totalStudents: allStudents.length, markedClassesCount: marked,
      totalClassesCount: data.classes.length, remainingToMark: data.classes.length - marked,
      reviewCommentsCount: allStudents.filter((s) => s.commentStatus === 'review').length,
      flaggedStudents: allStudents.filter((s) => s.absences >= 3), classAverages,
    };
  }, [data.classes, allStudents]);

  const pendingReminders = data.reminders.filter((r) => r.status === 'pending').length;
  const openTickets = data.tickets.filter((t) => t.status === 'open').length;

  // ── TEACHER actions ──
  const setAttendance = (classId, studentId, status) => {
    const d = ref.current;
    commit({ ...d, classes: d.classes.map((c) => (c.id !== classId ? c : { ...c, students: c.students.map((s) => (s.id === studentId ? { ...s, status } : s)) })) });
  };
  const unlockAttendance = (classId) => {
    const d = ref.current;
    commit({ ...d, classes: d.classes.map((c) => (c.id === classId ? { ...c, isEditing: true } : c)) });
  };
  // Submitting attendance → alerts parents, flags 3+ absences for admin, logs the n8n run.
  const submitAttendance = (classId) => {
    let d = ref.current;
    const cls = d.classes.find((c) => c.id === classId); if (!cls) return;
    const t = hhmm(); const logs = []; let alerts = 0;
    const students = cls.students.map((st) => {
      const prev = st.history?.[TODAY];
      let absences = st.absences;
      const newlyAbsent = st.status === 'Absent' && prev !== 'A';
      if (newlyAbsent) absences += 1;
      if (st.status !== 'Absent' && prev === 'A') absences = Math.max(0, absences - 1);
      if (newlyAbsent) {
        alerts += 1;
        if (absences >= 3) logs.unshift({ id: uid('log'), type: 'flag', text: `Flagged to admin: ${st.name} reached ${absences} absences`, time: t });
        logs.push({ id: uid('log'), type: 'alert', text: `Absence alert sent to parent of ${st.name} (WhatsApp)`, time: t });
        d = addNote(d, { type: 'absence', channel: 'WhatsApp', title: 'Absence alert', studentId: st.id,
          body: `${first(st.name)} was marked absent today.${absences >= 3 ? ` This is absence #${absences}; the school administration has been notified.` : ''}` });
      }
      const code = st.status === 'Absent' ? 'A' : st.status === 'Late' ? 'L' : 'P';
      return { ...st, absences, history: { ...st.history, [TODAY]: code } };
    });
    d = { ...d, classes: d.classes.map((c) => (c.id === classId ? { ...c, submittedToday: true, isEditing: false, students } : c)),
      automationLogs: [...logs, ...d.automationLogs] };
    d = addAudit(d, T, 'Submitted attendance', `${classId} · ${students.filter((s) => s.status === 'Absent').length} absent`);
    commit(d);
    toast(alerts ? `Saved. ${alerts} parent ${alerts === 1 ? 'alert' : 'alerts'} sent` : 'Attendance saved. No new alerts.');
  };

  const draftComments = (classId) => {
    const d = ref.current; let n = 0;
    const next = { ...d, classes: d.classes.map((c) => (c.id !== classId ? c : { ...c, students: c.students.map((s) => {
      if (s.commentStatus !== 'none') return s;
      n += 1; return { ...s, commentStatus: 'review', commentText: generateAIDraftText(s, 0) };
    }) })) };
    if (n) { commit(next); toast(`Generated ${n} AI comment drafts for ${classId}`); }
    return n;
  };
  const draftOne = (studentId) => commit(patchStudent(ref.current, studentId, (s) => ({ commentStatus: 'review', commentText: generateAIDraftText(s, 0) })));

  const commentAction = (student, action) => {
    let d = ref.current;
    if (action === 'regenerate') {
      d = patchStudent(d, student.id, (s) => { const v = (s.draftVariant || 0) + 1; return { draftVariant: v, commentText: generateAIDraftText(s, v) }; });
      return commit(d);
    }
    d = patchStudent(d, student.id, { commentStatus: action });
    if (action === 'approved') {
      d = addNote(d, { type: 'result', channel: 'Email', title: 'Teacher comment', studentId: student.id, body: `A new comment from ${TEACHER.name} about ${first(student.name)} is available.` });
      d = addAudit(d, T, 'Approved AI comment', student.name);
      toast(`Comment for ${first(student.name)} approved and queued for ${student.parent}`);
    } else if (action === 'rejected') toast(`Draft for ${first(student.name)} moved to Rejected`);
    commit(d);
  };
  const updateCommentText = (id, text) => commit(patchStudent(ref.current, id, { commentText: text }));
  const editScore = (id, field, raw) => commit(patchStudent(ref.current, id, { [field]: Math.max(0, Math.min(100, Number(raw) || 0)) }));
  const saveMarks = (classId) => { commit(addAudit(ref.current, T, 'Saved marks', classId)); toast(`Marks saved for ${classId}`); };

  // ── ADMIN actions ──
  const addStudent = ({ name, classId, parent, phone }) => {
    let d = ref.current;
    const cls = d.classes.find((c) => c.id === classId); if (!cls) return false;
    const s = { id: uid('s'), roll: cls.students.length + 1, initials: name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase(),
      avatarBg: BG[name.length % BG.length], name, parent, phone, parentId: uid('p'), status: 'Present', absences: 0,
      quiz1: 0, midterm: 0, commentStatus: 'none', commentText: '', draftVariant: 0, history: {} };
    d = { ...d, classes: d.classes.map((c) => (c.id === classId ? { ...c, students: [...c.students, s] } : c)) };
    commit(addAudit(d, ADMIN, 'Added student', `${name} (${classId})`));
    return true;
  };
  const importStudents = (rows) => {
    let added = 0;
    rows.forEach((r) => {
      const key = r.classId.toLowerCase().replace(/^class\s*/, '');
      const cls = ref.current.classes.find((c) => c.id.toLowerCase().replace(/^class\s*/, '') === key);
      if (cls && r.name && addStudent({ ...r, classId: cls.id })) added += 1;
    });
    commit(addAudit(ref.current, ADMIN, 'Imported student CSV', `${added} rows`));
    return { added, skipped: rows.length - added };
  };
  const markInvoicePaid = (id) => {
    const d = ref.current; const inv = d.invoices.find((i) => i.id === id);
    let next = { ...d, invoices: d.invoices.map((i) => (i.id === id ? { ...i, status: 'paid', paidOn: `${TODAY} Nov 2026` } : i)) };
    next = addAudit(next, ADMIN, 'Marked invoice paid', inv ? inv.id : id);
    commit(next);
  };
  const updateReminder = (id, patch) => { const d = ref.current; commit({ ...d, reminders: d.reminders.map((r) => (r.id === id ? { ...r, ...patch } : r)) }); };
  const approveReminder = (id) => {
    let d = ref.current; const r = d.reminders.find((x) => x.id === id); if (!r) return;
    d = { ...d, reminders: d.reminders.map((x) => (x.id === id ? { ...x, status: 'sent' } : x)) };
    d = addNote(d, { type: 'fee', channel: r.channel, title: 'Fee reminder', studentId: r.studentId, body: r.draft });
    commit(addAudit(d, ADMIN, 'Approved fee reminder', r.student));
    toast(`Sent to ${r.parent} via ${r.channel}`);
  };
  const rejectReminder = (id) => { const d = ref.current; commit({ ...d, reminders: d.reminders.map((r) => (r.id === id ? { ...r, status: 'rejected' } : r)) }); };

  const addTicket = ({ studentId, parent, child, question, note }) => {
    const d = ref.current;
    const n = Math.max(200, ...d.tickets.map((t) => Number(t.id.replace('T-', '')) || 0)) + 1;
    const id = 'T-' + n;
    const now = new Date(); const h = now.getHours() % 12 || 12;
    const date = `${TODAY} Nov, ${h}:${String(now.getMinutes()).padStart(2, '0')} ${now.getHours() >= 12 ? 'PM' : 'AM'}`;
    commit({ ...d, tickets: [{ id, studentId, parent, child, channel: 'Chatbot', date, status: 'open', question, note }, ...d.tickets] });
    return id;
  };
  const replyTicket = (id, text) => {
    let d = ref.current; const t = d.tickets.find((x) => x.id === id); if (!t) return;
    d = { ...d, tickets: d.tickets.map((x) => (x.id === id ? { ...x, status: 'resolved', reply: text } : x)) };
    d = addNote(d, { type: 'notice', channel: 'WhatsApp', title: `Reply to your question (${id})`, studentId: t.studentId, body: text });
    commit(addAudit(d, ADMIN, 'Resolved ticket', id));
  };

  // ── PARENT actions ──
  const markRead = (studentIds) => { const d = ref.current; commit({ ...d, notifications: d.notifications.map((n) => (n.studentId === null || studentIds.includes(n.studentId) ? { ...n, unread: false } : n)) }); };

  const resetData = () => { localStorage.removeItem(KEY); commit(makeInitialData()); };

  const value = {
    ...data, allStudents, summary, pendingReminders, openTickets, toast, resetData,
    setAttendance, unlockAttendance, submitAttendance, draftComments, draftOne, commentAction, updateCommentText, editScore, saveMarks,
    addStudent, importStudents, markInvoicePaid, updateReminder, approveReminder, rejectReminder, addTicket, replyTicket, markRead,
  };

  return (
    <Ctx.Provider value={value}>
      {children}
      {toasts.length > 0 && (
        <div className="pointer-events-none fixed bottom-5 right-5 z-[60] flex w-full max-w-md flex-col gap-2.5 px-4 sm:px-0">
          {toasts.map((t) => (
            <div key={t.id} className="pointer-events-auto flex items-center gap-2.5 rounded-xl border border-[#1d4e66] bg-[#0f3547] px-4 py-3 text-sm font-medium text-white shadow-lg">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-[#34d399]" /><span>{t.message}</span>
            </div>
          ))}
        </div>
      )}
    </Ctx.Provider>
  );
}

// ── parent helpers ──
export function useMyChildren() {
  const { user } = useAuth();
  const { allStudents } = useSchool();
  const pid = user?.parentId ?? 'p-malik';
  return useMemo(() => allStudents.filter((s) => s.parentId === pid), [allStudents, pid]);
}
export function useChild() {
  const { childId } = useAuth();
  const kids = useMyChildren();
  return kids.find((k) => k.id === childId) ?? kids[0];
}
