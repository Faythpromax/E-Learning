import { useState, useEffect } from 'react';

export function FillBlankQuestion({ question, onAnswer, answer = null, showResult = false, result = null }) {
  const { correct_answers = [], case_sensitive = false } = question.data || {};
  const [answers, setAnswers] = useState(answer || Array(correct_answers.length).fill(''));

  useEffect(() => {
    if (answer) {
      setAnswers(answer);
    }
  }, [answer]);

  const handleChange = (index, value) => {
    if (showResult) return;
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
    onAnswer(newAnswers);
  };

  const isCorrect = (userAnswer, correctAnswer) => {
    if (case_sensitive) {
      return userAnswer.trim() === correctAnswer.trim();
    }
    return userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim();
  };

  const contentParts = question.content?.split('___') || [question.content];

  return (
    <div className="space-y-4">
      <p className="text-lg font-medium text-gray-800">
        {contentParts.map((part, index) => (
          <span key={index}>
            {part}
            {index < contentParts.length - 1 && (
              <span className="inline-flex items-center gap-1 mx-1">
                <input
                  type="text"
                  value={answers[index] || ''}
                  onChange={(e) => handleChange(index, e.target.value)}
                  disabled={showResult}
                  className={`px-3 py-1 border-2 rounded text-center min-w-24 ${
                    showResult
                      ? isCorrect(answers[index], correct_answers[index])
                        ? 'border-green-500 bg-green-50'
                        : 'border-red-500 bg-red-50'
                      : 'border-gray-300 focus:border-blue-500'
                  }`}
                />
              </span>
            )}
          </span>
        ))}
      </p>

      {question.media_image && (
        <img src={question.media_image} alt="" className="max-w-md rounded-lg" />
      )}
    </div>
  );
}

export default FillBlankQuestion;
