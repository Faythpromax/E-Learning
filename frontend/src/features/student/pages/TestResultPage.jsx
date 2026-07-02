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

  const getScoreColorClass = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  const getScoreBgClass = (score) => {
    if (score >= 80) return 'bg-green-50/70 border border-green-100';
    if (score >= 60) return 'bg-amber-50/70 border border-amber-100';
    return 'bg-red-50/70 border border-red-100';
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

        <div className={`${getScoreBgClass(score)} rounded-2xl p-8 mb-6 text-center`}>
          <div className={`text-6xl font-bold mb-2 ${getScoreColorClass(score)}`}>
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

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
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

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="p-5 px-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
            <h2 className="font-bold text-gray-800">Xem lại đáp án</h2>
            {review?.questions && (
              <button
                onClick={() => setShowReview(!showReview)}
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                {showReview ? 'Ẩn đáp án' : 'Hiển thị đáp án'}
              </button>
            )}
          </div>

          {showReview && review?.questions && (
            <div className="divide-y divide-gray-100">
              {review.questions.map((question, index) => (
                <div
                  key={question.id}
                  className="p-6 transition-colors hover:bg-gray-50/30"
                >
                  <div className="flex items-center gap-3 mb-4 flex-wrap">
                    {question.is_correct ? (
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 text-green-600">
                        <FiCheckCircle className="text-lg" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 text-red-600">
                        <FiXCircle className="text-lg" />
                      </div>
                    )}
                    <span className="font-bold text-gray-800 text-[15px]">Câu {index + 1}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      question.is_correct ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {question.is_correct ? 'Đúng' : 'Sai'}
                    </span>
                    <span className="text-xs text-gray-400 font-medium ml-auto">
                      {question.earned_points ?? (question.is_correct ? 1 : 0)}/{question.max_score ?? 1} điểm
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

        <div className="flex gap-4">
          <button
            onClick={() => navigate('/student/tests')}
            className="flex-1 p-3 bg-white text-gray-700 font-semibold text-sm rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer text-center"
          >
            Quay lại danh sách
          </button>
          <button
            onClick={() => navigate('/student/practice')}
            className="flex-1 p-3 bg-blue-600 text-white font-semibold text-sm rounded-xl border border-transparent hover:bg-blue-700 transition-colors cursor-pointer text-center"
          >
            Luyện tập thêm
          </button>
        </div>
      </div>
    </StudentLayout>
  );
}

export default TestResultPage;
