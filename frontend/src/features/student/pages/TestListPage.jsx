import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiClock, FiFileText, FiCheckCircle, FiAlertCircle, FiPlay, FiCornerDownRight } from 'react-icons/fi';
import { testApi } from '../../../api/testApi';

export function TestListPage() {
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('available');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [testsRes, attemptsRes] = await Promise.all([
        testApi.getAvailableTests(),
        testApi.getMyAttempts(),
      ]);
      setTests(testsRes?.data || []);
      setAttempts(attemptsRes?.data || []);
    } catch (error) {
      console.error('Failed to fetch tests:', error);
    } finally {
      setLoading(false);
    }
  };

  // Tạo một Map để tra cứu nhanh lượt làm bài theo test_id, tối ưu hóa hiệu năng render
  const attemptMap = useMemo(() => {
    return attempts.reduce((acc, attempt) => {
      // Nếu có nhiều lượt, ưu tiên giữ lại lượt có trạng thái mới nhất/tiến trình tốt nhất
      if (!acc[attempt.test_id] || attempt.status === 'in_progress') {
        acc[attempt.test_id] = attempt;
      }
      return acc;
    }, {});
  }, [attempts]);

  const handleStartTest = (testId) => {
    navigate(`/student/tests/${testId}`);
  };

  const handleViewResults = (attemptId) => {
    navigate(`/student/tests/${attemptId}/results`);
  };

  const formatDuration = (minutes) => {
    if (!minutes) return 'Không giới hạn thời gian';
    if (minutes >= 60) return `${Math.floor(minutes / 60)} giờ ${minutes % 60} phút`;
    return `${minutes} phút`;
  };

  const getStatusBadge = (test) => {
    const attempt = attemptMap[test.id];
    if (attempt?.status === 'submitted') {
      return <span className="text-xs font-medium px-2.5 py-1 bg-green-100 text-green-700 rounded-full">Đã hoàn thành</span>;
    }
    if (attempt?.status === 'in_progress') {
      return <span className="text-xs font-medium px-2.5 py-1 bg-yellow-100 text-yellow-700 rounded-full animate-pulse">Đang làm dở</span>;
    }

    if (!test.expires_at) {
      return <span className="text-xs font-medium px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full">Chưa làm</span>;
    }

    const expires = new Date(test.expires_at);
    const now = new Date();
    const daysLeft = Math.ceil((expires - now) / (1000 * 60 * 60 * 24));
    
    if (daysLeft < 0) {
      return <span className="text-xs font-medium px-2.5 py-1 bg-red-100 text-red-700 rounded-full">Đã hết hạn</span>;
    }
    if (daysLeft <= 3) {
      return <span className="text-xs font-medium px-2.5 py-1 bg-orange-100 text-orange-700 rounded-full">Còn {daysLeft} ngày</span>;
    }
    return <span className="text-xs font-medium px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full">Chưa làm</span>;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="text-gray-500 text-sm font-medium">Đang tải danh sách bài kiểm tra...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Danh sách bài kiểm tra</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('available')}
          className={`pb-3 px-4 font-semibold text-sm transition-all relative ${
            activeTab === 'available'
              ? 'text-blue-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Bài kiểm tra khả dụng ({tests.length})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`pb-3 px-4 font-semibold text-sm transition-all relative ${
            activeTab === 'history'
              ? 'text-blue-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Lịch sử làm bài ({attempts.length})
        </button>
      </div>

      {/* Available Tests */}
      {activeTab === 'available' && (
        <div className="space-y-4">
          {tests.length === 0 ? (
            <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
              <FiFileText className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-1">Chưa có bài kiểm tra</h3>
              <p className="text-gray-500 text-sm">Hiện tại chưa có bài kiểm tra nào được giao cho bạn.</p>
            </div>
          ) : (
            tests.map((test) => {
              const currentAttempt = attemptMap[test.id];
              const isExpired = test.expires_at && new Date(test.expires_at) < new Date();
              
              return (
                <div key={test.id} className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-800">{test.title}</h3>
                        {getStatusBadge(test)}
                      </div>
                      <p className="text-sm text-gray-600 mb-3 font-medium">{test.subject?.name || 'Chưa phân môn'}</p>
                      
                      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1.5">
                          <FiFileText className="text-gray-400" />
                          {test.questions_count || test.questions?.length || test.test_questions?.length || 0} câu hỏi
                        </span>
                        <span className="flex items-center gap-1.5">
                          <FiClock className="text-gray-400" />
                          {formatDuration(test.duration)}
                        </span>
                      </div>

                      {/* Mã truy cập test code info */}
                      {(test.access_type === 'public_code' || test.access_type === 'both') && test.test_code && (
                        <div className="mt-3 text-sm flex items-center gap-1.5">
                          <span className="text-gray-500">Mã truy cập:</span>
                          <code className="bg-gray-50 px-2 py-0.5 rounded border border-gray-200 font-mono text-xs text-blue-600 font-bold">
                            {test.test_code}
                          </code>
                        </div>
                      )}
                    </div>

                    <div className="flex sm:flex-col justify-end items-end gap-2">
                      {currentAttempt?.status === 'submitted' ? (
                        <button
                          onClick={() => handleViewResults(currentAttempt.attempt_id || currentAttempt.id)}
                          className="w-full sm:w-auto px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-1"
                        >
                          <FiCheckCircle /> Xem kết quả
                        </button>
                      ) : isExpired ? (
                        <button disabled className="w-full sm:w-auto px-5 py-2.5 bg-gray-100 text-gray-400 text-sm font-semibold rounded-lg cursor-not-allowed">
                          Đã khóa đề
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStartTest(test.id)}
                          className={`w-full sm:w-auto px-5 py-2.5 text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                            currentAttempt?.status === 'in_progress'
                              ? 'bg-yellow-600 hover:bg-yellow-700'
                              : 'bg-blue-600 hover:bg-blue-700'
                          }`}
                        >
                          <FiPlay className="text-xs" />
                          {currentAttempt?.status === 'in_progress' ? 'Tiếp tục làm' : 'Bắt đầu làm'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Attempt History */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          {attempts.length === 0 ? (
            <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
              <FiFileText className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-1">Chưa có lịch sử</h3>
              <p className="text-gray-500 text-sm">Bạn chưa thực hiện bài kiểm tra nào.</p>
            </div>
          ) : (
            attempts.map((attempt) => (
              <div key={attempt.attempt_id || attempt.id} className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800 mb-1">{attempt.test_title || attempt.test?.title}</h3>
                    <p className="text-gray-500 text-sm mb-3 flex items-center gap-1">
                      {attempt.subject || attempt.test?.subject?.name || 'Môn học khác'} 
                      <span className="text-gray-300">•</span>
                      <span className="text-gray-600 font-medium">Lần làm thứ {attempt.attempt_no || 1}</span>
                    </p>

                    <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <FiClock className="text-gray-400" />
                        {attempt.started_at ? new Date(attempt.started_at).toLocaleDateString('vi-VN') : 'Không rõ ngày'}
                      </span>
                      <span className={`flex items-center gap-1.5 font-medium ${
                        attempt.status === 'submitted' ? 'text-green-600' :
                        attempt.status === 'in_progress' ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {attempt.status === 'submitted' && <FiCheckCircle />}
                        {attempt.status === 'in_progress' && <FiClock className="animate-spin" />}
                        {attempt.status === 'expired' && <FiAlertCircle />}
                        {attempt.status === 'submitted' ? 'Đã nộp bài' :
                         attempt.status === 'in_progress' ? 'Đang làm dở' : 'Quá hạn / Huỷ'}
                      </span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-3 border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100">
                    {attempt.status === 'submitted' && (
                      <div className="text-left sm:text-right">
                        <div className={`text-2xl font-black ${
                          (attempt.score || 0) >= 80 ? 'text-green-600' :
                          (attempt.score || 0) >= 50 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {typeof attempt.score === 'number' ? `${attempt.score.toFixed(1)}%` : '0%'}
                        </div>
                        <div className="text-xs text-gray-500 font-medium mt-0.5">
                          Đúng {attempt.correct_count || 0}/{attempt.total_questions || 0} câu
                        </div>
                      </div>
                    )}
                    
                    {attempt.status === 'submitted' ? (
                      <button
                        onClick={() => handleViewResults(attempt.attempt_id || attempt.id)}
                        className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 text-sm font-semibold rounded-lg transition-colors flex items-center gap-1"
                      >
                        <FiCornerDownRight /> Xem chi tiết
                      </button>
                    ) : attempt.status === 'in_progress' ? (
                      <button
                        onClick={() => handleStartTest(attempt.test_id)}
                        className="px-4 py-2 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 text-sm font-semibold rounded-lg transition-colors"
                      >
                        Làm tiếp bài
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default TestListPage;