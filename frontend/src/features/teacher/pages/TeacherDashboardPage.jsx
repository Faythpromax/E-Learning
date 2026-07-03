import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiFileText, FiUsers, FiCheckCircle, FiBookOpen, FiClock, FiHelpCircle } from 'react-icons/fi';
import { useAuth } from '../../../contexts/AuthContext';
import TeacherLayout from '../../../components/teacher/TeacherLayout';
import ClassCard from '../../../components/teacher/ClassCard';
import { testApi } from '../../../api/testApi';
import { classApi } from '../../../api/classApi';
import { userApi } from '../../../api/userApi';
import { questionApi } from '../../../api/questionApi';

const calculateExamStatus = (exam) => {
  if (!exam) return false;
  const now = new Date();
  const startTime = exam.start_time ? new Date(exam.start_time) : null;
  const endTime = exam.end_time ? new Date(exam.end_time) : null;

  if (startTime && now < startTime) return false; // Not started yet
  if (endTime && now > endTime) return false; // Already ended
  return true; // Open
};

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

  const getFormattedDate = () => {
    const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    const now = new Date();
    const dayName = days[now.getDay()];
    const date = now.getDate();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    return `${dayName}, ${date}/${month}/${year}`;
  };
  
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
        questionApi.getClassQuestions(),
      ]);

      const tests = (testsRes.data || []).map(test => ({
        ...test,
        is_active: calculateExamStatus(test)
      }));
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

  const handleManageQuestions = () => {
    navigate('/teacher/questions');
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
        <div className="flex flex-col gap-6 w-full text-left">
          
          {/* Welcome */}
          <div className="block rounded-3xl bg-white shadow-sm border border-gray-100 p-6 relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                  Chào mừng trở lại 👋
                </p>
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mt-1">
                  {user?.full_name || user?.name || 'Giáo viên'}
                </h1>
                <p className="text-gray-500 mt-2 text-[15px]">
                  Tổng quan nhanh về lớp học, học sinh và bài kiểm tra của bạn.
                </p>
              </div>
              <div className="md:text-right">
                <span className="inline-flex items-center px-4 py-2 bg-slate-50 text-slate-600 rounded-2xl text-sm font-semibold border border-slate-100 shadow-sm">
                  {getFormattedDate()}
                </span>
              </div>
            </div>
          </div>

          {/* Stats Cards - Đã sửa lỗi co giãn và khoảng cách */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full h-auto relative z-10">
            
            {/* Thẻ 1: Tổng số bài kiểm tra */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl text-white shadow-lg p-5 flex flex-col justify-between min-h-[140px] transition-all hover:shadow-xl hover:-translate-y-1 duration-200">
              <div className="flex justify-between items-start w-full">
                <div>
                  <p className="text-xs opacity-90 font-medium tracking-wide">Tổng số bài kiểm tra</p>
                  <h3 className="text-3xl font-bold mt-1 leading-none">{stats.totalTests}</h3>
                </div>
                <div className="w-9 h-9 bg-white/25 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FiFileText className="text-lg" />
                </div>
              </div>
              <p className="text-[11px] opacity-80 pt-2 border-t border-white/15 mt-4">
                Đã tạo
              </p>
            </div>

            {/* Thẻ 2: Tổng số câu hỏi */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl text-white shadow-lg p-5 flex flex-col justify-between min-h-[140px] transition-all hover:shadow-xl hover:-translate-y-1 duration-200">
              <div className="flex justify-between items-start w-full">
                <div>
                  <p className="text-xs opacity-90 font-medium tracking-wide">Tổng số câu hỏi</p>
                  <h3 className="text-3xl font-bold mt-1 leading-none">{stats.totalQuestions}</h3>
                </div>
                <div className="w-9 h-9 bg-white/25 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FiBookOpen className="text-lg" />
                </div>
              </div>
              <p className="text-[11px] opacity-80 pt-2 border-t border-white/15 mt-4">
                Đã lưu
              </p>
            </div>

            {/* Thẻ 3: Tổng số học sinh */}
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl text-white shadow-lg p-5 flex flex-col justify-between min-h-[140px] transition-all hover:shadow-xl hover:-translate-y-1 duration-200">
              <div className="flex justify-between items-start w-full">
                <div>
                  <p className="text-xs opacity-90 font-medium tracking-wide">Tổng số học sinh</p>
                  <h3 className="text-3xl font-bold mt-1 leading-none">{stats.totalStudents}</h3>
                </div>
                <div className="w-9 h-9 bg-white/25 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FiUsers className="text-lg" />
                </div>
              </div>
              <p className="text-[11px] opacity-80 pt-2 border-t border-white/15 mt-4">
                Học sinh
              </p>
            </div>

            {/* Thẻ 4: Số bài nộp */}
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl text-white shadow-lg p-5 flex flex-col justify-between min-h-[140px] transition-all hover:shadow-xl hover:-translate-y-1 duration-200">
              <div className="flex justify-between items-start w-full">
                <div>
                  <p className="text-xs opacity-90 font-medium tracking-wide">Số bài nộp</p>
                  <h3 className="text-3xl font-bold mt-1 leading-none">{stats.totalSubmissions}</h3>
                </div>
                <div className="w-9 h-9 bg-white/25 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FiCheckCircle className="text-lg" />
                </div>
              </div>
              <p className="text-[11px] opacity-80 pt-2 border-t border-white/15 mt-4">
                Cập nhật gần nhất
              </p>
            </div>

          </div>

          {/* Quick Actions - Thêm clear-both và ép dòng chảy relative để chống bị đè */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full h-auto relative z-10 clear-both mt-2">
            <button
              onClick={handleCreateTest}
              className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-2xl hover:shadow-md hover:border-blue-200 transition-all duration-300 hover:-translate-y-[3px] group"
            >
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <FiPlus className="text-xl text-blue-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-800 text-sm group-hover:text-blue-600 transition-colors">Tạo bài kiểm tra mới</h4>
                <p className="text-xs text-gray-400 mt-0.5">Tạo bộ bài kiểm tra nhanh chóng</p>
              </div>
            </button>

            <button
              onClick={handleCreateClass}
              className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-2xl hover:shadow-md hover:border-green-200 transition-all duration-300 hover:-translate-y-[3px] group"
            >
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center group-hover:bg-green-100 transition-colors">
                <FiUsers className="text-xl text-green-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-800 text-sm group-hover:text-green-600 transition-colors">Tạo lớp học mới</h4>
                <p className="text-xs text-gray-400 mt-0.5">Tạo lớp và thêm học sinh</p>
              </div>
            </button>

            <button
              onClick={handleManageQuestions}
              className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-2xl hover:shadow-md hover:border-yellow-200 transition-all duration-300 hover:-translate-y-[3px] group"
            >
              <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center group-hover:bg-yellow-100 transition-colors">
                <FiHelpCircle className="text-xl text-yellow-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-800 text-sm group-hover:text-yellow-600 transition-colors">Quản lý câu hỏi</h4>
                <p className="text-xs text-gray-400 mt-0.5">Xem và chỉnh sửa ngân hàng câu hỏi</p>
              </div>
            </button>
          </div>

          {/* Recent Classes Section */}
          <div className="block w-full relative z-10 mt-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-extrabold text-gray-900 m-0">Lớp học mới nhất</h2>
              <button
                onClick={() => navigate('/teacher/classes')}
                className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
              >
                Xem tất cả &rarr;
              </button>
            </div>
            {classes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {classes.slice(0, 4).map((classItem, index) => (
                  <ClassCard
                    key={classItem.id || index}
                    classData={{
                      ...classItem,
                      color: classItem.color || ['#4ec28a', '#6366f1', '#ec4899', '#f59e0b'][index % 4],
                      avatar: classItem.name?.charAt(0)?.toUpperCase() || 'C',
                      teacher: classItem.teacher?.name || classItem.teacher?.full_name || user?.full_name || user?.name || 'Giáo viên'
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-sm w-full">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mb-4">
                  <FiUsers className="text-2xl" />
                </div>
                <h3 className="text-base font-bold text-gray-800 mb-1">Bạn chưa có lớp học nào</h3>
                <p className="text-gray-400 text-sm max-w-sm mb-6">Tạo lớp học để bắt đầu quản lý học sinh và giao bài.</p>
                <button
                  onClick={handleCreateClass}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all shadow-sm hover:shadow-md px-6 py-2.5"
                >
                  Tạo lớp đầu tiên
                </button>
              </div>
            )}
          </div>

          {/* Recent Assignments Section */}
          <div className="block w-full relative z-10 mt-2 mb-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-extrabold text-gray-900 m-0">Bài kiểm tra mới nhất</h2>
              <button
                onClick={() => navigate('/teacher/tests')}
                className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
              >
                Xem tất cả &rarr;
              </button>
            </div>
            {assignments.length > 0 ? (
              <div className="flex flex-col gap-4 w-full">
                {assignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="flex items-center justify-between p-4 px-6 bg-white border border-gray-100 rounded-2xl hover:shadow-md hover:border-blue-100 transition-all cursor-pointer group"
                    onClick={() => navigate(`/teacher/tests/${assignment.id}`)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-50 group-hover:bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors">
                        <FiFileText className="text-lg" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors text-sm">{assignment.title}</h4>
                        <p className="text-xs font-medium text-gray-400 flex items-center gap-1 mt-1">
                          <FiClock /> {assignment.duration ? `${assignment.duration} phút` : 'Không giới hạn'}
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      assignment.is_active ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-gray-50 text-gray-500 border border-gray-100'
                    }`}>
                      {assignment.is_active ? 'Đang mở' : 'Đã đóng'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-sm w-full">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mb-4">
                  <FiFileText className="text-2xl" />
                </div>
                <h3 className="text-base font-bold text-gray-800 mb-1">Bạn chưa tạo bài kiểm tra nào</h3>
                <p className="text-gray-400 text-sm max-w-sm mb-6">Tạo bài kiểm tra để giao cho học sinh làm bài.</p>
                <button
                  onClick={handleCreateTest}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all shadow-sm hover:shadow-md px-6 py-2.5"
                >
                  Tạo bài đầu tiên
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </TeacherLayout>
  );
};

export default TeacherDashboardPage;