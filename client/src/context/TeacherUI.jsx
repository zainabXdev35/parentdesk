// UI-only state shared between teacher pages (selected class, active comment tab, etc.).
// Business data lives in SchoolContext, so it is shared with admin & parent portals.
import { createContext, useContext, useMemo, useState } from 'react';
import { useSchool } from './SchoolContext.jsx';
import TeacherStudentModal from '../pages/teacher/StudentModal.jsx';

const Ctx = createContext(null);
export const useTeacherUI = () => useContext(Ctx);

export function TeacherProvider({ children }) {
  const { classes, allStudents } = useSchool();
  const [selectedClassId, setSelectedClassId] = useState('Class 9-B');
  const [commentTab, setCommentTab] = useState('review');
  const [flaggedOnly, setFlaggedOnly] = useState(false);
  const [modalId, setModalId] = useState(null);

  const currentClassObj = useMemo(() => classes.find((c) => c.id === selectedClassId) || classes[0], [classes, selectedClassId]);
  const studentModal = allStudents.find((s) => s.id === modalId) || null; // always live data
  const setStudentModal = (st) => setModalId(st ? st.id : null);

  return (
    <Ctx.Provider value={{ selectedClassId, setSelectedClassId, currentClassObj, commentTab, setCommentTab, flaggedOnly, setFlaggedOnly, studentModal, setStudentModal }}>
      {children}
      <TeacherStudentModal />
    </Ctx.Provider>
  );
}
