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
        <div className="w-full text-left flex flex-col gap-6" style={{ paddingTop: '20px', boxSizing: 'border-box' }}>

          {/* ======================================================= */}
          {/* STANDARD DESIGN TEMPLATE FOR FULL NAME */}
          {/* ======================================================= */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100/80"
            style={{ display: 'flex', width: '100%', padding: '24px', marginBottom: '24px', position: 'relative', clear: 'both', boxSizing: 'border-box', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ textAlign: 'left' }}>
              <span style={{ fontSize: '12px', color: '#9ca3af', fontWeight: '500' }}>Xin chào</span>
              <h1 style={{ fontSize: '30px', fontWeight: 'bold', color: '#111827', margin: '4px 0 6px 0', padding: 0, lineHeight: '1.2' }}>{user?.full_name || user?.name || 'Giáo viên'}</h1>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: 0, padding: 0 }}>Tổng quan nhanh về lớp học, học sinh và bài kiểm tra của bạn.</p>
            </div>
            
            {/* Block of total students in the top right corner of the banner */}
            <div className="bg-blue-50/60 rounded-2xl border border-blue-100/50" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px' }}> 
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 flex-shrink-0" style={{ display: 'flex', alignItems: 'center', justify: 'center' }}> 
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg> 
              </div> 
              <div style={{ textAlign: 'left' }}> 
                <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#9ca3af', fontWeight: '600', margin: 0, padding: 0, transform: 'scale(0.95)', transformOrigin: 'left' }}>TỔNG SỐ HỌC SINH</p> 
                <h4 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', lineHeight: '1', margin: '4px 0 0 0', padding: 0 }}>{stats.totalStudents}</h4> 
              </div> 
            </div> 
          </div> 

          {/* ==================================================================== */} 
          {/* STATS CARDS - MAINTAIN HIS BEAUTIFUL FORM */} 
          {/* ==================================================================== */} 
          <div style={{ display: 'block', width: '100%', position: 'relative', clear: 'both', margin: '0 0 24px 0' }}> 
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full"> 

              {/* Card 1 */} 
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl text-white shadow-md" 
                style={{ height: '145px', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '20px', boxSizing: 'border-box' }}> 
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', width: '100%' }}> 
                  <div style={{ textAlign: 'left' }}> 
                    <p style={{ fontSize: '12px', opacity: 0.9, fontWeight: '500', margin: '0 0 4px 0', padding: 0 }}>Tổng số bài kiểm tra</p> 
                    <h3 style={{ fontSize: '36px', fontWeight: 'bold', margin: '4px 0 0 0', padding: 0, lineHeight: '1' }}>{stats.totalTests}</h3> 
                  </div> 
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0" style={{ display: 'flex', alignItems: 'center', justify: 'center' }}> 
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> 
                  </div> 
                </div> 
                <p style={{ fontSize: '10px', opacity: 0.75, textAlign: 'left', margin: 'auto 0 0 0', padding: 0 }}>~ Tăng 12% tháng này</p> 
              </div> 

              {/* Card 2 */} 
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl text-white shadow-md" 
                style={{ height: '145px', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '20px', boxSizing: 'border-box' }}> 
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', width: '100%' }}> 
                  <div style={{ textAlign: 'left' }}> 
                    <p style={{ fontSize: '12px', opacity: 0.9, fontWeight: '500', margin: '0 0 4px 0', padding: 0 }}>Tổng số câu hỏi</p> 
                    <h3 style={{ fontSize: '36px', fontWeight: 'bold', margin: '4px 0 0 0', padding: 0, lineHeight: '1' }}>{stats.totalQuestions}</h3> 
                  </div> 
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0" style={{ display: 'flex', alignItems: 'center', justify: 'center' }}> 
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg> 
                  </div> 
                </div> 
                <p style={{ fontSize: '10px', opacity: 0.75, textAlign: 'left', margin: 'auto 0 0 0', padding: 0 }}>~ Tăng 8% tháng này</p> 
              </div> 

              {/* Card 3 */} 
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl text-white shadow-md" 
                style={{ height: '145px', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '20px', boxSizing: 'border-box' }}> 
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', width: '100%' }}> 
                  <div style={{ textAlign: 'left' }}> 
                    <p style={{ fontSize: '12px', opacity: 0.9, fontWeight: '500', margin: '0 0 4px 0', padding: 0 }}>Tổng số học sinh</p> 
                    <h3 style={{ fontSize: '36px', fontWeight: 'bold', margin: '4px 0 0 0', padding: 0, lineHeight: '1' }}>{stats.totalStudents}</h3> 
                  </div> 
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0" style={{ display: 'flex', alignItems: 'center', justify: 'center' }}> 
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg> 
                  </div> 
                </div> 
                <p style={{ fontSize: '10px', opacity: 0.75, textAlign: 'left', margin: 'auto 0 0 0', padding: 0 }}>~ 3 học sinh mới</p> 
              </div> 

              {/* Card 4 */} 
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl text-white shadow-md" 
                style={{ height: '145px', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '20px', boxSizing: 'border-box' }}> 
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', width: '100%' }}> 
                  <div style={{ textAlign: 'left' }}> 
                    <p style={{ fontSize: '12px', opacity: 0.9, fontWeight: '500', margin: '0 0 4px 0', padding: 0 }}>Số bài nộp</p> 
                    <h3 style={{ fontSize: '36px', fontWeight: 'bold', margin: '4px 0 0 0', padding: 0, lineHeight: '1' }}>{stats.totalSubmissions}</h3> 
                  </div> 
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0" style={{ display: 'flex', alignItems: 'center', justify: 'center' }}> 
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> 
                  </div> 
                </div> 
                <p style={{ fontSize: '10px', opacity: 0.75, textAlign: 'left', margin: 'auto 0 0 0', padding: 0 }}>~ 95% hoàn thành</p> 
              </div> 

            </div> 
          </div> 

          {/* ======================================================= */}
          {/* QUICK ACTIONS - ADD BACK 3 BUTTONS USING DIV TO AVOID POSITION FIXING TRI */} 
          {/* ==================================================================== */} 
          <div style={{ display: 'block', width: '100%', position: 'relative', clear: 'both', margin: '0 0 28px 0' }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full"> 

              {/* Button 1 */} 
              <div 
                onClick={handleCreateTest} 
                className="bg-white border border-gray-100 rounded-xl hover:shadow-md transition-all duration-200 text-left" 
                style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', cursor: 'pointer', position: 'static' }} 
              > 
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 flex-shrink-0" style={{ display: 'flex', alignItems: 'center', justify: 'center' }}> 
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /> </svg> 
                </div> 
                <div> 
                  <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#1f2937', margin: 0, padding: 0 }}>Tạo bài kiểm tra mới</h4> 
                  <p style={{ fontSize: '12px', color: '#9ca3af', margin: '2px 0 0 0', padding: 0 }}>Tạo một bài kiểm tra nhanh</p> 
                </div> 
              </div> 

              {/* Button 2 */} 
              <div 
                onClick={handleCreateClass} 
                className="bg-white border border-gray-100 rounded-xl hover:shadow-md transition-all duration-200 text-left" 
                style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', cursor: 'pointer', position: 'static' }} 
              > 
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600 flex-shrink-0" style={{ display: 'flex', alignItems: 'center', justify: 'center' }}> 
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg> 
                </div> 
                <div> 
                  <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#1f2937', margin: 0, padding: 0 }}>Tạo lớp học mới</h4> 
                  <p style={{ fontSize: '12px', color: '#9ca3af', margin: '2px 0 0 0', padding: 0 }}>Tạo lớp và thêm học sinh</p> 
                </div> 
              </div> 

              {/* Button 3 */} 
              <div 
                onClick={handleManageQuestions} 
                className="bg-white border border-gray-100 rounded-xl hover:shadow-md transition-all duration-200 text-left" 
                style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', cursor: 'pointer', position: 'static' }} 
              > 
                <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center text-yellow-600 flex-shrink-0" style={{ display: 'flex', alignItems: 'center', justify: 'center' }}> 
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#1f2937', margin: 0, padding: 0 }}>Quản lý câu hỏi</h4>
                  <p style={{ fontSize: '12px', color: '#9ca3af', margin: '2px 0 0 0', padding: 0 }}>Xem và chỉnh sửa ngân hàng câu hỏi</p>
                </div>
              </div>

            </div>
          </div>

          {/* ==================================================================== */} 
          {/* ALIGN THE LATEST CLASS AND TEST */} 
          {/* ==================================================================== */} 
          <div style={{ display: 'block', width: '100%', position: 'relative', clear: 'both', textAlign: 'left' }}>

            {/* LATEST CLASS */}
            <div style={{ marginBottom: '32px' }}>
              <div className="flex justify-between items-center mb-3" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}> 
                <h3 className="text-lg font-bold text-gray-800 m-0">Lớp học mới nhất</h3> 
                <span className="text-xs text-blue-600 cursor-pointer font-medium hover:underline" onClick={() => navigate('/teacher/classes')}>Xem tất cả →</span> 
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
                <div className="bg-gray-50/50 rounded-2xl p-8 flex flex-col items-center justify-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justify: 'center', minHeight: '180px' }}> 
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3" style={{ display: 'flex', alignItems: 'center', justify: 'center' }}> 
                    <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                  </div>
                  <p className="text-sm font-bold text-gray-700 m-0 mb-1">Bạn chưa có lớp học nào</p>
                  <p className="text-xs text-gray-400 m-0 mb-4">Tạo lớp học để bắt đầu quản lý học sinh và giao bài.</p>
                  <button
                    onClick={handleCreateClass}
                    style={{
                      position: 'static',
                      display: 'inline-block',
                      backgroundColor: '#2563eb',
                      color: '#ffffff',
                      padding: '8px 16px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600',
                      border: 'none',
                      cursor: 'pointer',
                      margin: '16px auto 0 auto',
                      width: 'auto',
                      height: 'auto',
                      transform: 'none',
                      lineHeight: 'normal'
                    }}
                    className="hover:bg-blue-700 shadow-sm transition-all"
                  >
                    Tạo lớp đầu tiên
                  </button>
                </div>
              )}
            </div>

            {/* LATEST TEST */}
            <div>
              <div className="flex justify-between items-center mb-3" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}> 
                <h3 className="text-lg font-bold text-gray-800 m-0">Bài kiểm tra mới nhất</h3> 
                <span className="text-xs text-blue-600 cursor-pointer font-medium hover:underline" onClick={() => navigate('/teacher/tests')}>Xem tất cả →</span> 
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
                <div className="bg-gray-50/50 rounded-2xl p-8 flex flex-col items-center justify-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justify: 'center', minHeight: '180px' }}> 
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3" style={{ display: 'flex', alignItems: 'center', justify: 'center' }}> 
                    <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  </div> 
                  <p className="text-sm font-bold text-gray-700 m-0 mb-1">Bạn chưa tạo bài kiểm tra nào</p>
                  <p className="text-xs text-gray-400 m-0 mb-4">Tạo bài kiểm tra để giao cho học sinh làm bài.</p>
                  <button
                    onClick={handleCreateTest}
                    style={{
                      position: 'static',
                      display: 'inline-block',
                      backgroundColor: '#2563eb',
                      color: '#ffffff',
                      padding: '8px 16px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600',
                      border: 'none',
                      cursor: 'pointer',
                      margin: '16px auto 0 auto',
                      width: 'auto',
                      height: 'auto',
                      transform: 'none',
                      lineHeight: 'normal'
                    }}
                    className="hover:bg-blue-700 shadow-sm transition-all"
                  >
                    Tạo bài đầu tiên
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </TeacherLayout>
  );
};

export default TeacherDashboardPage;