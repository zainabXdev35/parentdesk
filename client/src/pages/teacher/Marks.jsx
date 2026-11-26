import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutGrid,
  CalendarCheck,
  ClipboardList,
  Sparkles,
  Users,
  LogOut,
  GraduationCap,
  Calendar,
  AlertTriangle,
  ArrowRight,
  Check,
  X,
  Clock,
  Pencil,
  GitBranch,
  ShieldCheck,
  RotateCw,
  CheckCircle2,
  Search,
  Upload,
  Menu,
  Phone,
  BookOpen
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext.jsx';
import { useTeacherUI } from '../../context/TeacherUI.jsx';
import { TODAY_LABEL } from '../../data/mock.js';

// Nav ids from the original single-file module map to real routes now.
const useGo = () => {
  const navigate = useNavigate();
  return (id) => navigate(id === 'dashboard' ? '/teacher' : `/teacher/${id}`);
};

export default function TeacherMarks() {
  const setActiveNav = useGo();
  const { classes: classesData, toast: pushToast, editScore: handleScoreEdit, draftOne, saveMarks } = useSchool();
  const { selectedClassId, setSelectedClassId, currentClassObj, setCommentTab } = useTeacherUI();
  return (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-[22px] font-bold text-[#132a38] tracking-tight">Marks</h2>
                  <p className="text-[13px] text-[#6a8190] mt-0.5">
                    Mathematics · enter Quiz 1 and Midterm scores or import CSV
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() =>
                      pushToast(`CSV imported for ${currentClassObj.id} (8 student records)`)
                    }
                    className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#f0f6f9] border border-[#dce7ed] text-[#284252] text-[12.5px] font-semibold flex items-center gap-1.5 transition"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#178466]" />
                    <span>Import CSV</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      saveMarks(currentClassObj.id);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#178466] hover:bg-[#136a54] text-white text-[12.5px] font-semibold shadow-sm transition"
                  >
                    Save Marks
                  </button>
                </div>
              </div>

              {/* Class Selector Pills */}
              <div className="flex flex-wrap items-center gap-2.5">
                {classesData.map((cls) => {
                  const active = cls.id === selectedClassId;
                  return (
                    <button
                      key={cls.id}
                      type="button"
                      onClick={() => setSelectedClassId(cls.id)}
                      className={`px-4 py-2 rounded-xl text-[13px] font-semibold transition ${
                        active
                          ? 'bg-[#178466] text-white shadow-sm'
                          : 'bg-white text-[#344d5c] border border-[#dce7ed] hover:bg-[#f0f6f9]'
                      }`}
                    >
                      {cls.id}
                    </button>
                  );
                })}
              </div>

              {/* Marks Table Card */}
              <div className="bg-white rounded-2xl border border-[#e3edf2] shadow-[0_1px_2px_rgba(16,42,56,0.03)] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#f7fafc] border-b border-[#e8f0f4] text-[11.5px] font-semibold text-[#6a8190]">
                        <th className="py-3.5 px-6">Roll</th>
                        <th className="py-3.5 px-4">Student</th>
                        <th className="py-3.5 px-4">Quiz 1 (/100)</th>
                        <th className="py-3.5 px-4">Midterm (/100)</th>
                        <th className="py-3.5 px-4">Average</th>
                        <th className="py-3.5 px-6 text-right">AI Comment</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f0f5f8] text-[13.5px]">
                      {currentClassObj.students.map((st) => {
                        const avg = Math.round((st.quiz1 + st.midterm) / 2);
                        return (
                          <tr key={st.id} className="hover:bg-[#fafcfd]">
                            <td className="py-3.5 px-6 text-[12px] text-[#7a909e] font-medium">
                              {st.roll}
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-8 h-8 rounded-full ${st.avatarBg} text-white font-bold text-xs flex items-center justify-center shrink-0`}
                                >
                                  {st.initials}
                                </div>
                                <span className="font-bold text-[#132a38]">{st.name}</span>
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={st.quiz1}
                                onChange={(e) =>
                                  handleScoreEdit(st.id, 'quiz1', e.target.value)
                                }
                                className="w-20 px-2.5 py-1.5 rounded-lg border border-[#dce7ed] font-semibold text-[#132a38] focus:outline-none focus:border-[#178466]"
                              />
                            </td>
                            <td className="py-3.5 px-4">
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={st.midterm}
                                onChange={(e) =>
                                  handleScoreEdit(st.id, 'midterm', e.target.value)
                                }
                                className="w-20 px-2.5 py-1.5 rounded-lg border border-[#dce7ed] font-semibold text-[#132a38] focus:outline-none focus:border-[#178466]"
                              />
                            </td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[11.5px] font-semibold ${
                                  avg >= 75
                                    ? 'bg-[#e4f7ed] text-[#15804d]'
                                    : avg >= 60
                                    ? 'bg-[#e6f2f8] text-[#136a54]'
                                    : 'bg-[#fde8ec] text-[#c93b52]'
                                }`}
                              >
                                {avg}% avg
                              </span>
                            </td>
                            <td className="py-3.5 px-6 text-right">
                              {st.commentStatus === 'approved' ? (
                                <span className="text-[12px] font-semibold text-[#15804d]">
                                  Approved
                                </span>
                              ) : st.commentStatus === 'review' ? (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setCommentTab('review');
                                    setActiveNav('comments');
                                  }}
                                  className="text-[12px] font-semibold text-[#d98218] hover:underline"
                                >
                                  In review →
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => { draftOne(st.id); setCommentTab('review'); setActiveNav('comments'); }}
                                  className="text-[12px] font-semibold text-[#136a54] hover:underline"
                                >
                                  + Draft AI
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
  );
}
