import { useState } from 'react';

export function TableFillQuestion({ question, onAnswer, showResult = false, userAnswer = null }) {
  const { rows = 2, cols = 2, correct_answers = {} } = question.data || {};
  const [answers, setAnswers] = useState(userAnswer || {});

  const handleChange = (row, col, value) => {
    if (showResult) return;
    const key = `${row}-${col}`;
    const newAnswers = { ...answers, [key]: value };
    setAnswers(newAnswers);
    onAnswer(newAnswers);
  };

  const isCorrect = (row, col) => {
    const key = `${row}-${col}`;
    const userAnswer = answers[key] || '';
    const correctAnswer = correct_answers[row]?.[col] || '';
    return userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim();
  };

  return (
    <div className="space-y-4">
      {question.content && (
        <p className="text-lg font-medium text-gray-800">{question.content}</p>
      )}

      {question.media_image && (
        <img src={question.media_image} alt="" className="max-w-md rounded-lg" />
      )}

      <div className="overflow-x-auto">
        <table className="border-collapse border">
          <tbody>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={rowIndex}>
                {Array.from({ length: cols }).map((_, colIndex) => {
                  const key = `${rowIndex}-${colIndex}`;
                  return (
                    <td key={colIndex} className="border p-2">
                      <input
                        type="text"
                        value={answers[key] || ''}
                        onChange={(e) => handleChange(rowIndex, colIndex, e.target.value)}
                        disabled={showResult}
                        className={`w-24 px-2 py-1 border rounded text-center ${
                          showResult
                            ? isCorrect(rowIndex, colIndex)
                              ? 'border-green-500 bg-green-50'
                              : 'border-red-500 bg-red-50'
                            : 'border-gray-300 focus:border-blue-500'
                        }`}
                      />
                      {showResult && (
                        <span className="text-green-600 text-sm ml-1">
                          ({correct_answers[rowIndex]?.[colIndex]})
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showResult && (
        <div className="mt-4">
          {Object.keys(correct_answers).every(row =>
            Object.keys(correct_answers[row]).every(col =>
              isCorrect(parseInt(row), parseInt(col))
            )
          ) ? (
            <div className="text-green-600 font-medium">Chính xác!</div>
          ) : (
            <div className="text-red-600 font-medium">
              Còn một số ô chưa đúng. Hãy kiểm tra lại.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default TableFillQuestion;
