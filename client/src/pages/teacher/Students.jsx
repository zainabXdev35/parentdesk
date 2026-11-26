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

export default function TeacherStudents() {
  const setActiveNav = useGo();
  const { summary } = useSchool();
  const { flaggedOnly: flaggedOnlyFilter, setFlaggedOnly: setFlaggedOnlyFilter, setStudentModal: setSelectedStudentModal } = useTeacherUI();
  const [studentSearch, setStudentSearch] = useState('');
  const [studentClassFilter, setStudentClassFilter] = useState('All');

  const filteredAllStudents = useMemo(() => summary.allStudents.filter((st) => {
    const matchesClass = studentClassFilter === 'All' || st.classId === studentClassFilter;
    const matchesFlag = !flaggedOnlyFilter || st.absences >= 3;
    const q = studentSearch.trim().toLowerCase();
    const matchesQuery = !q || st.name.toLowerCase().includes(q) || st.parent.toLowerCase().includes(q) || st.classId.toLowerCase().includes(q);
    return matchesClass && matchesFlag && matchesQuery;
  }), [summary.allStudents, studentClassFilter, flaggedOnlyFilter, studentSearch]);
  return (
            <div className="space-y-5">
              <div>
                <h2 className="text-[22px] font-bold text-[#132a38] tracking-tight">
                  My Students
                </h2>
                <p className="text-[13px] text-[#6a8190] mt-0.5">
                  All {summary.totalStudents} students across Class 8-A, Class 9-B, and Class 10-A
                </p>
              </div>

              {/* Search & Class / Flagged Filters */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  {['All', 'Class 8-A', 'Class 9-B', 'Class 10-A'].map((clsName) => (
                    <button
                      key={clsName}
                      type="button"
                      onClick={() => setStudentClassFilter(clsName)}
                      className={`px-3.5 py-2 rounded-xl text-[12.5px] font-semibold transition ${
                        studentClassFilter === clsName
                          ? 'bg-[#178466] text-white'
                          : 'bg-white text-[#344d5c] border border-[#dce7ed] hover:bg-[#f0f6f9]'
                      }`}
                    >
                      {clsName}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => setFlaggedOnlyFilter(!flaggedOnlyFilter)}
                    className={`px-3.5 py-2 rounded-xl text-[12.5px] font-semibold border transition flex items-center gap-1.5 ${
                      flaggedOnlyFilter
                        ? 'bg-[#fde8ec] border-[#f5c2cb] text-[#c93b52]'
                        : 'bg-white border-[#dce7ed] text-[#344d5c]'
                    }`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Flagged only ({summary.flaggedStudents.length})</span>
                  </button>
                </div>

                <div className="relative w-full md:w-64">
                  <Search className="w-4 h-4 text-[#8ba0ad] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    placeholder="Search student or parent..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-[#dce7ed] text-[13px] text-[#132a38] focus:outline-none focus:border-[#178466]"
                  />
                </div>
              </div>

              {/* Directory Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredAllStudents.map((st) => (
                  <div
                    key={st.id}
                    onClick={() => setSelectedStudentModal(st)}
                    className="cursor-pointer bg-white hover:border-[#b7d1de] rounded-2xl border border-[#e3edf2] p-4 shadow-[0_1px_2px_rgba(16,42,56,0.03)] flex items-center justify-between transition"
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
                          {st.classId} · Roll {st.roll} · {st.parent}
                        </p>
                        <p className="text-[11.5px] text-[#5c7382] mt-1">
                          {st.absences} absences · <strong>{st.avg}% avg</strong>
                        </p>
                      </div>
                    </div>

                    {st.absences >= 3 ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#fbe2e5] text-[#c93b52] text-[11px] font-semibold shrink-0 ml-2">
                        Flagged
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#e4f7ed] text-[#15804d] text-[11px] font-semibold shrink-0 ml-2">
                        Good
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
  );
}
