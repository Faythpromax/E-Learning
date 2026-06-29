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

  return (
    <div className="space-y-4">
      {question.content && (
        <p className="text-lg font-medium text-gray-800">{question.content}</p>
      )}

      <div className="overflow-x-auto">
        <table className="border-collapse border">
          <thead>
            <tr>
              {headers.map((header, i) => (
                <th
                  key={i}
                  className="border p-3 bg-gray-100 text-gray-700 font-semibold text-center"
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
                  <td className="border p-3 text-gray-800 bg-gray-50 font-medium">
                    {label}
                  </td>
                  {/* Cột phải: ô nhập đáp án */}
                  <td className="border p-2">
                    {showResult ? (
                      <div
                        className={`px-3 py-2 rounded text-center ${
                          isCorrect(rowIndex)
                            ? 'bg-green-50 text-green-700 border border-green-500'
                            : 'bg-red-50 text-red-700 border border-red-500'
                        }`}
                      >
                        {answers[rowIndex] || ''}
                        {!isCorrect(rowIndex) && rightColumn[rowIndex] && (
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
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
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
