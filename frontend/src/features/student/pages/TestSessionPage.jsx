import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiFlag, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { testApi } from '../../../api/testApi';
import { TestTimer } from '../../../components/student/TestTimer';
import { TestQuestionNav } from '../../../components/student/TestQuestionNav';
import { TestSubmitModal } from '../../../components/student/TestSubmitModal';
import { QuestionRenderer } from '../../../components/student/QuestionRenderer';

export function TestSessionPage() {
  const { testId } = useParams();
  const navigate = useNavigate();
  
  const [testData, setTestData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showNav, setShowNav] = useState(true);

  useEffect(() => {
    startTest();
  }, [testId]);

  const startTest = async () => {
    try {
      setLoading(true);
      const response = await testApi.startTest(testId);
      
      if (response.success && response.data) {
        const data = response.data;
        setTestData(data);
        setQuestions(data.questions || []);
        
        // Restore existing answers
        if (data.existing_answers) {
          setAnswers(data.existing_answers);
        }
      }
    } catch (error) {
      console.error('Failed to start test:', error);
      alert('Khong the bat dau bai kiem tra. Vui long thu lai.');
      navigate('/student/tests');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = useCallback((answer) => {
    const questionId = questions[currentIndex].id;
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  }, [questions, currentIndex]);

  const handleNavigate = (index) => {
    setCurrentIndex(index);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const toggleFlag = () => {
    const questionId = questions[currentIndex].id;
    setFlaggedQuestions(prev => 
      prev.includes(questionId)
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  const handleTimeUp = useCallback(async () => {
    await submitTest();
  }, [testId, answers]);

  const submitTest = async () => {
    try {
      setSubmitting(true);
      setShowSubmitModal(false);
      
      const response = await testApi.submitTest(testId, testData.attempt_id, answers);
      
      if (response.success) {
        navigate(`/student/tests/${testData.attempt_id}/results`, {
          state: { result: response.data }
        });
      }
    } catch (error) {
      console.error('Failed to submit test:', error);
      alert('Khong the noi bai. Vui long thu lai.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Dang tai bai kiem tra...</div>
      </div>
    );
  }

  if (!testData || questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-gray-500 mb-4">Khong the tai bai kiem tra.</p>
        <button
          onClick={() => navigate('/student/tests')}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg"
        >
          Quay lai
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(answers).filter(id => answers[id] !== null && answers[id] !== undefined).length;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/student/tests')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Quay lai"
            >
              <FiArrowLeft className="text-xl text-gray-600" />
            </button>
            <div>
              <h1 className="font-bold text-gray-800">{testData.test_title}</h1>
              <p className="text-sm text-gray-500">
                Cau {currentIndex + 1} / {questions.length}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowNav(!showNav)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
            >
              {showNav ? 'An danh sach' : 'Hien danh sach'}
            </button>
            
            <TestTimer
              expiredAt={testData.expired_at}
              initialSeconds={testData.remaining_time}
              onTimeUp={handleTimeUp}
            />

            <button
              onClick={() => setShowSubmitModal(true)}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
            >
              Noi bai
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Question Navigator - Sidebar */}
          {showNav && (
            <aside className="w-72 flex-shrink-0">
              <TestQuestionNav
                questions={questions}
                currentIndex={currentIndex}
                answers={answers}
                flaggedQuestions={flaggedQuestions}
                onNavigate={handleNavigate}
              />
            </aside>
          )}

          {/* Question Content */}
          <main className="flex-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              {/* Question Header */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-500">
                  Cau hoi {currentIndex + 1}
                </span>
                <button
                  onClick={toggleFlag}
                  className={`p-2 rounded-lg transition-colors ${
                    flaggedQuestions.includes(currentQuestion.id)
                      ? 'bg-yellow-100 text-yellow-600'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                  title="Danh dau de xem lai"
                >
                  <FiFlag />
                </button>
              </div>

              {/* Question Content */}
              <QuestionRenderer
                question={currentQuestion}
                onAnswer={handleAnswer}
                showResult={false}
                answer={answers[currentQuestion.id]}
              />
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-4">
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                  currentIndex === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
                }`}
              >
                <FiChevronLeft />
                Cau truoc
              </button>

              <div className="text-gray-500">
                Da tra loi: {answeredCount}/{questions.length}
              </div>

              {currentIndex < questions.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Cau tiep
                  <FiChevronRight />
                </button>
              ) : (
                <button
                  onClick={() => setShowSubmitModal(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Noi bai
                </button>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Submit Modal */}
      <TestSubmitModal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        onSubmit={submitTest}
        totalQuestions={questions.length}
        answeredCount={answeredCount}
        isSubmitting={submitting}
      />
    </div>
  );
}

export default TestSessionPage;
