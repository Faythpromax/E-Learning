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
        ? 'bg-blue-50/50'
        : 'hover:bg-gray-50';
    }

    const isSelected = selectedAnswers.includes(option.id);
    const isCorrectOption = correctAnswers.includes(option.id);
    if (isCorrectOption && isSelected) return 'bg-green-50/50';
    if (!isCorrectOption && isSelected) return 'bg-red-50/50';
    if (isCorrectOption && !isSelected) return 'bg-yellow-50/50';
    return '';
  };

  const getCheckboxCircleClass = (option) => {
    const isSelected = selectedAnswers.includes(option.id);
    
    if (!showResult) {
      return isSelected
        ? 'bg-blue-600 border-blue-600 text-white'
        : 'border-gray-300 bg-white text-gray-600 group-hover:border-blue-400';
    }

    const isCorrectOption = correctAnswers.includes(option.id);
    if (isCorrectOption && isSelected) {
      return 'bg-green-600 border-green-600 text-white';
    }
    if (!isCorrectOption && isSelected) {
      return 'bg-red-600 border-red-600 text-white';
    }
    if (isCorrectOption && !isSelected) {
      return 'bg-green-100 border-green-500 text-green-700';
    }
    return 'border-gray-300 bg-white text-gray-400';
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
            className={`w-full text-left p-3.5 rounded-lg transition-all flex items-center gap-4 group ${getOptionClass(option)}`}
          >
            <input
              type="checkbox"
              checked={selectedAnswers.includes(option.id)}
              onChange={() => handleToggle(option.id)}
              disabled={showResult}
              className="sr-only"
            />
            <span className={`w-8 h-8 rounded-full border-2 flex-shrink-0 flex items-center justify-center font-semibold text-sm transition-all ${getCheckboxCircleClass(option)}`}>
              {option.id.toUpperCase()}
            </span>
            <span className="text-gray-800 font-medium">{option.text}</span>
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
