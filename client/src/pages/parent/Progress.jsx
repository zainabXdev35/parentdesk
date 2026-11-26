import { Lock, Sparkles } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Badge, Card, PageHeader } from '../../components/ui.jsx';
import { useChild, useSchool } from '../../context/SchoolContext.jsx';
import { TEACHER } from '../../data/mock.js';

const grade = (n) => (n >= 90 ? 'A+' : n >= 80 ? 'A' : n >= 70 ? 'B' : n >= 60 ? 'C' : 'D');

export default function Progress() {
  const child = useChild();
  const { summary } = useSchool();
  const cls = summary.classAverages.find((c) => c.id === child.classId) ?? { quiz1: 0, midterm: 0 };
  const hasMarks = child.quiz1 || child.midterm;
  const rows = [
    { exam: 'Quiz 1', mine: child.quiz1, avg: cls.quiz1 },
    { exam: 'Midterm', mine: child.midterm, avg: cls.midterm },
  ];
  const approved = child.commentStatus === 'approved' && child.commentText;

  return (
    <>
      <PageHeader title="Academic progress" subtitle={`${child.name} · ${child.classId} · Mathematics`} />
      {!hasMarks ? (
        <Card><p className="py-8 text-center text-sm text-slate-400">Marks have not been entered yet.</p></Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-5">
          <Card title="Marks vs class average" className="lg:col-span-3">
            <div className="h-72">
              <ResponsiveContainer>
                <BarChart data={rows} barGap={6}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8eeec" />
                  <XAxis dataKey="exam" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis domain={[0, 100]} tickLine={false} axisLine={false} fontSize={12} width={30} />
                  <Tooltip cursor={{ fill: '#f4f7f6' }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="mine" name={child.name.split(' ')[0]} fill="#1f9d7a" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="avg" name="Class average" fill="#cbd5d1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card title="Result sheet" pad={false} className="lg:col-span-2">
            <table className="w-full">
              <thead className="bg-slate-50"><tr>{['Assessment', 'Marks', 'Grade'].map((h) => <th key={h} className="th">{h}</th>)}</tr></thead>
              <tbody className="divide-y divide-slate-100">
                {[...rows, { exam: 'Overall average', mine: child.avg }].map((r) => (
                  <tr key={r.exam}><td className="td font-semibold">{r.exam}</td><td className="td">{r.mine}/100</td>
                    <td className="td"><Badge tone={r.mine >= 80 ? 'green' : r.mine >= 70 ? 'blue' : 'amber'}>{grade(r.mine)}</Badge></td></tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}

      <Card title="Teacher comment" className="mt-6">
        {approved ? (
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-sm leading-relaxed">{child.commentText}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold">{TEACHER.name}</span><span>·</span><span>Mathematics</span>
              <Badge tone="brand"><Sparkles size={11} /> AI-assisted, teacher approved</Badge>
            </div>
          </div>
        ) : (
          <p className="flex items-center gap-2 py-4 text-sm text-slate-400"><Lock size={15} /> Comments appear here only after the teacher has reviewed and approved them.</p>
        )}
      </Card>
    </>
  );
}
