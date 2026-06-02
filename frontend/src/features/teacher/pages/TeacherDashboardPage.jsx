import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiFileText, FiUsers, FiCheckCircle, FiTrendingUp, FiBookOpen, FiClock } from 'react-icons/fi';
import { useAuth } from '../../../contexts/AuthContext';
import TeacherLayout from '../../../components/teacher/TeacherLayout';
import ClassCard from '../../../components/teacher/ClassCard';
import AssignmentCard from '../../../components/teacher/AssignmentCard';
import { testApi } from '../../../api/testApi';
import { classApi } from '../../../api/classApi';
import { userApi } from '../../../api/userApi';
import { questionApi } from '../../../api/questionApi';
import "./teacher.css";

const TeacherDashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [stats, setStats] = useState({
    totalTests: 0,
    totalQuestions: 0,
    totalStudents: 0,
    totalSubmissions: 0
  });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [testsRes, classesRes, studentsRes, questionsRes] = await Promise.all([
        testApi.getTests(),
        classApi.getClasses(),
        userApi.getStudents(),
        questionApi.getQuestions(),
      ]);

      const tests = testsRes.data || [];
      const classesData = classesRes.data || [];
      const students = studentsRes.data || [];
      const questions = questionsRes.data || [];

      setStats({
        totalTests: tests.length,
        totalQuestions: questions.length,
        totalStudents: students.length,
        totalSubmissions: tests.reduce((sum, test) => sum + (test.attempts?.length || 0), 0),
      });

      setClasses(classesData);
      setAssignments(tests.slice(0, 5));
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClass = () => {
    navigate('/teacher/classes/create');
  };

  const handleCreateTest = () => {
    navigate('/teacher/tests/create');
  };

  return (
    <TeacherLayout pageTitle="Trang chủ giáo viên">
      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải dữ liệu...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Welcome */}
          <div className="mb-8 rounded-3xl bg-white p-8 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-sm text-gray-500">Xin chào</p>
                <h1 className="text-3xl font-bold text-gray-900">{user?.name || 'Giáo viên'}</h1>
                <p className="text-gray-500 mt-2">Tổng quan nhanh về lớp, học sinh và đề thi.</p>
              </div>
              <div className="inline-flex items-center gap-3 rounded-2xl bg-blue-50 px-5 py-4">
                <FiUsers className="text-blue-600 text-2xl" />
                <div>
                  <p className="text-xs uppercase tracking-wide text-blue-600">Tổng học sinh</p>
                  <p className="text-2xl font-semibold text-blue-900">{stats.totalStudents}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium mb-1">Tổng số đề thi</p>
                  <h3 className="text-3xl font-bold">{stats.totalTests}</h3>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <FiFileText className="text-2xl" />
                </div>
              </div>
              <p className="text-blue-100 text-xs mt-2 flex items-center gap-1">
                <FiTrendingUp /> Tăng 12% tháng này
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium mb-1">Tổng số câu hỏi</p>
                  <h3 className="text-3xl font-bold">{stats.totalQuestions}</h3>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <FiBookOpen className="text-2xl" />
                </div>
              </div>
              <p className="text-green-100 text-xs mt-2 flex items-center gap-1">
                <FiTrendingUp /> Tăng 8% tháng này
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium mb-1">Tổng số học sinh</p>
                  <h3 className="text-3xl font-bold">{stats.totalStudents}</h3>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <FiUsers className="text-2xl" />
                </div>
              </div>
              <p className="text-purple-100 text-xs mt-2 flex items-center gap-1">
                <FiTrendingUp /> 3 học sinh mới
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium mb-1">Số bài nộp</p>
                  <h3 className="text-3xl font-bold">{stats.totalSubmissions}</h3>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <FiCheckCircle className="text-2xl" />
                </div>
              </div>
              <p className="text-orange-100 text-xs mt-2 flex items-center gap-1">
                <FiTrendingUp /> 95% hoàn thành
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 button-group">
            <button
              onClick={handleCreateTest}
              className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <FiPlus className="text-xl text-blue-600" />
              </div>
              <div className="text-left">
                <h4 className="font-semibold text-gray-800">Tạo đề thi mới</h4>
                <p className="text-sm text-gray-500">Tạo bộ đề thi nhanh chóng</p>
              </div>
            </button>

            <button
              onClick={handleCreateClass}
              className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <FiUsers className="text-xl text-green-600" />
              </div>
              <div className="text-left">
                <h4 className="font-semibold text-gray-800">Tạo lớp học mới</h4>
                <p className="text-sm text-gray-500">Tạo lớp và thêm học sinh</p>
              </div>
            </button>
          </div>

          {/* Recent Classes Section */}
          <div className="dashboard-section mb-8">
            <div className="dashboard-section-header">
              <h2 className="dashboard-section-title">Lớp học mới nhất</h2>
              <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                Xem tất cả →
              </button>
            </div>
            <div className="dashboard-grid">
              {classes.length > 0 ? (
                classes.map((classItem, index) => (
                  <ClassCard
                    key={classItem.id || index}
                    classData={{
                      ...classItem,
                      color: classItem.color || ['#4ec28a', '#6366f1', '#ec4899', '#f59e0b'][index % 4],
                      avatar: classItem.name?.charAt(0)?.toUpperCase() || 'C',
                      teacher: 'Ban'
                    }}
                  />
                ))
              ) : (
                <div className="col-span-full bg-white p-8 rounded-xl text-center border border-dashed border-gray-300">
                  <FiUsers className="text-4xl text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 mb-4">Bạn chưa có lớp học nào</p>
                  <button
                    onClick={handleCreateClass}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Tạo lớp đầu tiên
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Recent Assignments Section */}
          <div className="dashboard-section">
            <div className="dashboard-section-header">
              <h2 className="dashboard-section-title">Đề thi mới nhất</h2>
              <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                Xem tất cả →
              </button>
            </div>
            <div className="space-y-3">
              {assignments.length > 0 ? (
                assignments.map((assignment) => (
                  <div key={assignment.id} className="bg-white p-4 rounded-xl border border-gray-100 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FiFileText className="text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">{assignment.title}</h4>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <FiClock /> {assignment.duration ? `${assignment.duration} phút` : 'Không giới hạn'}
                          </p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        assignment.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {assignment.is_active ? 'Đang mở' : 'Đã đóng'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white p-8 rounded-xl text-center border border-dashed border-gray-300">
                  <FiFileText className="text-4xl text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 mb-4">Bạn chưa tạo đề thi nào</p>
                  <button
                    onClick={handleCreateTest}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Tạo đề thi đầu tiên
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </TeacherLayout>
  );
};

export default TeacherDashboardPage;
