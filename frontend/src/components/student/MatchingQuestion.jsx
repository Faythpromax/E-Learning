import { useState, useEffect } from 'react';

export function MatchingQuestion({ question, onAnswer, answer = null, showResult = false, result = null }) {
  const { left = [], right = [], correct_matches = {} } = question.data || {};
  const [matches, setMatches] = useState(answer || {});

  useEffect(() => {
    if (answer) {
      setMatches(answer);
    }
  }, [answer]);

  const handleMatch = (leftId, rightId) => {
    if (showResult) return;
    const newMatches = { ...matches, [leftId]: rightId };
    setMatches(newMatches);
    onAnswer(newMatches);
  };

  const isCorrectMatch = (leftId, rightId) => {
    return correct_matches[leftId] === rightId;
  };

  const shuffledRight = [...right].sort(() => Math.random() - 0.5);

  return (
    <div className="space-y-4">
      {question.content && (
        <p className="text-lg font-medium text-gray-800">{question.content}</p>
      )}

      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-700">Cot trai</h4>
          {left.map((item, index) => (
            <div
              key={index}
              className={`p-3 border-2 rounded-lg ${
                showResult
                  ? isCorrectMatch(index, matches[index])
                    ? 'border-green-500 bg-green-50'
                    : matches[index] !== undefined
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200'
                  : matches[index] !== undefined
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200'
              }`}
            >
              <span className="font-medium mr-2">{index + 1}.</span>
              <span>{item}</span>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold text-gray-700">Cot phai</h4>
          {shuffledRight.map((item, shuffledIndex) => {
            const originalIndex = right.indexOf(item);
            return (
              <div
                key={shuffledIndex}
                className="p-3 border-2 border-gray-200 rounded-lg"
              >
                <span className="font-medium mr-2">{originalIndex + 1}.</span>
                <span>{item}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default MatchingQuestion;
