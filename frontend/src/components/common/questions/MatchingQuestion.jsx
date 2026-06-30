import { useState, useEffect } from "react";

const stripNumberPrefix = (text) => {
  if (typeof text !== "string") return text;
  return text.replace(/^\s*\d+\.\s*/, "");
};

export function MatchingQuestion({
  question,
  onAnswer,
  showResult = false,
  answer = {},
}) {
  const { left = [], right = [], correct_matches = {} } = question.data || {};
  const [matches, setMatches] = useState({});
  const [selectedLeft, setSelectedLeft] = useState(null);

  useEffect(() => {
    setMatches(answer ?? {});
  }, [answer]);

  const handleMatch = (leftId, rightId) => {
    console.log("MATCH", leftId, rightId);
    if (showResult) return;
    const newMatches = { ...matches, [leftId]: rightId };
    setMatches(newMatches);
    onAnswer(newMatches);
  };

  const isCorrectMatch = (leftId, rightId) => {
    return correct_matches[leftId] === rightId;
  };

  const shuffledRight = right;

  console.log(question.data);
  console.log(selectedLeft);

  return (
    <div className="space-y-4">
      {question.content && (
        <p className="text-lg font-medium text-gray-800">{question.content}</p>
      )}

      {question.media_image && (
        <img
          src={question.media_image}
          alt=""
          className="max-w-md rounded-lg"
        />
      )}

      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-700">Cột trái</h4>
          {left.map((item, index) => (
            <div
              key={index}
              onClick={() => {
                console.log("LEFT CLICK", index);
                if (!showResult) {
                  setSelectedLeft(index);
                }
              }}
              className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                showResult
                  ? isCorrectMatch(index, matches[index])
                    ? "border-green-500 bg-green-50"
                    : matches[index] !== undefined
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200"
                  : selectedLeft === index
                    ? "border-blue-600 bg-blue-100"
                    : matches[index] !== undefined
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-blue-300"
              }`}
            >
              {/* <span className="font-medium mr-2">{index + 1}.</span> */}
              <span>{stripNumberPrefix(item)}</span>
              {showResult && matches[index] !== undefined && (
                <span className="ml-2 text-sm">
                  → {matches[index] + 1}
                  {!isCorrectMatch(index, matches[index]) && (
                    <span className="text-red-600 ml-1">
                      (đúng: {correct_matches[index] + 1})
                    </span>
                  )}
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold text-gray-700">Cột phải</h4>
          {shuffledRight.map((item, shuffledIndex) => {
            const originalIndex = right.indexOf(item);
            return (
              <div
                key={shuffledIndex}
                className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                  showResult
                    ? Object.values(matches).includes(originalIndex)
                      ? "border-gray-300 bg-gray-100"
                      : "border-gray-200 hover:border-blue-300"
                    : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                }`}
                onClick={() => {
                  console.log("RIGHT CLICK", originalIndex);
                  console.log("selected =", selectedLeft);
                  if (showResult) return;

                  let targetLeft = selectedLeft;
                  if (targetLeft === null) {
                    const leftItems = Array.isArray(left) ? left : [];
                    targetLeft = leftItems.findIndex((_, idx) => matches[idx] === undefined);
                    if (targetLeft === -1) return;
                  } else {
                    setSelectedLeft(null);
                  }

                  handleMatch(targetLeft, originalIndex);
                }}
              >
                {/* <span className="font-medium mr-2">{originalIndex + 1}.</span> */}
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
            <div className="text-green-600 font-medium">Chính xác!</div>
          ) : (
            <div className="text-red-600 font-medium">
              Còn một số cặp chưa đúng. Hãy kiểm tra lại.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MatchingQuestion;
