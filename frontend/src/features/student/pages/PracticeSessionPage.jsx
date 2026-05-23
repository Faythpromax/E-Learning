import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheck, FiX, FiArrowRight } from 'react-icons/fi';
import StudentLayout from '../../../components/student/StudentLayout';
import practiceApi from '../../../api/practiceApi';

const PracticeSessionPage = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await practiceApi.getRandomQuestions({ limit: 10 });
      if (response.success) {
        setQuestions(response.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAnswer = (index) => {
    if (showResult) return;
    setSelectedAnswer(index);
  };

  const handleCheckAnswer = async () => {
    if (selectedAnswer === null) return;

    setShowResult(true);
    await practiceApi.submitAnswer({
      question_id: questions[currentIndex].id,
      answer: questions[currentIndex].options[selectedAnswer],
    });
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
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
        {/* Progress */}
        <div className="mb-6">
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 bg-purple-600 rounded-full transition-all"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <p className="text-lg font-medium text-gray-800 mb-6">{currentQuestion.question}</p>

          <div className="space-y-3">
            {currentQuestion.options?.map((option, index) => {
              let optionClass = 'border-gray-200 hover:border-purple-500';
              if (showResult) {
                if (index === currentQuestion.correct_answer) {
                  optionClass = 'border-green-500 bg-green-50';
                } else if (index === selectedAnswer && index !== currentQuestion.correct_answer) {
                  optionClass = 'border-red-500 bg-red-50';
                }
              } else if (selectedAnswer === index) {
                optionClass = 'border-purple-500 bg-purple-50';
              }

              return (
                <button
                  key={index}
                  onClick={() => handleSelectAnswer(index)}
                  disabled={showResult}
                  className={`w-full p-4 border-2 rounded-lg text-left transition-colors ${optionClass}`}
                >
                  <span className="font-medium">{String.fromCharCode(65 + index)}. </span>
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          {!showResult ? (
            <button
              onClick={handleCheckAnswer}
              disabled={selectedAnswer === null}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              Kiem tra
            </button>
          ) : (
            <div className="flex items-center gap-4">
              <span className={`flex items-center gap-2 ${selectedAnswer === currentQuestion.correct_answer ? 'text-green-600' : 'text-red-600'}`}>
                {selectedAnswer === currentQuestion.correct_answer ? <FiCheck /> : <FiX />}
                {selectedAnswer === currentQuestion.correct_answer ? 'Dung!' : 'Sai!'}
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
