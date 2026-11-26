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

export default function TeacherComments() {
  const setActiveNav = useGo();
  const { classes: classesData, draftComments, commentAction, updateCommentText: handleUpdateCommentText } = useSchool();
  const { selectedClassId, setSelectedClassId, currentClassObj, commentTab, setCommentTab } = useTeacherUI();
  const [editingCommentId, setEditingCommentId] = useState(null);

  const classCommentsByTab = useMemo(() => {
    const list = currentClassObj.students;
    return {
      review: list.filter((s) => s.commentStatus === 'review'),
      approved: list.filter((s) => s.commentStatus === 'approved'),
      rejected: list.filter((s) => s.commentStatus === 'rejected'),
      undraftedCount: list.filter((s) => s.commentStatus === 'none').length,
    };
  }, [currentClassObj]);

  const handleDraftForRemainingStudents = () => { if (draftComments(selectedClassId) > 0) setCommentTab('review'); };
  const handleCommentAction = (student, action) => {
    commentAction(student, action);
    if (action !== 'regenerate') setEditingCommentId(null);
  };
  return (
            <div className="space-y-5">
              {/* Header + Top-Right Draft CTA */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-[22px] font-bold text-[#132a38] tracking-tight">
                    AI Comments
                  </h2>
                  <p className="text-[13px] text-[#6a8190] mt-0.5">
                    Review the drafts. Nothing reaches a parent until you approve it.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleDraftForRemainingStudents}
                  disabled={classCommentsByTab.undraftedCount === 0}
                  className="px-4 py-2.5 rounded-xl bg-[#178466] hover:bg-[#136a54] disabled:opacity-50 text-white text-[13px] font-semibold shadow-sm flex items-center gap-2 self-start sm:self-auto transition"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>
                    Draft for {classCommentsByTab.undraftedCount || 0} students
                  </span>
                </button>
              </div>

              {/* Mint-Green Privacy & Control Callout Banner */}
              <div className="rounded-xl bg-[#eefaf3] border border-[#ccebd8] px-4 py-3 flex items-center gap-2.5 text-[12.5px] text-[#176b45] font-medium">
                <ShieldCheck className="w-4 h-4 text-[#169b5f] shrink-0" />
                <span>
                  Drafts use each student&apos;s marks and attendance only. You stay in control:
                  approve, edit, regenerate or reject.
                </span>
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

              {/* Underline Sub-Tabs: To review / Approved / Rejected */}
              <div className="border-b border-[#e3edf2] flex items-center gap-6">
                {[
                  { id: 'review', label: 'To review', count: classCommentsByTab.review.length },
                  {
                    id: 'approved',
                    label: 'Approved',
                    count: classCommentsByTab.approved.length
                  },
                  {
                    id: 'rejected',
                    label: 'Rejected',
                    count: classCommentsByTab.rejected.length
                  }
                ].map((tab) => {
                  const active = commentTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setCommentTab(tab.id)}
                      className={`pb-3 text-[13px] font-semibold border-b-2 transition flex items-center gap-1.5 ${
                        active
                          ? 'border-[#178466] text-[#178466]'
                          : 'border-transparent text-[#7a909e] hover:text-[#132a38]'
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span className="text-[12px]">{tab.count}</span>
                    </button>
                  );
                })}
              </div>

              {/* Comment Cards Grid */}
              {classCommentsByTab[commentTab].length === 0 ? (
                <div className="bg-white rounded-2xl border border-[#e3edf2] p-10 text-center">
                  <p className="text-[14px] font-semibold text-[#344d5c]">
                    No comments in &ldquo;
                    {commentTab === 'review'
                      ? 'To review'
                      : commentTab === 'approved'
                      ? 'Approved'
                      : 'Rejected'}
                    &rdquo; for {currentClassObj.id}.
                  </p>
                  {classCommentsByTab.undraftedCount > 0 && commentTab === 'review' && (
                    <button
                      type="button"
                      onClick={handleDraftForRemainingStudents}
                      className="mt-3 px-4 py-2 rounded-xl bg-[#178466] text-white text-[12.5px] font-semibold"
                    >
                      Generate AI drafts for {classCommentsByTab.undraftedCount} students
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {classCommentsByTab[commentTab].map((student) => {
                    const avg = Math.round((student.quiz1 + student.midterm) / 2);
                    const isEditing = editingCommentId === student.id;

                    return (
                      <div
                        key={student.id}
                        className="bg-white rounded-2xl border border-[#e3edf2] p-5 shadow-[0_1px_2px_rgba(16,42,56,0.03)] flex flex-col justify-between"
                      >
                        <div>
                          {/* Student Header */}
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-10 h-10 rounded-full ${student.avatarBg} text-white font-bold text-xs flex items-center justify-center shrink-0`}
                            >
                              {student.initials}
                            </div>
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <h4 className="text-[14.5px] font-bold text-[#132a38]">
                                  {student.name}
                                </h4>
                                <span className="text-[12px] text-[#7a909e]">
                                  Roll {student.roll} · to {student.parent}
                                </span>
                              </div>

                              <div className="flex flex-wrap items-center gap-2 mt-1.5">
                                <span className="px-2.5 py-0.5 rounded-full bg-[#e5f2f8] text-[#136a54] text-[11px] font-semibold">
                                  {avg}% avg
                                </span>
                                {student.absences > 0 && (
                                  <span
                                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                                      student.absences >= 3
                                        ? 'bg-[#fde4e8] text-[#c93b52]'
                                        : 'bg-[#fef4e2] text-[#b97316]'
                                    }`}
                                  >
                                    {student.absences}{' '}
                                    {student.absences === 1 ? 'absence' : 'absences'}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Soft Slate-Blue Draft Box */}
                          <div className="mt-4">
                            {isEditing ? (
                              <textarea
                                rows={4}
                                value={student.commentText}
                                onChange={(e) =>
                                  handleUpdateCommentText(student.id, e.target.value)
                                }
                                className="w-full rounded-xl bg-[#f4f7f9] border border-[#178466] p-3.5 text-[13px] text-[#1e3544] leading-relaxed focus:outline-none"
                              />
                            ) : (
                              <div className="rounded-xl bg-[#f4f7f9] p-4 text-[13px] text-[#284252] leading-relaxed">
                                {student.commentText}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-4 flex flex-wrap items-center gap-2">
                          {commentTab !== 'approved' && (
                            <button
                              type="button"
                              onClick={() => handleCommentAction(student, 'approved')}
                              className="px-4 py-2 rounded-xl bg-[#0b9b61] hover:bg-[#098251] text-white text-[12.5px] font-semibold flex items-center gap-1.5 transition"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() =>
                              setEditingCommentId(isEditing ? null : student.id)
                            }
                            className="px-3.5 py-2 rounded-xl bg-[#f4f8fa] hover:bg-[#e7f0f4] border border-[#dce7ed] text-[#284252] text-[12.5px] font-semibold flex items-center gap-1.5 transition"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            <span>{isEditing ? 'Done' : 'Edit'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleCommentAction(student, 'regenerate')}
                            className="px-3.5 py-2 rounded-xl bg-[#f4f8fa] hover:bg-[#e7f0f4] border border-[#dce7ed] text-[#284252] text-[12.5px] font-semibold flex items-center gap-1.5 transition"
                          >
                            <RotateCw className="w-3.5 h-3.5" />
                            <span>Regenerate</span>
                          </button>

                          {commentTab !== 'rejected' && (
                            <button
                              type="button"
                              onClick={() => handleCommentAction(student, 'rejected')}
                              className="px-3.5 py-2 rounded-xl bg-[#fdf0f2] hover:bg-[#fbe2e6] text-[#c93b52] text-[12.5px] font-semibold flex items-center gap-1.5 transition"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
  );
}
