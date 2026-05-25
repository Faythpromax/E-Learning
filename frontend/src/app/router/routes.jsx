import { Routes, Route } from 'react-router-dom';
import HomePage from '../../features/home/pages/HomePage';
import LoginRolePage from '../../features/auth/pages/LoginRolePage';
import LoginStudentPage from '../../components/auth/pages/LoginStudentPage';
import LoginTeacherPage from '../../features/auth/pages/LoginTeacherPage';
import RegisterRolePage from '../../features/auth/pages/RegisterRolePage';
import RegisterStudentPage from '../../components/auth/pages/RegisterStudentPage';
import RegisterTeacherPage from '../../features/auth/pages/RegisterTeacherPage';
import AdminLoginPage from '../../features/admin/pages/AdminLoginPage';
import AdminDashboardPage from '../../features/admin/pages/AdminDashboardPage';
import TeacherListPage from '../../features/admin/pages/TeacherListPage';
import StudentListPage from '../../features/admin/pages/StudentListPage';
import FeedbackPage from '../../features/admin/pages/FeedbackPage';
import SettingsPage from '../../features/admin/pages/SettingsPage';
import EditUserPage from '../../features/admin/pages/EditUserPage';
import StudentDashboardPage from '../../features/student/pages/StudentDashboardPage';
import StudentGradesPage from '../../features/student/pages/StudentGradesPage';
import StudentSupportPage from '../../features/student/pages/StudentSupportPage';
import StudentSettingsPage from '../../features/student/pages/StudentSettingsPage';
import StudentClassDetailPage from '../../features/student/pages/StudentClassDetailPage';
import TeacherDashboardPage from '../../features/teacher/pages/TeacherDashboardPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route path="/login" element={<LoginRolePage />} />
      <Route path="/login/student" element={<LoginStudentPage />} />
      <Route path="/login/teacher" element={<LoginTeacherPage />} />

      <Route path="/register" element={<RegisterRolePage />} />
      <Route path="/register/student" element={<RegisterStudentPage />} />
      <Route path="/register/teacher" element={<RegisterTeacherPage />} />

      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
      <Route path="/admin/teachers" element={<TeacherListPage />} />
      <Route path="/admin/students" element={<StudentListPage />} />
      <Route path="/admin/feedback" element={<FeedbackPage />} />
      <Route path="/admin/settings" element={<SettingsPage />} />
      <Route path="/admin/users/edit/:id" element={<EditUserPage />} />

      <Route path="/student/dashboard" element={<StudentDashboardPage />} />
      <Route path="/student/grades" element={<StudentGradesPage />} />
      <Route path="/student/support" element={<StudentSupportPage />} />
      <Route path="/student/settings" element={<StudentSettingsPage />} />
      <Route path="/student/classes/:classId" element={<StudentClassDetailPage />} />

      <Route path="/teacher/dashboard" element={<TeacherDashboardPage />} />
      
    </Routes>
  );
}