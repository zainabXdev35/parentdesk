import { useMemo, useRef, useState } from 'react';
import { Plus, Search, Upload } from 'lucide-react';
import { Badge, Card, Empty, Modal, PageHeader, Toast, useToast } from '../../components/ui.jsx';
import { useSchool } from '../../context/SchoolContext.jsx';
import { TODAY } from '../../data/mock.js';

// attendance % from the shared attendance history (weekdays up to today, unmarked past days = present)
function attPct(s) {
  let p = 0, tot = 0;
  for (let d = 1; d <= TODAY; d++) {
    const dow = new Date(2026, 10, d).getDay();
    if (dow === 0 || dow === 6) continue;
    const c = s.history?.[d];
    if (d === TODAY && !c) continue;
    tot += 1; if (c !== 'A') p += 1;
  }
  return tot ? Math.round((p / tot) * 100) : 100;
}

export default function Students() {
  const { allStudents, classes, addStudent, importStudents } = useSchool();
  const [q, setQ] = useState('');
  const [cls, setCls] = useState('all');
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: '', classId: classes[0].id, parent: '', phone: '' });
  const [toast, show] = useToast();
  const fileRef = useRef();

  const list = useMemo(() => allStudents.filter((s) =>
    (cls === 'all' || s.classId === cls) && (s.name + s.parent).toLowerCase().includes(q.toLowerCase())), [allStudents, q, cls]);

  const add = (e) => {
    e.preventDefault();
    // TODO(backend): POST /api/students
    addStudent(form);
    setAdding(false); setForm({ name: '', classId: classes[0].id, parent: '', phone: '' }); show('Student added. Teacher and parent views updated.');
  };

  // Client-side CSV preview. Expected header: name,class,parent,phone  (class e.g. "Class 8-A")
  const importCsv = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    const [head, ...lines] = (await file.text()).trim().split(/\r?\n/);
    const cols = head.split(',').map((c) => c.trim().toLowerCase());
    const rows = lines.filter(Boolean).map((l) => {
      const v = l.split(',').map((x) => x.trim()); const g = (k) => v[cols.indexOf(k)] ?? '';
      return { name: g('name'), classId: g('class'), parent: g('parent'), phone: g('phone') };
    });
    const { added, skipped } = importStudents(rows);
    show(`Imported ${added} students${skipped ? `, skipped ${skipped} (unknown class)` : ''}`); e.target.value = '';
  };

  return (
    <>
      <PageHeader title="Students" subtitle={`${allStudents.length} students on record · shared live with teachers and parents`}>
        <input ref={fileRef} type="file" accept=".csv" hidden onChange={importCsv} />
        <button className="btn-ghost" onClick={() => fileRef.current.click()}><Upload size={16} /> Import CSV</button>
        <button className="btn-primary" onClick={() => setAdding(true)}><Plus size={16} /> Add student</button>
      </PageHeader>

      <Card pad={false}>
        <div className="flex flex-wrap gap-3 border-b border-slate-100 p-4">
          <div className="relative min-w-[200px] flex-1">
            <Search size={16} className="absolute left-3 top-3 text-slate-400" />
            <input className="input !pl-9" placeholder="Search student or parent…" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <select className="input !w-auto" value={cls} onChange={(e) => setCls(e.target.value)}>
            <option value="all">All classes</option>
            {classes.map((c) => <option key={c.id}>{c.id}</option>)}
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50"><tr>{['Student', 'Class', 'Parent / Guardian', 'Phone', 'Absences', 'Attendance', 'Avg'].map((h) => <th key={h} className="th">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-slate-100">
              {list.map((s) => { const a = attPct(s); return (
                <tr key={s.id} className="hover:bg-slate-50/60">
                  <td className="td"><div className="flex items-center gap-3">
                    <div className={`grid h-9 w-9 place-items-center rounded-full text-xs font-bold text-white ${s.avatarBg}`}>{s.initials}</div>
                    <span className="font-semibold">{s.name}</span></div></td>
                  <td className="td">{s.classId}</td>
                  <td className="td">{s.parent}</td>
                  <td className="td text-slate-500">{s.phone}</td>
                  <td className="td">{s.absences >= 3 ? <Badge tone="red">{s.absences} · flagged</Badge> : s.absences}</td>
                  <td className="td"><Badge tone={a >= 90 ? 'green' : a >= 80 ? 'amber' : 'red'}>{a}%</Badge></td>
                  <td className="td text-slate-500">{s.quiz1 || s.midterm ? `${s.avg}%` : '—'}</td>
                </tr>); })}
            </tbody>
          </table>
          {!list.length && <Empty text="No students match your search." />}
        </div>
      </Card>

      {adding && (
        <Modal title="Add student" onClose={() => setAdding(false)}>
          <form onSubmit={add} className="space-y-4">
            <div><label className="label">Full name</label><input required className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="label">Class</label>
                <select className="input" value={form.classId} onChange={(e) => setForm({ ...form, classId: e.target.value })}>{classes.map((c) => <option key={c.id}>{c.id}</option>)}</select></div>
              <div><label className="label">Parent phone</label><input required className="input" placeholder="+92 3xx xxxxxxx" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
            </div>
            <div><label className="label">Parent / guardian</label><input required className="input" value={form.parent} onChange={(e) => setForm({ ...form, parent: e.target.value })} /></div>
            <div className="flex justify-end gap-2 pt-2"><button type="button" className="btn-ghost" onClick={() => setAdding(false)}>Cancel</button><button className="btn-primary">Save student</button></div>
          </form>
        </Modal>
      )}
      <Toast msg={toast} />
    </>
  );
}
