import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiCheck, FiX, FiArrowRight } from 'react-icons/fi';
import StudentLayout from '../../../components/student/StudentLayout';
import QuestionRenderer from '../../../components/student/QuestionRenderer';
import practiceApi from '../../../api/practiceApi';

const PracticeSessionPage = () => {
  const navigate = useNavigate();
  const { practiceId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);

  const fetchQuestions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await practiceApi.getPracticeQuestions(practiceId);
      if (response.success) {
        setQuestions(response.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch questions:', error);
    } finally {
      setLoading(false);
    }
  }, [practiceId]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleAnswer = useCallback((userAnswer) => {
    setAnswer(userAnswer);
  }, []);

  const handleCheckAnswer = async () => {
    if (answer === null) return;

    try {
      const response = await practiceApi.submitAnswer({
        question_id: questions[currentIndex].id,
        answer,
      });
      setResult(response.data || null);
      setShowResult(true);
    } catch (error) {
      console.error('Failed to check answer:', error);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setAnswer(null);
      setShowResult(false);
      setResult(null);
    } else {
      navigate('/student/practice/complete');
    }
  };

  if (loading) {
    return (
      <StudentLayout pageTitle="Luyen tap">
        <div className="text-center py-12 text-gray-500">Dang tai cau hoi...</div>
      </StudentLayout>
    );
  }

  if (questions.length === 0) {
    return (
      <StudentLayout pageTitle="Luyen tap">
        <div className="text-center py-12">
          <p className="text-gray-500">Khong co cau hoi nao</p>
          <button
            onClick={() => navigate('/student/practice')}
            className="mt-4 text-blue-600 hover:underline"
          >
            Quay lai
          </button>
        </div>
      </StudentLayout>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <StudentLayout pageTitle={`Cau ${currentIndex + 1} / ${questions.length}`}>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 bg-purple-600 rounded-full transition-all"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <QuestionRenderer
          question={currentQuestion}
          onAnswer={handleAnswer}
          answer={answer}
          showResult={showResult}
          result={result}
        />

        <div className="flex items-center justify-between mt-6">
          {!showResult ? (
            <button
              onClick={handleCheckAnswer}
              disabled={answer === null}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              Kiem tra
            </button>
          ) : (
            <div className="flex items-center gap-4">
              <span
                className={`flex items-center gap-2 ${
                  result?.is_correct ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {result?.is_correct ? <FiCheck /> : <FiX />}
                {result?.is_correct ? 'Dung!' : 'Sai!'}
              </span>
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
              >
                {currentIndex < questions.length - 1 ? 'Cau tiep theo' : 'Hoan thanh'}
                <FiArrowRight />
              </button>
            </div>
          )}

          <button
            onClick={() => navigate('/student/practice')}
            className="px-4 py-2 text-gray-500 hover:text-gray-700"
          >
            Thoat
          </button>
        </div>
      </div>
    </StudentLayout>
  );
};

export default PracticeSessionPage;
