import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { FiCheckCircle, FiXCircle, FiArrowLeft, FiClock, FiAward } from 'react-icons/fi';
import { testApi } from '../../../api/testApi';
import { QuestionRenderer } from '../../../components/student/QuestionRenderer';
import StudentLayout from '../../../components/student/StudentLayout';

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
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
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

  const correctCount = review?.questions?.filter(q => q.is_correct).length || 0;
  const totalCount = review?.questions?.length || result.total_questions || 0;

  return (
    <StudentLayout pageTitle="Kết quả bài kiểm tra">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Score Card */}
        <div className={`${getScoreBgColor(result.score)} rounded-2xl p-8 mb-6 text-center`}>
          <div className={`text-6xl font-bold mb-2 ${getScoreColor(result.score)}`}>
            {result.score?.toFixed(1) || 0}%
          </div>
          <div className="text-xl font-semibold text-gray-700 mb-4">
            {getScoreMessage(result.score)}
          </div>
          <div className="flex justify-center gap-8 text-sm">
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
                Lần thi thứ <strong>{result.attempt_no}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Test Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="font-bold text-gray-800 mb-4">Thông tin bài kiểm tra</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Môn học:</span>
              <span className="ml-2 font-medium text-gray-800">{result.subject || 'Không rõ'}</span>
            </div>
            <div>
              <span className="text-gray-500">Tổng số câu:</span>
              <span className="ml-2 font-medium text-gray-800">{totalCount}</span>
            </div>
            <div>
              <span className="text-gray-500">Bắt đầu:</span>
              <span className="ml-2 font-medium text-gray-800">
                {new Date(result.started_at).toLocaleString('vi-VN')}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Nộp bài:</span>
              <span className="ml-2 font-medium text-gray-800">
                {result.submitted_at ? new Date(result.submitted_at).toLocaleString('vi-VN') : '-'}
              </span>
            </div>
          </div>
        </div>

        {/* Review Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b flex items-center justify-between">
            <h2 className="font-bold text-gray-800">Xem lại đáp án</h2>
            <button
              onClick={() => setShowReview(!showReview)}
              className="px-4 py-2 bg-blue-100 text-blue-700 font-medium rounded-lg hover:bg-blue-200 transition-colors"
            >
              {showReview ? 'Ẩn đi' : 'Hiển thị'}
            </button>
          </div>

          {showReview && review?.questions && (
            <div className="divide-y">
              {review.questions.map((question, index) => (
                <div key={question.id} className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    {question.is_correct ? (
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <FiCheckCircle className="text-green-600" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                        <FiXCircle className="text-red-600" />
                      </div>
                    )}
                    <span className="font-semibold text-gray-800">
                      Câu {index + 1}
                    </span>
                    <span className={`text-sm ${
                      question.is_correct ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {question.is_correct ? 'Đúng' : 'Sai'}
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

        {/* Actions */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={() => navigate('/student/tests')}
            className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors"
          >
            Quay lại danh sách
          </button>
          <button
            onClick={() => navigate('/student/practice')}
            className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            Luyện tập thêm
          </button>
        </div>
      </div>
    </StudentLayout>
  );
}

export default TestResultPage;
