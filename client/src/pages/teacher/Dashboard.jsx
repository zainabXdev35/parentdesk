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

export default function TeacherDashboard() {
  const setActiveNav = useGo();
  const { summary, classes: classesData } = useSchool();
  const { setSelectedClassId, setFlaggedOnly: setFlaggedOnlyFilter, setStudentModal: setSelectedStudentModal } = useTeacherUI();
  const [hoveredBarGroup, setHoveredBarGroup] = useState(null);
  return (
            <div className="space-y-6">
              <div>
                <h2 className="text-[22px] font-bold text-[#132a38] tracking-tight">
                  Good day, Ayesha
                </h2>
                <p className="text-[13px] text-[#6a8190] mt-0.5">
                  Here is what needs your attention today.
                </p>
              </div>

              {/* 4 KPI Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {/* My classes */}
                <div className="bg-white rounded-2xl border border-[#e3edf2] p-5 shadow-[0_1px_2px_rgba(16,42,56,0.03)]">
                  <div className="flex items-center justify-between">
                    <span className="text-[12.5px] font-medium text-[#647b8a]">My classes</span>
                    <div className="w-8 h-8 rounded-lg bg-[#e8f3f8] text-[#1a6e8c] flex items-center justify-center">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-[26px] font-bold text-[#132a38] mt-2 leading-tight">
                    {summary.totalClassesCount}
                  </p>
                  <p className="text-[11.5px] text-[#7a909e] mt-1">
                    {summary.totalStudents} students
                  </p>
                </div>

                {/* Attendance today */}
                <div className="bg-white rounded-2xl border border-[#e3edf2] p-5 shadow-[0_1px_2px_rgba(16,42,56,0.03)]">
                  <div className="flex items-center justify-between">
                    <span className="text-[12.5px] font-medium text-[#647b8a]">
                      Attendance today
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-[#fef6e6] text-[#d98218] flex items-center justify-center">
                      <Calendar className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-[26px] font-bold text-[#132a38] mt-2 leading-tight">
                    {summary.markedClassesCount}/{summary.totalClassesCount}
                  </p>
                  <p className="text-[11.5px] text-[#7a909e] mt-1">
                    {summary.remainingToMark === 0
                      ? 'All classes marked'
                      : `${summary.remainingToMark} still to mark`}
                  </p>
                </div>

                {/* Comments to approve */}
                <div className="bg-white rounded-2xl border border-[#e3edf2] p-5 shadow-[0_1px_2px_rgba(16,42,56,0.03)]">
                  <div className="flex items-center justify-between">
                    <span className="text-[12.5px] font-medium text-[#647b8a]">
                      Comments to approve
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-[#fef7e6] text-[#e09119] flex items-center justify-center">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-[26px] font-bold text-[#132a38] mt-2 leading-tight">
                    {summary.reviewCommentsCount}
                  </p>
                  <p className="text-[11.5px] text-[#7a909e] mt-1">AI drafts waiting for you</p>
                </div>

                {/* Flagged students */}
                <div className="bg-white rounded-2xl border border-[#e3edf2] p-5 shadow-[0_1px_2px_rgba(16,42,56,0.03)]">
                  <div className="flex items-center justify-between">
                    <span className="text-[12.5px] font-medium text-[#647b8a]">
                      Flagged students
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-[#fdeeee] text-[#dc4c64] flex items-center justify-center">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-[26px] font-bold text-[#132a38] mt-2 leading-tight">
                    {summary.flaggedStudents.length}
                  </p>
                  <p className="text-[11.5px] text-[#7a909e] mt-1">3+ recent absences</p>
                </div>
              </div>

              {/* Middle Split Row: Class average by assessment + Today */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Left 8 Cols: Grouped Bar Chart */}
                <div className="lg:col-span-8 bg-white rounded-2xl border border-[#e3edf2] p-6 shadow-[0_1px_2px_rgba(16,42,56,0.03)] flex flex-col justify-between">
                  <div>
                    <h3 className="text-[15px] font-bold text-[#132a38]">
                      Class average by assessment
                    </h3>
                    <p className="text-[12px] text-[#7a909e] mt-0.5">
                      Percentage score, all your classes
                    </p>
                  </div>

                  {/* Chart Canvas */}
                  <div className="mt-6 pt-2">
                    <div className="relative h-52 flex">
                      {/* Y-axis labels */}
                      <div className="w-10 flex flex-col justify-between text-[11px] text-[#7a909e] pr-2 pb-6 select-none">
                        <span>100%</span>
                        <span>75%</span>
                        <span>50%</span>
                        <span>25%</span>
                        <span>0%</span>
                      </div>

                      {/* Plot Area */}
                      <div className="flex-1 relative flex flex-col justify-between pb-6">
                        {/* Dashed Gridlines */}
                        {[100, 75, 50, 25, 0].map((tick) => (
                          <div
                            key={tick}
                            className="w-full border-b border-dashed border-[#e6eff4] h-0"
                          />
                        ))}

                        {/* Grouped Bars */}
                        <div className="absolute inset-x-0 top-0 bottom-6 grid grid-cols-2 gap-6 px-4 sm:px-10">
                          {['quiz1', 'midterm'].map((metricKey) => {
                            const label = metricKey === 'quiz1' ? 'Quiz 1' : 'Midterm';
                            const barColors = {
                              'Class 8-A': 'bg-[#10708e] hover:bg-[#0d5c75]',
                              'Class 9-B': 'bg-[#0fb594] hover:bg-[#0c9a7e]',
                              'Class 10-A': 'bg-[#6c7cf5] hover:bg-[#5869e8]'
                            };

                            return (
                              <div
                                key={metricKey}
                                onMouseEnter={() => setHoveredBarGroup(metricKey)}
                                onMouseLeave={() => setHoveredBarGroup(null)}
                                className="relative flex items-end justify-center gap-2 sm:gap-2.5 h-full"
                              >
                                {hoveredBarGroup === metricKey && (
                                  <div className="absolute -top-9 z-10 bg-[#0c2938] text-white text-[11px] px-2.5 py-1 rounded-lg shadow-md whitespace-nowrap">
                                    {label}:{' '}
                                    {summary.classAverages
                                      .map((c) => `${c.id.replace('Class ', '')} (${c[metricKey]}%)`)
                                      .join(' · ')}
                                  </div>
                                )}
                                {summary.classAverages.map((clsAvg) => (
                                  <div
                                    key={clsAvg.id}
                                    style={{ height: `${clsAvg[metricKey]}%` }}
                                    className={`w-10 sm:w-14 rounded-t-md transition-all duration-300 ${
                                      barColors[clsAvg.id]
                                    }`}
                                    title={`${clsAvg.id} ${label}: ${clsAvg[metricKey]}%`}
                                  />
                                ))}
                              </div>
                            );
                          })}
                        </div>

                        {/* X-axis labels */}
                        <div className="absolute inset-x-0 bottom-0 grid grid-cols-2 px-4 sm:px-10 text-center text-[12px] text-[#5c7382] font-medium">
                          <span>Quiz 1</span>
                          <span>Midterm</span>
                        </div>
                      </div>
                    </div>

                    {/* Legend */}
                    <div className="mt-4 flex items-center justify-center gap-6 text-[12px] text-[#5c7382]">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#10708e]" />
                        <span>Class 8-A</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#0fb594]" />
                        <span>Class 9-B</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#6c7cf5]" />
                        <span>Class 10-A</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right 4 Cols: Today */}
                <div className="lg:col-span-4 bg-white rounded-2xl border border-[#e3edf2] p-6 shadow-[0_1px_2px_rgba(16,42,56,0.03)] flex flex-col justify-between">
                  <div>
                    <h3 className="text-[15px] font-bold text-[#132a38] mb-4">Today</h3>
                    <div className="space-y-3">
                      {classesData.map((cls) => (
                        <div
                          key={cls.id}
                          className="rounded-xl bg-[#f7fafc] border border-[#ebf2f6] px-4 py-3 flex items-center justify-between"
                        >
                          <div>
                            <p className="text-[13.5px] font-bold text-[#132a38]">{cls.id}</p>
                            <p className="text-[11.5px] text-[#7a909e] mt-0.5">{cls.room}</p>
                          </div>

                          {cls.submittedToday ? (
                            <span className="px-2.5 py-1 rounded-full bg-[#e4f7ed] text-[#178754] text-[11.5px] font-semibold">
                              Marked
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedClassId(cls.id);
                                setActiveNav('attendance');
                              }}
                              className="text-[12.5px] font-semibold text-[#136a54] hover:text-[#115544] flex items-center gap-1 transition"
                            >
                              <span>Mark now</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Warm Amber Review Pill */}
                  <button
                    type="button"
                    onClick={() => setActiveNav('comments')}
                    className="mt-4 w-full rounded-xl bg-[#fdf4e3] hover:bg-[#fbeccd] border border-[#f7e3bd] px-4 py-3 flex items-center justify-between text-[#a86212] transition"
                  >
                    <div className="flex items-center gap-2 text-[12.5px] font-semibold">
                      <Sparkles className="w-4 h-4 text-[#d98218]" />
                      <span>
                        {summary.reviewCommentsCount} AI{' '}
                        {summary.reviewCommentsCount === 1 ? 'comment' : 'comments'} to review
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Bottom Section: Students needing attention */}
              <div className="bg-white rounded-2xl border border-[#e3edf2] p-6 shadow-[0_1px_2px_rgba(16,42,56,0.03)]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[15px] font-bold text-[#132a38]">
                    Students needing attention
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setFlaggedOnlyFilter(true);
                      setActiveNav('students');
                    }}
                    className="text-[12.5px] font-semibold text-[#136a54] hover:underline"
                  >
                    View all
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {summary.flaggedStudents.slice(0, 3).map((st) => (
                    <div
                      key={st.id}
                      onClick={() => setSelectedStudentModal(st)}
                      className="cursor-pointer rounded-xl bg-[#fbf5f6] hover:bg-[#f8ecee] border border-[#f2e2e5] p-4 flex items-center justify-between transition"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-10 h-10 rounded-full ${st.avatarBg} text-white font-bold text-xs flex items-center justify-center shrink-0`}
                        >
                          {st.initials}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[13.5px] font-bold text-[#132a38] truncate">
                            {st.name}
                          </p>
                          <p className="text-[11.5px] text-[#718796] mt-0.5 truncate">
                            {st.classId} · {st.absences} absences · {st.avg}% avg
                          </p>
                        </div>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#fbe2e5] text-[#c93b52] text-[11px] font-semibold shrink-0 ml-2">
                        Flagged
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
  );
}
