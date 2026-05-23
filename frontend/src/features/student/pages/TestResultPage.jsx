import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { FiCheckCircle, FiXCircle, FiArrowLeft, FiClock, FiAward } from 'react-icons/fi';
import { testApi } from '../../../api/testApi';
import { QuestionRenderer } from '../../../components/student/QuestionRenderer';

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
    if (score >= 90) return 'Xuat sac!';
    if (score >= 80) return 'Rat tot!';
    if (score >= 70) return 'Kha!';
    if (score >= 60) return 'Trung binh';
    if (score >= 50) return 'Can co gang them';
    return 'Chua dat';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Dang tai ket qua...</div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-gray-500 mb-4">Khong tim thay ket qua.</p>
        <button
          onClick={() => navigate('/student/tests')}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg"
        >
          Quay lai
        </button>
      </div>
    );
  }

  const correctCount = review?.questions?.filter(q => q.is_correct).length || 0;
  const totalCount = review?.questions?.length || result.total_questions || 0;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/student/tests')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiArrowLeft className="text-xl text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Ket qua bai kiem tra</h1>
            <p className="text-sm text-gray-500">{result.test_title}</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
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
                <strong>{correctCount}</strong> cau dung
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FiXCircle className="text-red-600" />
              <span className="text-gray-700">
                <strong>{totalCount - correctCount}</strong> cau sai
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FiClock className="text-gray-600" />
              <span className="text-gray-700">
                Lan thi thu <strong>{result.attempt_no}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Test Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="font-bold text-gray-800 mb-4">Thong tin bai kiem tra</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Mon hoc:</span>
              <span className="ml-2 font-medium text-gray-800">{result.subject || 'Khong ro'}</span>
            </div>
            <div>
              <span className="text-gray-500">Tong so cau:</span>
              <span className="ml-2 font-medium text-gray-800">{totalCount}</span>
            </div>
            <div>
              <span className="text-gray-500">Bat dau:</span>
              <span className="ml-2 font-medium text-gray-800">
                {new Date(result.started_at).toLocaleString('vi-VN')}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Nop bai:</span>
              <span className="ml-2 font-medium text-gray-800">
                {result.submitted_at ? new Date(result.submitted_at).toLocaleString('vi-VN') : '-'}
              </span>
            </div>
          </div>
        </div>

        {/* Review Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b flex items-center justify-between">
            <h2 className="font-bold text-gray-800">Xem lai dap an</h2>
            <button
              onClick={() => setShowReview(!showReview)}
              className="px-4 py-2 bg-blue-100 text-blue-700 font-medium rounded-lg hover:bg-blue-200 transition-colors"
            >
              {showReview ? 'An di' : 'Hien thi'}
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
                      Cau {index + 1}
                    </span>
                    <span className={`text-sm ${
                      question.is_correct ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {question.is_correct ? 'Dung' : 'Sai'}
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
            Quay lai danh sach
          </button>
          <button
            onClick={() => navigate('/student/practice')}
            className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            Luyen tap them
          </button>
        </div>
      </div>
    </div>
  );
}

export default TestResultPage;
