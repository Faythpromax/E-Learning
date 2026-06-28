import { useState, useEffect } from 'react';

const stripNumberPrefix = (text) => {
  if (typeof text !== 'string') return text;
  return text.replace(/^\s*\d+\.\s*/, '');
};

export function MatchingQuestion({ question, onAnswer, answer = null, showResult = false, result = null }) {
  const { left = [], right = [], correct_matches = {} } = question.data || {};
  const [matches, setMatches] = useState(answer || {});
  const [selectedLeft, setSelectedLeft] = useState(null);

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
    setSelectedLeft(null);
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
              onClick={() => {
                if (!showResult) {
                  setSelectedLeft(selectedLeft === index ? null : index);
                }
              }}
              className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                showResult
                  ? isCorrectMatch(index, matches[index])
                    ? 'border-green-500 bg-green-50'
                    : matches[index] !== undefined
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200'
                  : selectedLeft === index
                  ? 'border-blue-600 bg-blue-100'
                  : matches[index] !== undefined
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <span>{stripNumberPrefix(item)}</span>
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
                onClick={() => {
                  if (showResult) return;
                  if (selectedLeft === null) return;
                  handleMatch(selectedLeft, originalIndex);
                }}
                className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                  showResult
                    ? Object.values(matches).includes(originalIndex)
                      ? 'border-gray-300 bg-gray-100'
                      : 'border-gray-200 hover:border-blue-300'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                }`}
              >
                <span>{stripNumberPrefix(item)}</span>
              </div>
            );
          })}
        </div>
      </div>

      {showResult && (
        <div className="mt-4">
          {Object.keys(matches).every((k) =>
            isCorrectMatch(parseInt(k), matches[k]),
          ) ? (
            <div className="text-green-600 font-medium">Chinh xac!</div>
          ) : (
            <div className="text-red-600 font-medium">
              Con mot so cap chua dung. Hay kiem tra lai.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MatchingQuestion;
