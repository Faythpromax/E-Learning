import { useState, useEffect } from 'react';

export function McqQuestion({ question, onAnswer, answer = null, showResult = false, result = null }) {
  const [selectedAnswer, setSelectedAnswer] = useState(answer);
  const { options = [], correct_answer } = question.data || {};
  const correctAnswer = correct_answer;

  useEffect(() => {
    setSelectedAnswer(answer);
  }, [answer]);

  const handleSelect = (optionId) => {
    if (showResult) return;
    setSelectedAnswer(optionId);
    onAnswer(optionId);
  };

  const getOptionClass = (option) => {
    if (!showResult) {
      return selectedAnswer === option.id
        ? 'border-blue-500 bg-blue-50'
        : 'border-gray-200 hover:border-blue-300';
    }

    if (option.id === correctAnswer) {
      return 'border-green-500 bg-green-50';
    }
    if (selectedAnswer === option.id && option.id !== correctAnswer) {
      return 'border-red-500 bg-red-50';
    }
    return 'border-gray-200';
  };

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
            onClick={() => handleSelect(option.id)}
            disabled={showResult}
            className={`w-full text-left p-4 border-2 rounded-lg transition-all ${getOptionClass(option)}`}
          >
            <span className="font-medium mr-3">{option.id}.</span>
            <span>{option.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default McqQuestion;
