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



export default function TeacherStudentModal() {
  const navigate = useNavigate();
  const { studentModal: selectedStudentModal, setStudentModal: setSelectedStudentModal, setSelectedClassId } = useTeacherUI();
  const setActiveNav = (id) => navigate(`/teacher/${id}`);
  if (!selectedStudentModal) return null;
  return (
        <div
          onClick={() => setSelectedStudentModal(null)}
          className="fixed inset-0 z-50 bg-[#0c2938]/50 backdrop-blur-[1px] flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl border border-[#e3edf2] max-w-md w-full p-6 shadow-xl space-y-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-full ${selectedStudentModal.avatarBg} text-white font-bold text-sm flex items-center justify-center`}
                >
                  {selectedStudentModal.initials}
                </div>
                <div>
                  <h4 className="text-[16px] font-bold text-[#132a38]">
                    {selectedStudentModal.name}
                  </h4>
                  <p className="text-[12px] text-[#718796]">
                    {selectedStudentModal.classId} · Roll {selectedStudentModal.roll}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStudentModal(null)}
                className="text-[#7a909e] hover:text-[#132a38] p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="rounded-xl bg-[#f4f8fa] p-3">
                <p className="text-[11px] text-[#718796]">Quiz 1</p>
                <p className="text-[16px] font-bold text-[#132a38] mt-0.5">
                  {selectedStudentModal.quiz1}%
                </p>
              </div>
              <div className="rounded-xl bg-[#f4f8fa] p-3">
                <p className="text-[11px] text-[#718796]">Midterm</p>
                <p className="text-[16px] font-bold text-[#132a38] mt-0.5">
                  {selectedStudentModal.midterm}%
                </p>
              </div>
              <div className="rounded-xl bg-[#f4f8fa] p-3">
                <p className="text-[11px] text-[#718796]">Absences</p>
                <p
                  className={`text-[16px] font-bold mt-0.5 ${
                    selectedStudentModal.absences >= 3
                      ? 'text-[#c93b52]'
                      : 'text-[#132a38]'
                  }`}
                >
                  {selectedStudentModal.absences}
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-[#f7fafc] border border-[#ebf2f6] p-3.5 text-[12.5px] space-y-1.5">
              <div className="flex items-center gap-2 text-[#344d5c]">
                <BookOpen className="w-3.5 h-3.5 text-[#178466]" />
                <span>
                  Guardian: <strong>{selectedStudentModal.parent}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2 text-[#344d5c]">
                <Phone className="w-3.5 h-3.5 text-[#0b9b61]" />
                <span>WhatsApp: {selectedStudentModal.phone}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setSelectedClassId(selectedStudentModal.classId);
                  setSelectedStudentModal(null);
                  setActiveNav('attendance');
                }}
                className="px-4 py-2 rounded-xl bg-[#178466] text-white text-[12.5px] font-semibold"
              >
                Open Class Roster
              </button>
            </div>
          </div>
        </div>
  );
}
