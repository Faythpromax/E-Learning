import { useState, useEffect } from 'react';

export function TableFillQuestion({ question, onAnswer, answer = null, showResult = false, result = null, userAnswer = null }) {
  const { headers = [], rows = [], cols = 0 } = question.data || {};

  // left_column: cột đầu tiên (label/hàng để đọc)
  // right_column: cột cuối (đáp án để chấm điểm, từ correct_answers)
  const leftColumn = question.data?.left_column || [];
  const rightColumn = question.data?.right_column || [];
  const rowCount = leftColumn.length || rows.length || 2;

  const [answers, setAnswers] = useState(answer || userAnswer || {});

  useEffect(() => {
    if (answer) {
      setAnswers(answer);
    } else if (userAnswer) {
      setAnswers(userAnswer);
    }
  }, [answer, userAnswer]);

  const handleChange = (rowIndex, value) => {
    if (showResult) return;
    const newAnswers = { ...answers, [rowIndex]: value };
    setAnswers(newAnswers);
    onAnswer(newAnswers);
  };

  const isCorrect = (rowIndex) => {
    const userAnswer = (answers[rowIndex] || '').toLowerCase().trim();
    const correctAnswer = (rightColumn[rowIndex] || '').toLowerCase().trim();
    return userAnswer === correctAnswer;
  };

  // Prefer backend's is_correct when available (PracticeSessionPage flow)
  const overallCorrect = result?.is_correct
    ? Object.keys(rightColumn).every((key) => isCorrect(parseInt(key)))
    : false;

  return (
    <div className="space-y-4">
      {question.content && (
        <p className="text-lg font-medium text-gray-800">{question.content}</p>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr>
              {headers.map((header, i) => (
                <th
                  key={i}
                  className="border border-gray-200 bg-gray-50 text-gray-700 font-semibold text-center"
                  style={{ padding: '16px 24px' }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rowCount }).map((_, rowIndex) => {
              const label = leftColumn[rowIndex] || (rows[rowIndex]?.[0] || '');
              return (
                <tr key={rowIndex}>
                  {/* Cột trái: hiển thị label (chỉ đọc) */}
                  <td 
                    className="border border-gray-200 text-gray-800 bg-gray-50/30 font-medium"
                    style={{ padding: '16px 24px' }}
                  >
                    {label}
                  </td>
                  {/* Cột phải: ô nhập đáp án */}
                  <td className="border border-gray-200" style={{ padding: '16px' }}>
                    {showResult ? (
                      <div
                        className={`px-4 py-2.5 rounded-lg text-center font-medium ${
                          overallCorrect
                            ? 'bg-green-50 text-green-700 border border-green-300'
                            : 'bg-red-50 text-red-700 border border-red-300'
                        }`}
                      >
                        {answers[rowIndex] || ''}
                        {!overallCorrect && rightColumn[rowIndex] && (
                          <span className="text-gray-500 ml-1">
                            {' '}({rightColumn[rowIndex]})
                          </span>
                        )}
                      </div>
                    ) : (
                      <input
                        type="text"
                        value={answers[rowIndex] || ''}
                        onChange={(e) => handleChange(rowIndex, e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-all shadow-sm"
                        placeholder="..."
                      />
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TableFillQuestion;
