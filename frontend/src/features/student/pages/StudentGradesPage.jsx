import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiAward, 
  FiCheckCircle, 
  FiClock, 
  FiSearch, 
  FiTrendingUp, 
  FiFilter, 
  FiActivity,
  FiBookOpen,
  FiChevronLeft,
  FiChevronRight,
  FiEye
} from 'react-icons/fi';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import StudentLayout from '../../../components/student/StudentLayout';
import { testService } from '../../../services/testService';
import { subjectApi } from '../../../api/subjectApi';

const StudentGradesPage = () => {
  const navigate = useNavigate();
  const [attempts, setAttempts] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    fetchGradesData();
  }, []);

  const fetchGradesData = async () => {
    try {
      setLoading(true);
      const [attemptsResponse, subjectsResponse] = await Promise.all([
        testService.getMyAttempts(),
        subjectApi.getSubjects()
      ]);

      setAttempts(attemptsResponse.data || []);
      setSubjects(subjectsResponse.data || []);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu kết quả học tập:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper formatting dates
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };

  // 1. Calculations & Metrics
  const submittedAttempts = attempts.filter(a => a.status === 'submitted');
  
  const totalAttemptsCount = attempts.length;
  
  const completedCount = submittedAttempts.length;
  
  const averageScore = completedCount > 0
    ? submittedAttempts.reduce((sum, a) => sum + (Number(a.score) || 0), 0) / completedCount
    : null;

  const highestScore = completedCount > 0
    ? Math.max(...submittedAttempts.map(a => Number(a.score) || 0))
    : null;

  // 2. Charts Data Preparation
  // Progression chart data (oldest first, chronological)
  const progressionData = [...submittedAttempts]
    .reverse()
    .map((attempt, index) => ({
      name: `Lượt ${index + 1}`,
      'Điểm số (%)': Math.round(Number(attempt.score) * 10) / 10,
      test: attempt.test_title
    }));

  // Subject performance chart data
  const subjectScores = {};
  submittedAttempts.forEach(attempt => {
    const subName = attempt.subject || 'Khác';
    if (!subjectScores[subName]) {
      subjectScores[subName] = [];
    }
    subjectScores[subName].push(Number(attempt.score) || 0);
  });

  const subjectChartData = Object.keys(subjectScores).map(subName => {
    const scores = subjectScores[subName];
    const avg = scores.reduce((s, x) => s + x, 0) / scores.length;
    return {
      name: subName,
      'Điểm trung bình (%)': Math.round(avg * 10) / 10
    };
  });

  // 3. Filtering Logic
  const filteredAttempts = attempts.filter(attempt => {
    const matchesSearch = attempt.test_title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'All' || attempt.subject === selectedSubject;
    const matchesStatus = selectedStatus === 'All' || attempt.status === selectedStatus;
    return matchesSearch && matchesSubject && matchesStatus;
  });

  // 4. Pagination Logic
  const totalPages = Math.ceil(filteredAttempts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAttempts = filteredAttempts.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'submitted':
        return 'bg-green-100 text-green-700 font-semibold';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-700 font-semibold';
      case 'expired':
        return 'bg-red-100 text-red-700 font-semibold';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const translateStatus = (status) => {
    switch (status) {
      case 'submitted':
        return 'Đã nộp bài';
      case 'in_progress':
        return 'Đang làm';
      case 'expired':
        return 'Hết giờ/Chưa nộp';
      default:
        return status;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <StudentLayout pageTitle="Kết quả học tập">
      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
          Đang tải dữ liệu kết quả học tập...
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Header Card */}
          <div
            style={{
              background: 'linear-gradient(135deg, #0084ff 0%, #0066cc 100%)',
              color: 'white',
              padding: '24px',
              borderRadius: '20px',
              boxShadow: '0 8px 24px rgba(0, 132, 255, 0.15)',
            }}
          >
            <h3 style={{ margin: 0, fontSize: '22px', fontWeight: '700' }}>
              Bảng Vàng Học Tập 🏆
            </h3>
            <p style={{ margin: '8px 0 0', opacity: 0.9, fontSize: '14px', lineHeight: 1.5 }}>
              Chào mừng bạn đến với chuyên trang Kết Quả Học Tập. Hãy cùng xem lại biểu đồ tiến độ học tập và lịch sử thi thử của bản thân để tiếp tục nâng cao kết quả học tập nhé!
            </p>
          </div>

          {/* Statistics Section */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
            {[
              { 
                label: 'Tổng lượt thi', 
                value: totalAttemptsCount, 
                icon: <FiActivity size={20} />, 
                color: '#0B6DF6',
                bgColor: 'rgba(11, 109, 246, 0.1)'
              },
              { 
                label: 'Đã hoàn thành', 
                value: completedCount, 
                icon: <FiCheckCircle size={20} />, 
                color: '#059669',
                bgColor: 'rgba(5, 150, 105, 0.1)'
              },
              { 
                label: 'Điểm trung bình', 
                value: averageScore !== null ? `${averageScore.toFixed(1)}%` : 'N/A', 
                icon: <FiTrendingUp size={20} />, 
                color: '#F59E0B',
                bgColor: 'rgba(245, 158, 11, 0.1)'
              },
              { 
                label: 'Điểm cao nhất', 
                value: highestScore !== null ? `${highestScore.toFixed(1)}%` : 'N/A', 
                icon: <FiAward size={20} />, 
                color: '#8B5CF6',
                bgColor: 'rgba(139, 92, 246, 0.1)'
              },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  flex: '1 1 220px',
                  background: '#fff',
                  borderRadius: '18px',
                  padding: '20px',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  minWidth: '200px'
                }}
              >
                <div 
                  style={{ 
                    width: '46px', 
                    height: '46px', 
                    borderRadius: '12px', 
                    backgroundColor: item.bgColor, 
                    color: item.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {item.icon}
                </div>
                <div>
                  <div style={{ fontSize: '13px', color: '#6B7280', fontWeight: '500' }}>{item.label}</div>
                  <div style={{ marginTop: '4px', fontSize: '24px', fontWeight: '700', color: '#1F2937' }}>{item.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
            {/* Progression Line Chart */}
            <div style={{ background: 'white', borderRadius: '18px', padding: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.04)' }}>
              <h4 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: 600, color: '#374151', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FiTrendingUp style={{ color: '#0084ff' }} /> Tiến trình điểm số qua các lần thi
              </h4>
              {progressionData.length > 0 ? (
                <div style={{ width: '100%', height: 260 }}>
                  <ResponsiveContainer>
                    <LineChart data={progressionData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} />
                      <YAxis domain={[0, 100]} stroke="#9ca3af" fontSize={12} tickLine={false} />
                      <Tooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div style={{ background: '#1f2937', color: 'white', padding: '8px 12px', borderRadius: '8px', fontSize: '12px' }}>
                                <p style={{ margin: '0 0 4px', fontWeight: 600 }}>{payload[0].payload.test}</p>
                                <p style={{ margin: 0 }}>Điểm: <span style={{ color: '#34d399', fontWeight: 700 }}>{payload[0].value}%</span></p>
                              </div>
                            );
                          }
                          return null;
                        }} 
                      />
                      <Line type="monotone" dataKey="Điểm số (%)" stroke="#0084ff" strokeWidth={3} activeDot={{ r: 6 }} dot={{ stroke: '#0084ff', strokeWidth: 2, r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div style={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: '14px' }}>
                  Chưa có dữ liệu làm bài để hiển thị tiến trình.
                </div>
              )}
            </div>

            {/* Subject Average Score Chart */}
            <div style={{ background: 'white', borderRadius: '18px', padding: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.04)' }}>
              <h4 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: 600, color: '#374151', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FiBookOpen style={{ color: '#059669' }} /> Điểm số trung bình theo Môn Học
              </h4>
              {subjectChartData.length > 0 ? (
                <div style={{ width: '100%', height: 260 }}>
                  <ResponsiveContainer>
                    <BarChart data={subjectChartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} />
                      <YAxis domain={[0, 100]} stroke="#9ca3af" fontSize={12} tickLine={false} />
                      <Tooltip formatter={(value) => [`${value}%`, 'Điểm trung bình']} contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                      <Bar dataKey="Điểm trung bình (%)" fill="#059669" radius={[8, 8, 0, 0]} maxBarSize={45} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div style={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: '14px' }}>
                  Chưa có dữ liệu thi thử theo môn.
                </div>
              )}
            </div>
          </div>

          {/* Filter and Table Section */}
          <div style={{ background: 'white', borderRadius: '18px', padding: '24px', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.04)' }}>
            <h4 style={{ margin: '0 0 20px', fontSize: '16px', fontWeight: 700, color: '#1F2937' }}>
              Lịch sử làm bài chi tiết 📋
            </h4>

            {/* Filter controls */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
              {/* Search */}
              <div style={{ flex: '2 1 260px', position: 'relative' }}>
                <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tiêu đề bài kiểm tra..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 38px',
                    borderRadius: '10px',
                    border: '1px solid #E5E7EB',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Subject Filter */}
              <div style={{ flex: '1 1 150px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FiBookOpen style={{ color: '#6B7280' }} />
                <select
                  value={selectedSubject}
                  onChange={(e) => {
                    setSelectedSubject(e.target.value);
                    setCurrentPage(1);
                  }}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '10px',
                    border: '1px solid #E5E7EB',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="All">Tất cả môn học</option>
                  {subjects.map(s => (
                    <option key={s.id} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div style={{ flex: '1 1 150px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FiFilter style={{ color: '#6B7280' }} />
                <select
                  value={selectedStatus}
                  onChange={(e) => {
                    setSelectedStatus(e.target.value);
                    setCurrentPage(1);
                  }}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '10px',
                    border: '1px solid #E5E7EB',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="All">Tất cả trạng thái</option>
                  <option value="submitted">Đã nộp bài</option>
                  <option value="in_progress">Đang làm</option>
                  <option value="expired">Hết giờ/Chưa nộp</option>
                </select>
              </div>
            </div>

            {/* Table Container */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                    <th style={{ padding: '14px 16px', fontSize: '13px', color: '#4B5563', fontWeight: 600 }}>Lần thi</th>
                    <th style={{ padding: '14px 16px', fontSize: '13px', color: '#4B5563', fontWeight: 600 }}>Bài kiểm tra</th>
                    <th style={{ padding: '14px 16px', fontSize: '13px', color: '#4B5563', fontWeight: 600 }}>Môn học</th>
                    <th style={{ padding: '14px 16px', fontSize: '13px', color: '#4B5563', fontWeight: 600 }}>Thời gian nộp</th>
                    <th style={{ padding: '14px 16px', fontSize: '13px', color: '#4B5563', fontWeight: 600, width: '180px' }}>Điểm số</th>
                    <th style={{ padding: '14px 16px', fontSize: '13px', color: '#4B5563', fontWeight: 600 }}>Trạng thái</th>
                    <th style={{ padding: '14px 16px', fontSize: '13px', color: '#4B5563', fontWeight: 600, textAlign: 'center' }}>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {currentAttempts.length > 0 ? (
                    currentAttempts.map((attempt) => (
                      <tr 
                        key={attempt.attempt_id} 
                        style={{ borderBottom: '1px solid #F1F5F9', transition: 'background-color 0.2s' }}
                        className="student-table-row"
                      >
                        <td style={{ padding: '16px', fontSize: '14px', color: '#374151', fontWeight: 600 }}>
                          #{attempt.attempt_no}
                        </td>
                        <td style={{ padding: '16px', fontSize: '14px', color: '#1F2937', fontWeight: 500 }}>
                          {attempt.test_title}
                        </td>
                        <td style={{ padding: '16px', fontSize: '14px', color: '#4B5563' }}>
                          <span style={{ background: '#EFF6FF', color: '#1E40AF', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 500 }}>
                            {attempt.subject || 'Khác'}
                          </span>
                        </td>
                        <td style={{ padding: '16px', fontSize: '14px', color: '#6B7280' }}>
                          {attempt.status === 'submitted' ? formatDate(attempt.submitted_at) : formatDate(attempt.started_at)}
                        </td>
                        <td style={{ padding: '16px', fontSize: '14px' }}>
                          {attempt.status === 'submitted' ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <span className={getScoreColor(attempt.score)} style={{ fontWeight: '700' }}>
                                {attempt.score !== null ? `${Number(attempt.score).toFixed(1)}%` : '0.0%'}
                              </span>
                              <div style={{ width: '100px', height: '6px', background: '#E5E7EB', borderRadius: '3px', overflow: 'hidden' }}>
                                <div 
                                  style={{ 
                                    width: `${attempt.score}%`, 
                                    height: '100%', 
                                    background: attempt.score >= 80 ? '#10B981' : attempt.score >= 60 ? '#F59E0B' : '#EF4444' 
                                  }} 
                                />
                              </div>
                            </div>
                          ) : (
                            <span style={{ color: '#9CA3AF', fontStyle: 'italic' }}>Chưa có điểm</span>
                          )}
                        </td>
                        <td style={{ padding: '16px', fontSize: '13px' }}>
                          <span className={`px-2.5 py-1.5 rounded-full text-xs ${getStatusBadgeClass(attempt.status)}`}>
                            {translateStatus(attempt.status)}
                          </span>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'center' }}>
                          {attempt.status === 'submitted' ? (
                            <button
                              onClick={() => navigate(`/student/tests/${attempt.attempt_id}/results`)}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                background: '#EFF6FF',
                                border: 'none',
                                color: '#1D4ED8',
                                padding: '6px 12px',
                                borderRadius: '8px',
                                fontSize: '13px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                              onMouseOver={(e) => { e.currentTarget.style.background = '#DBEAFE'; }}
                              onMouseOut={(e) => { e.currentTarget.style.background = '#EFF6FF'; }}
                            >
                              <FiEye /> Chi tiết
                            </button>
                          ) : attempt.status === 'in_progress' ? (
                            <button
                              onClick={() => navigate(`/student/tests/${attempt.test_id}`)}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                background: '#FFFBEB',
                                border: 'none',
                                color: '#D97706',
                                padding: '6px 12px',
                                borderRadius: '8px',
                                fontSize: '13px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                              onMouseOver={(e) => { e.currentTarget.style.background = '#FEF3C7'; }}
                              onMouseOut={(e) => { e.currentTarget.style.background = '#FFFBEB'; }}
                            >
                              <FiActivity /> Tiếp tục
                            </button>
                          ) : (
                            <span style={{ color: '#9CA3AF', fontSize: '13px' }}>N/A</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" style={{ padding: '32px 16px', textAlign: 'center', color: '#9CA3AF', fontSize: '14px' }}>
                        Không tìm thấy lịch sử thi nào phù hợp với bộ lọc.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', borderTop: '1px solid #E5E7EB', paddingTop: '16px' }}>
                <span style={{ fontSize: '14px', color: '#6B7280' }}>
                  Hiển thị {indexOfFirstItem + 1} đến {Math.min(indexOfLastItem, filteredAttempts.length)} của {filteredAttempts.length} lượt thi
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '6px 12px',
                      border: '1px solid #E5E7EB',
                      borderRadius: '6px',
                      background: currentPage === 1 ? '#F9FAFB' : 'white',
                      color: currentPage === 1 ? '#9CA3AF' : '#374151',
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    <FiChevronLeft /> Trước
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      style={{
                        padding: '6px 12px',
                        border: '1px solid',
                        borderColor: currentPage === page ? '#0084ff' : '#E5E7EB',
                        borderRadius: '6px',
                        background: currentPage === page ? '#0084ff' : 'white',
                        color: currentPage === page ? 'white' : '#374151',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: currentPage === page ? '600' : 'normal'
                      }}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '6px 12px',
                      border: '1px solid #E5E7EB',
                      borderRadius: '6px',
                      background: currentPage === totalPages ? '#F9FAFB' : 'white',
                      color: currentPage === totalPages ? '#9CA3AF' : '#374151',
                      cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Tiếp <FiChevronRight />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </StudentLayout>
  );
};

export default StudentGradesPage;

export default StudentGradesPage;
