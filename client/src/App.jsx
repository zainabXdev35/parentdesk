import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import AppShell from './components/AppShell.jsx';
import Login from './pages/Login.jsx';
import { TeacherProvider } from './context/TeacherUI.jsx';

// Route-level code splitting: each page is fetched only when first visited.
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard.jsx'));
const AdminStudents = lazy(() => import('./pages/admin/Students.jsx'));
const AdminFees = lazy(() => import('./pages/admin/Fees.jsx'));
const AdminReminders = lazy(() => import('./pages/admin/Reminders.jsx'));
const AdminDocuments = lazy(() => import('./pages/admin/Documents.jsx'));
const AdminTickets = lazy(() => import('./pages/admin/Tickets.jsx'));
const AdminAudit = lazy(() => import('./pages/admin/AuditLog.jsx'));
const TeacherDashboard = lazy(() => import('./pages/teacher/Dashboard.jsx'));
const TeacherAttendance = lazy(() => import('./pages/teacher/Attendance.jsx'));
const TeacherMarks = lazy(() => import('./pages/teacher/Marks.jsx'));
const TeacherComments = lazy(() => import('./pages/teacher/Comments.jsx'));
const TeacherStudents = lazy(() => import('./pages/teacher/Students.jsx'));
const ParentDashboard = lazy(() => import('./pages/parent/Dashboard.jsx'));
const ParentAttendance = lazy(() => import('./pages/parent/Attendance.jsx'));
const ParentFees = lazy(() => import('./pages/parent/Fees.jsx'));
const ParentProgress = lazy(() => import('./pages/parent/Progress.jsx'));
const ParentAssistant = lazy(() => import('./pages/parent/Assistant.jsx'));
const ParentNotifications = lazy(() => import('./pages/parent/Notifications.jsx'));

// Role-based route guard: wrong role → bounced to their own area.
function Protected({ role, children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to={`/${user.role}`} replace />;
  return children;
}

const Loading = () => <div className="p-10 text-center text-sm text-slate-400">Loading…</div>;

export default function App() {
  const { user } = useAuth();
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/login" element={user ? <Navigate to={`/${user.role}`} replace /> : <Login />} />

        <Route path="/admin" element={<Protected role="admin"><AppShell /></Protected>}>
          <Route index element={<AdminDashboard />} />
          <Route path="students" element={<AdminStudents />} />
          <Route path="fees" element={<AdminFees />} />
          <Route path="reminders" element={<AdminReminders />} />
          <Route path="documents" element={<AdminDocuments />} />
          <Route path="tickets" element={<AdminTickets />} />
          <Route path="audit" element={<AdminAudit />} />
        </Route>

        <Route path="/teacher" element={<Protected role="teacher"><TeacherProvider><AppShell /></TeacherProvider></Protected>}>
          <Route index element={<TeacherDashboard />} />
          <Route path="attendance" element={<TeacherAttendance />} />
          <Route path="marks" element={<TeacherMarks />} />
          <Route path="comments" element={<TeacherComments />} />
          <Route path="students" element={<TeacherStudents />} />
        </Route>

        <Route path="/parent" element={<Protected role="parent"><AppShell /></Protected>}>
          <Route index element={<ParentDashboard />} />
          <Route path="attendance" element={<ParentAttendance />} />
          <Route path="fees" element={<ParentFees />} />
          <Route path="progress" element={<ParentProgress />} />
          <Route path="assistant" element={<ParentAssistant />} />
          <Route path="notifications" element={<ParentNotifications />} />
        </Route>

        <Route path="*" element={<Navigate to={user ? `/${user.role}` : '/login'} replace />} />
      </Routes>
    </Suspense>
  );
}
