import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiClock, FiFileText, FiPlay, FiRotateCw } from 'react-icons/fi';
import { testApi } from '../../../api/testApi';
import StudentLayout from '../../../components/student/StudentLayout';

export function SystemTestsPage() {
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSystemTests();
  }, []);

  const fetchSystemTests = async () => {
    try {
      const [testsRes, attemptsRes] = await Promise.all([
        testApi.getSystemTests(),
        testApi.getMyAttempts(),
      ]);
      setTests(testsRes?.data || []);
      setAttempts(attemptsRes?.data || []);
    } catch (error) {
      console.error('Failed to fetch system tests:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSubmittedCount = (testId) =>
    attempts.filter((a) => a.test_id === testId && a.status === 'submitted').length;

  const getActiveAttempt = (testId) =>
    attempts.find((a) => a.test_id === testId && a.status === 'in_progress');

  const getLatestAttemptId = (testId) => {
    const submitted = attempts.filter((a) => a.test_id === testId && a.status === 'submitted');
    if (submitted.length === 0) return null;
    return submitted[submitted.length - 1].attempt_id || submitted[submitted.length - 1].id;
  };

  const handleStartTest = (testId) => {
    navigate(`/student/tests/${testId}`);
  };

  const formatDuration = (minutes) => {
    if (!minutes) return 'Không giới hạn thời gian';
    if (minutes >= 60) return `${Math.floor(minutes / 60)} giờ ${minutes % 60} phút`;
    return `${minutes} phút`;
  };

  return (
    <StudentLayout pageTitle="Làm bài test hệ thống" pageSubtitle="Bài kiểm tra hệ thống dành cho tất cả học sinh">
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-gray-500 text-sm font-medium">Đang tải bài test hệ thống...</div>
        </div>
      ) : (
        <div className="p-6 max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-gray-900">Làm bài test hệ thống</h1>
          <p className="text-gray-600 text-sm mb-6">
            Đây là các bài kiểm tra do admin hệ thống tạo ra, phù hợp cho tất cả học sinh thực hành.
          </p>

          {tests.length === 0 ? (
            <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
              <FiFileText className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-1">Chưa có bài test hệ thống</h3>
              <p className="text-gray-500 text-sm">Hiện tại chưa có bài kiểm tra hệ thống nào.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {tests.map((test) => {
                const isExpired = test.expires_at && new Date(test.expires_at) < new Date();
                const submittedCount = getSubmittedCount(test.id);
                const activeAttempt = getActiveAttempt(test.id);
                const canRetake = test.max_attempts > 1 && submittedCount < (test.max_attempts || 999);

                return (
                  <div key={test.id} className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-gray-800">{test.title}</h3>
                          {submittedCount > 0 && (
                            <span className="text-xs font-medium px-2.5 py-1 bg-green-100 text-green-700 rounded-full">Đã hoàn thành</span>
                          )}
                          {isExpired && (
                            <span className="text-xs font-medium px-2.5 py-1 bg-red-100 text-red-700 rounded-full">Đã hết hạn</span>
                          )}
                          {activeAttempt && !isExpired && (
                            <span className="text-xs font-medium px-2.5 py-1 bg-yellow-100 text-yellow-700 rounded-full animate-pulse">Đang làm dở</span>
                          )}
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
                      </div>

                      <div className="flex sm:flex-col justify-end items-end gap-2">
                        {isExpired ? (
                          <button disabled className="w-full sm:w-auto px-5 py-2.5 bg-gray-100 text-gray-400 text-sm font-semibold rounded-lg cursor-not-allowed">
                            Đã khóa đề
                          </button>
                        ) : activeAttempt ? (
                          <button
                            onClick={() => handleStartTest(test.id)}
                            className="w-full sm:w-auto px-5 py-2.5 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                          >
                            <FiPlay className="text-xs" />
                            Tiếp tục làm
                          </button>
                        ) : submittedCount > 0 && canRetake ? (
                          <div className="flex sm:flex-col items-end gap-2">
                          <button
                            onClick={() => navigate(`/student/tests/${getLatestAttemptId(test.id)}/results`)}
                            className="w-full sm:w-auto px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-1"
                          >
                            Xem kết quả
                          </button>
                            <button
                              onClick={() => handleStartTest(test.id)}
                              className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                            >
                              <FiRotateCw className="text-xs" />
                              Làm lại
                            </button>
                          </div>
                        ) : submittedCount > 0 ? (
                          <button
                            onClick={() => navigate(`/student/tests/${test.id}/results`)}
                            className="w-full sm:w-auto px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-1"
                          >
                            Xem kết quả
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStartTest(test.id)}
                            className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                          >
                            <FiPlay className="text-xs" />
                            Bắt đầu làm
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </StudentLayout>
  );
}

export default SystemTestsPage;
