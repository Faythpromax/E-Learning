import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { FiCheckCircle, FiXCircle, FiArrowLeft, FiClock } from 'react-icons/fi';
import { testApi } from '../../../api/testApi';
import { QuestionRenderer } from '../../../components/student/QuestionRenderer';
import StudentLayout from '../../../components/student/StudentLayout';

const pageContainerStyle = {
  width: '100%',
  maxWidth: '768px',
  margin: '0 auto',
  padding: '24px',
  boxSizing: 'border-box',
};

const cardStyle = {
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  border: '1px solid #e5e7eb',
  width: '100%',
  boxSizing: 'border-box',
};

const formatDateTime = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString('vi-VN');
};

const getSubjectName = (result) => {
  if (!result?.subject) return 'Không rõ';
  if (typeof result.subject === 'string') return result.subject;
  return result.subject?.name || 'Không rõ';
};

export function TestResultPage() {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [result, setResult] = useState(location.state?.result || null);
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(!location.state?.result);
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    if (!result) {
      fetchResult();
    } else {
      fetchReview();
    }
  }, [attemptId]);

  const fetchResult = async () => {
    try {
      const response = await testApi.getTestResults(attemptId);
      setResult(response.data);
      fetchReview();
    } catch (error) {
      console.error('Failed to fetch result:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReview = async () => {
    try {
      const response = await testApi.getTestReview(attemptId);
      setReview(response.data);
    } catch (error) {
      console.error('Failed to fetch review:', error);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#16a34a';
    if (score >= 60) return '#d97706';
    return '#dc2626';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return '#f0fdf4';
    if (score >= 60) return '#fffbeb';
    return '#fef2f2';
  };

  const getScoreBorderColor = (score) => {
    if (score >= 80) return '#bbf7d0';
    if (score >= 60) return '#fde68a';
    return '#fecaca';
  };

  const getScoreMessage = (score) => {
    if (score >= 90) return 'Xuất sắc!';
    if (score >= 80) return 'Rất tốt!';
    if (score >= 70) return 'Khá!';
    if (score >= 60) return 'Trung bình';
    if (score >= 50) return 'Cần cố gắng thêm';
    return 'Chưa đạt';
  };

  if (loading) {
    return (
      <StudentLayout pageTitle="Kết quả bài kiểm tra">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-gray-500">Đang tải kết quả...</div>
        </div>
      </StudentLayout>
    );
  }

  if (!result) {
    return (
      <StudentLayout pageTitle="Kết quả bài kiểm tra">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <p className="text-gray-500 mb-4">Không tìm thấy kết quả.</p>
          <button
            onClick={() => navigate('/student/tests')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg"
          >
            Quay lại
          </button>
        </div>
      </StudentLayout>
    );
  }

  const score = result.score ?? 0;
  const correctCount = review?.questions?.filter((q) => q.is_correct).length || 0;
  const totalCount = review?.questions?.length || result.total_questions || 0;

  return (
    <StudentLayout pageTitle="Kết quả bài kiểm tra">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {result.status === 'expired' && (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-center text-sm font-medium text-amber-700">
            Bài kiểm tra đã hết giờ. Bạn không thể làm lại bài này.
          </div>
        )}

        <div className={`${getScoreBgColor(score)} rounded-2xl p-8 mb-6 text-center`}>
          <div className={`text-6xl font-bold mb-2 ${getScoreColor(score)}`}>
            {score.toFixed(1)}%
          </div>
          <div className="text-lg font-semibold text-gray-700">{getScoreMessage(score)}</div>
          <div className="mt-4 flex flex-wrap justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <FiCheckCircle className="text-green-600" />
              <span className="text-gray-700">
                <strong>{correctCount}</strong> câu đúng
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FiXCircle className="text-red-600" />
              <span className="text-gray-700">
                <strong>{totalCount - correctCount}</strong> câu sai
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FiClock className="text-gray-600" />
              <span className="text-gray-700">
                Lần thi thứ <strong>{result.attempt_no || 1}</strong>
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="font-bold text-gray-800 mb-4">Thông tin bài kiểm tra</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Môn học:</span>
              <span className="ml-2 font-medium text-gray-800">{getSubjectName(result)}</span>
            </div>
            <div>
              <span className="text-gray-500">Tổng số câu:</span>
              <span className="ml-2 font-medium text-gray-800">{totalCount}</span>
            </div>
            <div>
              <span className="text-gray-500">Bắt đầu:</span>
              <span className="ml-2 font-medium text-gray-800">
                {formatDateTime(result.started_at)}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Nộp bài:</span>
              <span className="ml-2 font-medium text-gray-800">
                {formatDateTime(result.submitted_at)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b flex items-center justify-between">
            <h2 className="font-bold text-gray-800">Xem lại đáp án</h2>

          {showReview && review?.questions && (
            <div>
              {review.questions.map((question, index) => (
                <div
                  key={question.id}
                  style={{
                    padding: '24px',
                    borderBottom: index < review.questions.length - 1 ? '1px solid #f3f4f6' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
                    {question.is_correct ? (
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FiCheckCircle style={{ color: '#16a34a' }} />
                      </div>
                    ) : (
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FiXCircle style={{ color: '#dc2626' }} />
                      </div>
                    )}
<<<<<<< HEAD
                    <span className="font-semibold text-gray-800">
                      Câu {index + 1}
                    </span>
                    <span className={`text-sm ${
                      question.is_correct ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {question.is_correct ? 'Đúng' : 'Sai'}
=======
                    <span style={{ fontWeight: '700', color: '#111827', fontSize: '15px' }}>Câu {index + 1}</span>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: question.is_correct ? '#16a34a' : '#dc2626' }}>
                      {question.is_correct ? 'Đúng' : 'Sai'}
                    </span>
                    <span style={{ fontSize: '12px', color: '#9ca3af', marginLeft: 'auto' }}>
                      {question.earned_points ?? (question.is_correct ? 1 : 0)}/{question.max_score ?? 1} điểm
>>>>>>> a5fefcfbec6425d603c89ed04903ce503e5ea657
                    </span>
                  </div>

                  <QuestionRenderer
                    question={question}
                    onAnswer={() => {}}
                    showResult={true}
                    result={{
                      is_correct: question.is_correct,
                      correct_answer: question.correct_answer,
                      explanation: question.explanation,
                    }}
                    userAnswer={question.user_answer}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => navigate('/student/tests')}
            style={{
              flex: 1,
              padding: '12px 20px',
              backgroundColor: '#ffffff',
              color: '#374151',
              fontWeight: '600',
              fontSize: '14px',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              cursor: 'pointer',
            }}
            className="hover:bg-gray-50"
          >
            Quay lại danh sách
          </button>
          <button
            onClick={() => navigate('/student/practice')}
            style={{
              flex: 1,
              padding: '12px 20px',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              fontWeight: '600',
              fontSize: '14px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
            }}
            className="hover:bg-blue-700"
          >
            Luyện tập thêm
          </button>
        </div>
      </div>
    </StudentLayout>
  );
}

export default TestResultPage;
