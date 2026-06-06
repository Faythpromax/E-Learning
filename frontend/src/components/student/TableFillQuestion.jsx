import { useState, useEffect } from 'react';

export function TableFillQuestion({ question, onAnswer, answer = null, showResult = false, result = null }) {
  const { rows = 2, cols = 2, correct_answers = {} } = question.data || {};
  const [answers, setAnswers] = useState(answer || {});

  useEffect(() => {
    if (answer) {
      setAnswers(answer);
    }
  }, [answer]);

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
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TableFillQuestion;
