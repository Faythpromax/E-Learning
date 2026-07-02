import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiFlag,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { testApi } from "../../../api/testApi";
import { TestTimer } from "../../../components/student/TestTimer";
import { TestQuestionNav } from "../../../components/student/TestQuestionNav";
import { TestSubmitModal } from "../../../components/student/TestSubmitModal";
import { QuestionRenderer } from "../../../components/student/QuestionRenderer";

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
  const [starting, setStarting] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;

    started.current = true;

    startTest();
  }, []);

  // useEffect(() => {
  //   fetchResult();
  // }, [attemptId]);

  const startTest = async () => {
    if (starting) return;
    setStarting(true);
    try {
      setLoading(true);
      const response = await testApi.startTest(testId);
      console.log("START TEST RESPONSE:", response);

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
      console.error("Failed to start test:", error);
      alert("Không thể bắt đầu bài kiểm tra. Vui lòng thử lại.");
      navigate("/student/tests");
    } finally {
      setLoading(false);
    }
  };

  // const fetchResult = async () => {
  //   const response = await testApi.getTestResults(attemptId);

  //   setResult(response.data);

  //   await fetchReview();

  //   setLoading(false);
  // };

  const handleAnswer = useCallback(
    async (answer) => {
      const questionId = questions[currentIndex].id;

      setAnswers((prev) => ({
        ...prev,

        [questionId]: answer,
      }));

      await testApi.saveAnswer(
        testData.attempt_id,

        questionId,

        answer,
      );
    },

    [questions, currentIndex, testData],
  );

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
    if (!questions[currentIndex]) return;
    const questionId = questions[currentIndex].id;
    setFlaggedQuestions((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId],
    );
  };

  const handleTimeUp = useCallback(() => {
    if (!testData?.attempt_id || submitting) return;
    setSubmitting(true);
    setShowSubmitModal(false);
    submitTest();
  }, [testData, submitting]);

  const submitTest = async () => {
    try {
      const response = await testApi.submitTest(
        testId,
        testData.attempt_id,
        Object.keys(answers).length > 0 ? answers : [],
      );

      if (response.success) {
        navigate(`/student/tests/${testData.attempt_id}/results`, {
          state: { result: response.data },
        });
      }
    } catch (error) {
      const errorData = error?.response?.data;
      console.error("[submitTest] Failed:", errorData);
      if (errorData?.error === 'This attempt has expired.') {
        const resultRes = await testApi.getTestResults(testData.attempt_id);
        navigate(`/student/tests/${testData.attempt_id}/results`, {
          state: { result: resultRes.data },
        });
      } else {
        alert("Không thể nộp bài. Vui lòng thử lại.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: '12px', backgroundColor: '#f5f6fa' }}>
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <div style={{ color: '#6b7280', fontSize: '14px' }}>Đang tải bài kiểm tra...</div>
      </div>
    );
  }

  if (!testData || questions.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: '16px', backgroundColor: '#f5f6fa' }}>
        <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>Không thể tải bài kiểm tra.</p>
        <button
          onClick={() => navigate("/student/tests")}
          style={{ padding: '10px 20px', backgroundColor: '#2563eb', color: '#fff', fontWeight: '600', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
        >
          Quay lại
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(answers).filter(
    (id) => answers[id] !== null,
  ).length;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f6fa' }}>
      <header style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        position: 'sticky',
        top: 0,
        zIndex: 30,
      }}>
        <div style={{
          maxWidth: '1152px',
          margin: '0 auto',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => navigate("/student/tests")}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#f3f4f6',
                cursor: 'pointer',
              }}
              className="hover:bg-gray-200"
              title="Quay lại"
            >
              <FiArrowLeft style={{ fontSize: '18px', color: '#4b5563' }} />
            </button>
            <div>
              <h1 style={{ fontSize: '16px', fontWeight: '700', color: '#111827', margin: 0 }}>{testData.test_title}</h1>
              <p style={{ fontSize: '13px', color: '#6b7280', margin: '2px 0 0 0' }}>
                Câu {currentIndex + 1} / {questions.length}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setShowNav(!showNav)}
              style={{
                padding: '8px 14px',
                backgroundColor: '#f3f4f6',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '600',
                color: '#374151',
                cursor: 'pointer',
              }}
              className="hover:bg-gray-200"
            >
              {showNav ? "Ẩn danh sách" : "Hiện danh sách"}
            </button>

            <TestTimer
              expiredAt={testData.expired_at}
              initialSeconds={testData.remaining_time}
              onTimeUp={handleTimeUp}
            />

            <button
              onClick={() => setShowSubmitModal(true)}
              disabled={submitting}
              style={{
                padding: '10px 20px',
                backgroundColor: '#16a34a',
                color: '#ffffff',
                fontWeight: '600',
                borderRadius: '8px',
                border: 'none',
                cursor: submitting ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                opacity: submitting ? 0.7 : 1,
              }}
              className="hover:bg-green-700"
            >
              Nộp bài
            </button>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '24px', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
          {showNav && (
            <aside style={{ width: '280px', flexShrink: 0 }}>
              <TestQuestionNav
                questions={questions}
                currentIndex={currentIndex}
                answers={answers}
                flaggedQuestions={flaggedQuestions}
                onNavigate={handleNavigate}
              />
            </aside>
          )}

          <main style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              padding: '24px',
              marginBottom: '16px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#6b7280' }}>
                  Câu hỏi {currentIndex + 1}
                </span>
                <button
                  onClick={toggleFlag}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: flaggedQuestions.includes(currentQuestion.id) ? '#fef3c7' : '#f3f4f6',
                    color: flaggedQuestions.includes(currentQuestion.id) ? '#d97706' : '#6b7280',
                  }}
                  className="hover:opacity-80"
                  title="Đánh dấu để xem lại"
                >
                  <FiFlag />
                </button>
              </div>

              <QuestionRenderer
                question={currentQuestion}
                onAnswer={handleAnswer}
                showResult={false}
                answer={answers[currentQuestion.id]}
              />
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              flexWrap: 'wrap',
            }}>
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 18px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  border: '1px solid #e5e7eb',
                  cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
                  backgroundColor: currentIndex === 0 ? '#f9fafb' : '#ffffff',
                  color: currentIndex === 0 ? '#9ca3af' : '#374151',
                }}
              >
                <FiChevronLeft />
                Câu trước
              </button>

              <div style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>
                Đã trả lời: {answeredCount}/{questions.length}
              </div>

              {currentIndex < questions.length - 1 ? (
                <button
                  onClick={handleNext}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                  }}
                  className="hover:bg-blue-700"
                >
                  Câu tiếp
                  <FiChevronRight />
                </button>
              ) : (
                <button
                  onClick={() => setShowSubmitModal(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: '#16a34a',
                    color: '#ffffff',
                  }}
                  className="hover:bg-green-700"
                >
                  Nộp bài
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
