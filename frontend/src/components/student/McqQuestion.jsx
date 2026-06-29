import { useState, useEffect } from 'react';

export function McqQuestion({ question, onAnswer, answer = null, showResult = false, result = null }) {
  const [selectedAnswers, setSelectedAnswers] = useState(
    Array.isArray(answer) ? answer : (answer ? [answer] : [])
  );
  const { options = [], correct_answers: correctAnswers = [] } = question.data || {};

  useEffect(() => {
    setSelectedAnswers(Array.isArray(answer) ? answer : (answer ? [answer] : []));
  }, [answer]);

  const handleToggle = (optionId) => {
    if (showResult) return;
    const newSelected = selectedAnswers.includes(optionId)
      ? selectedAnswers.filter(id => id !== optionId)
      : [...selectedAnswers, optionId];
    setSelectedAnswers(newSelected);
    onAnswer(newSelected);
  };

  const getOptionClass = (option) => {
    if (!showResult) {
      return selectedAnswers.includes(option.id)
        ? 'border-blue-500 bg-blue-50'
        : 'border-gray-200 hover:border-blue-300';
    }

    const isSelected = selectedAnswers.includes(option.id);
    const isCorrectOption = correctAnswers.includes(option.id);
    if (isCorrectOption && isSelected) return 'border-green-500 bg-green-50';
    if (!isCorrectOption && isSelected) return 'border-red-500 bg-red-50';
    if (isCorrectOption && !isSelected) return 'border-green-500 bg-yellow-50';
    return 'border-gray-200';
  };

  const correctAnswerDisplay = result?.correct_answer_display
    ?? (Array.isArray(correctAnswers) ? correctAnswers.join(', ').toUpperCase() : (correctAnswers ?? '').toUpperCase());

  return (
    <div className="space-y-4">
      {question.content && (
        <p className="text-lg font-medium text-gray-800">{question.content}</p>
      )}

      {question.media_image && (
        <img src={question.media_image} alt="" className="max-w-md rounded-lg" />
      )}

      {question.media_audio && (
        <audio controls src={question.media_audio} className="w-full" />
      )}

      <div className="space-y-3">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => handleToggle(option.id)}
            disabled={showResult}
            className={`w-full text-left p-4 border-2 rounded-lg transition-all ${getOptionClass(option)}`}
          >
            <input
              type="checkbox"
              checked={selectedAnswers.includes(option.id)}
              onChange={() => handleToggle(option.id)}
              disabled={showResult}
              className="mr-3 w-4 h-4 accent-blue-600"
            />
            <span className="font-medium mr-3">{option.id}.</span>
            <span>{option.text}</span>
          </button>
        ))}
      </div>

      {showResult && correctAnswerDisplay && (
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700">
            <strong>Dap an dung:</strong> {correctAnswerDisplay}
          </p>
        </div>
      )}
    </div>
  );
}

export default McqQuestion;
