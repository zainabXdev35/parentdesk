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

export default function TeacherAttendance() {
  const setActiveNav = useGo();
  const { classes: classesData, automationLogs, setAttendance: handleSetStudentAttendance,
    unlockAttendance: handleUnlockAttendanceEdit, submitAttendance: handleSubmitClassAttendance } = useSchool();
  const { selectedClassId, setSelectedClassId, currentClassObj } = useTeacherUI();
  return (
            <div className="space-y-5">
              <div>
                <h2 className="text-[22px] font-bold text-[#132a38] tracking-tight">Attendance</h2>
                <p className="text-[13px] text-[#6a8190] mt-0.5">
                  {TODAY_LABEL} · mark each class once per day
                </p>
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

              {/* 2-Column Attendance Roster + Automation Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                {/* Left 8 Cols: Class Roster Card */}
                <div className="lg:col-span-8 bg-white rounded-2xl border border-[#e3edf2] shadow-[0_1px_2px_rgba(16,42,56,0.03)] overflow-hidden">
                  {/* Card Top Header */}
                  <div className="px-6 py-4 border-b border-[#edf3f7] flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-[15px] font-bold text-[#132a38]">
                          {currentClassObj.id}
                        </h3>
                        <span className="text-[13px] text-[#7a909e]">
                          · {currentClassObj.room}
                        </span>
                      </div>

                      {/* Present / Absent / Late Pills */}
                      <div className="flex items-center gap-2 mt-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#e4f7ed] text-[#15804d] text-[11px] font-semibold">
                          {
                            currentClassObj.students.filter((s) => s.status === 'Present')
                              .length
                          }{' '}
                          present
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-[#fde8ec] text-[#c93b52] text-[11px] font-semibold">
                          {
                            currentClassObj.students.filter((s) => s.status === 'Absent')
                              .length
                          }{' '}
                          absent
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-[#fef4e2] text-[#b97316] text-[11px] font-semibold">
                          {currentClassObj.students.filter((s) => s.status === 'Late').length}{' '}
                          late
                        </span>
                      </div>
                    </div>

                    {/* Right Action: Edit or Submit Attendance */}
                    {currentClassObj.submittedToday && !currentClassObj.isEditing ? (
                      <button
                        type="button"
                        onClick={() => handleUnlockAttendanceEdit(currentClassObj.id)}
                        className="px-3.5 py-2 rounded-xl bg-[#f4f8fa] hover:bg-[#e8f0f4] border border-[#dce7ed] text-[#284252] text-[12.5px] font-semibold flex items-center gap-1.5 transition"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSubmitClassAttendance(currentClassObj.id)}
                        className="px-4 py-2 rounded-xl bg-[#178466] hover:bg-[#136a54] text-white text-[12.5px] font-semibold shadow-sm transition"
                      >
                        Submit Attendance
                      </button>
                    )}
                  </div>

                  {/* Student Rows */}
                  <div className="divide-y divide-[#f0f5f8]">
                    {currentClassObj.students.map((student) => {
                      const isLocked =
                        currentClassObj.submittedToday && !currentClassObj.isEditing;
                      const isFlagged = student.absences >= 3;

                      return (
                        <div
                          key={student.id}
                          className="px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#fafcfd] transition"
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            <span className="w-4 text-[12px] font-medium text-[#8ba0ad] shrink-0">
                              {student.roll}
                            </span>
                            <div
                              className={`w-9 h-9 rounded-full ${student.avatarBg} text-white font-bold text-xs flex items-center justify-center shrink-0`}
                            >
                              {student.initials}
                            </div>
                            <div className="min-w-0">
                              <p className="text-[13.5px] font-bold text-[#132a38] truncate">
                                {student.name}
                              </p>
                              {isFlagged ? (
                                <p className="text-[11.5px] font-semibold text-[#d63b52] flex items-center gap-1 mt-0.5">
                                  <AlertTriangle className="w-3 h-3" />
                                  <span>{student.absences} absences, flagged</span>
                                </p>
                              ) : student.absences > 0 ? (
                                <p className="text-[11.5px] text-[#7a909e] mt-0.5">
                                  {student.absences}{' '}
                                  {student.absences === 1 ? 'recent absence' : 'recent absences'}
                                </p>
                              ) : null}
                            </div>
                          </div>

                          {/* 3-Segment Present / Absent / Late Buttons */}
                          <div className="inline-flex items-center rounded-xl border border-[#e3edf2] bg-[#fbfdfe] p-0.5 self-end sm:self-auto">
                            <button
                              type="button"
                              disabled={isLocked}
                              onClick={() =>
                                handleSetStudentAttendance(
                                  currentClassObj.id,
                                  student.id,
                                  'Present'
                                )
                              }
                              className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold flex items-center gap-1 transition ${
                                student.status === 'Present'
                                  ? 'bg-[#0b9b61] text-white shadow-xs'
                                  : 'text-[#8ea2ae] hover:text-[#132a38] disabled:opacity-60'
                              }`}
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Present</span>
                            </button>

                            <button
                              type="button"
                              disabled={isLocked}
                              onClick={() =>
                                handleSetStudentAttendance(
                                  currentClassObj.id,
                                  student.id,
                                  'Absent'
                                )
                              }
                              className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold flex items-center gap-1 transition ${
                                student.status === 'Absent'
                                  ? 'bg-[#dc2646] text-white shadow-xs'
                                  : 'text-[#8ea2ae] hover:text-[#132a38] disabled:opacity-60'
                              }`}
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>Absent</span>
                            </button>

                            <button
                              type="button"
                              disabled={isLocked}
                              onClick={() =>
                                handleSetStudentAttendance(
                                  currentClassObj.id,
                                  student.id,
                                  'Late'
                                )
                              }
                              className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold flex items-center gap-1 transition ${
                                student.status === 'Late'
                                  ? 'bg-[#e58e18] text-white shadow-xs'
                                  : 'text-[#8ea2ae] hover:text-[#132a38] disabled:opacity-60'
                              }`}
                            >
                              <Clock className="w-3.5 h-3.5" />
                              <span>Late</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Bottom Footer Status Bar */}
                  <div className="px-6 py-3.5 bg-[#f7fafc] border-t border-[#ebf2f6] flex items-center justify-between">
                    <span className="text-[12.5px] text-[#647b8a]">
                      {currentClassObj.submittedToday && !currentClassObj.isEditing
                        ? 'Attendance submitted for today.'
                        : 'Select Present, Absent, or Late and submit to dispatch parent alerts.'}
                    </span>
                    {(!currentClassObj.submittedToday || currentClassObj.isEditing) && (
                      <button
                        type="button"
                        onClick={() => handleSubmitClassAttendance(currentClassObj.id)}
                        className="px-4 py-2 rounded-xl bg-[#178466] hover:bg-[#136a54] text-white text-[12.5px] font-semibold transition"
                      >
                        Submit Attendance
                      </button>
                    )}
                  </div>
                </div>

                {/* Right 4 Cols: Automation Activity Log */}
                <div className="lg:col-span-4 bg-white rounded-2xl border border-[#e3edf2] p-5 shadow-[0_1px_2px_rgba(16,42,56,0.03)]">
                  <div className="flex items-center gap-2">
                    <GitBranch className="w-4 h-4 text-[#136a54]" />
                    <h3 className="text-[14.5px] font-bold text-[#132a38]">
                      Automation activity
                    </h3>
                  </div>
                  <p className="text-[12px] text-[#7a909e] mt-1 leading-relaxed">
                    Simulated n8n workflow log. Submitting triggers the absence-alert webhook.
                  </p>

                  <div className="mt-4 space-y-3.5">
                    {automationLogs.map((log) => (
                      <div key={log.id} className="flex items-start gap-2.5 text-[12.5px]">
                        <span
                          className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                            log.type === 'flag' ? 'bg-[#e11d48]' : 'bg-[#10b981]'
                          }`}
                        />
                        <div>
                          <p className="text-[#1e3544] font-medium leading-snug">{log.text}</p>
                          <p className="text-[11px] text-[#8ba0ad] mt-0.5">{log.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
  );
}
