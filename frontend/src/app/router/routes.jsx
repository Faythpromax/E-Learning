import { Routes, Route } from 'react-router-dom';
import HomePage from '../../features/home/pages/HomePage';
import LoginRolePage from '../../features/auth/pages/LoginRolePage';
import LoginStudentPage from '../../features/auth/pages/LoginStudentPage';
import LoginTeacherPage from '../../features/auth/pages/LoginTeacherPage';
import RegisterRolePage from '../../features/auth/pages/RegisterRolePage';
import RegisterStudentPage from '../../features/auth/pages/RegisterStudentPage';
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
import PracticeListPage from '../../features/student/pages/PracticeListPage';
import PracticeSessionPage from '../../features/student/pages/PracticeSessionPage';
import PracticeCompletePage from '../../features/student/pages/PracticeCompletePage';
import TestListPage from '../../features/student/pages/TestListPage';
import TestSessionPage from '../../features/student/pages/TestSessionPage';
import TestResultPage from '../../features/student/pages/TestResultPage';
import TeacherDashboardPage from '../../features/teacher/pages/TeacherDashboardPage';
import QuestionListPage from '../../features/teacher/pages/QuestionListPage';
import CreateQuestionPage from '../../features/teacher/pages/CreateQuestionPage';
import ClassListPage from '../../features/teacher/pages/ClassListPage';
import CreateClassPage from '../../features/teacher/pages/CreateClassPage';
import ClassDetailPage from '../../features/teacher/pages/ClassDetailPage';
import TeacherTestListPage from '../../features/teacher/pages/TestListPage';
import CreateTestPage from '../../features/teacher/pages/CreateTestPage';
import TestResultsPage from '../../features/teacher/pages/TestResultsPage';
import ProtectedRoute from '../../components/common/ProtectedRoute';

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
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/teachers"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <TeacherListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/students"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <StudentListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/feedback"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <FeedbackPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <SettingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users/edit/:id"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <EditUserPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/grades"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentGradesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/support"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentSupportPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/settings"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentSettingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/classes/:classId"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentClassDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/practice"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <PracticeListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/practice/random"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <PracticeSessionPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/practice/subjects"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <PracticeSessionPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/practice/complete"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <PracticeCompletePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/teacher/dashboard"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <TeacherDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/questions"
        element={
          <ProtectedRoute allowedRoles={['teacher', 'admin']}>
            <QuestionListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/questions/create"
        element={
          <ProtectedRoute allowedRoles={['teacher', 'admin']}>
            <CreateQuestionPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/questions/edit/:id"
        element={
          <ProtectedRoute allowedRoles={['teacher', 'admin']}>
            <CreateQuestionPage />
          </ProtectedRoute>
        }
      />

      {/* Student Test Routes */}
      <Route
        path="/student/tests"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <TestListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/tests/:testId"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <TestSessionPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/tests/:attemptId/results"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <TestResultPage />
          </ProtectedRoute>
        }
      />

      {/* Teacher Test Routes */}
      <Route
        path="/teacher/tests"
        element={
          <ProtectedRoute allowedRoles={['teacher', 'admin']}>
            <TeacherTestListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/tests/create"
        element={
          <ProtectedRoute allowedRoles={['teacher', 'admin']}>
            <CreateTestPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/tests/:testId/edit"
        element={
          <ProtectedRoute allowedRoles={['teacher', 'admin']}>
            <CreateTestPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/tests/:testId/results"
        element={
          <ProtectedRoute allowedRoles={['teacher', 'admin']}>
            <TestResultsPage />
          </ProtectedRoute>
        }
      />

      {/* Teacher Class Routes */}
      <Route
        path="/teacher/classes"
        element={
          <ProtectedRoute allowedRoles={['teacher', 'admin']}>
            <ClassListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/classes/create"
        element={
          <ProtectedRoute allowedRoles={['teacher', 'admin']}>
            <CreateClassPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/classes/:classId"
        element={
          <ProtectedRoute allowedRoles={['teacher', 'admin']}>
            <ClassDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/classes/:classId/edit"
        element={
          <ProtectedRoute allowedRoles={['teacher', 'admin']}>
            <CreateClassPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}