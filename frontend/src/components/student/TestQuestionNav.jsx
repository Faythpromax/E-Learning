import { FiFlag } from 'react-icons/fi';

export function TestQuestionNav({ 
  questions, 
  currentIndex, 
  answers,
  flaggedQuestions = [],
  onNavigate 
}) {
  const getQuestionStatus = (index) => {
    const questionId = questions[index]?.id;
    const isAnswered = answers[questionId] !== undefined && answers[questionId] !== null;
    const isFlagged = flaggedQuestions.includes(questionId);

    return { isAnswered, isFlagged };
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="font-semibold text-gray-700 mb-3">Danh sach cau hoi</h3>
      
      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-4 text-xs">
        <div className="flex items-center gap-1">
          <span className="w-4 h-4 rounded bg-gray-200 border border-gray-300"></span>
          <span className="text-gray-600">Chua tra loi</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-4 h-4 rounded bg-blue-500 border border-blue-600"></span>
          <span className="text-gray-600">Da tra loi</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-4 h-4 rounded bg-yellow-400 border border-yellow-500 flex items-center justify-center">
            <FiFlag className="text-xs text-yellow-800" />
          </span>
          <span className="text-gray-600">Danh dau</span>
        </div>
      </div>

      {/* Question Grid */}
      <div className="grid grid-cols-6 gap-2">
        {questions.map((question, index) => {
          const { isAnswered, isFlagged } = getQuestionStatus(index);
          const isCurrent = index === currentIndex;

          let buttonClasses = 'w-full aspect-square rounded-lg font-semibold text-sm transition-all duration-200 ';
          
          if (isCurrent) {
            buttonClasses += 'ring-2 ring-offset-2 ring-blue-500 ';
          }
          
          if (isFlagged) {
            buttonClasses += 'bg-yellow-400 hover:bg-yellow-500 text-yellow-900 border border-yellow-500 ';
          } else if (isAnswered) {
            buttonClasses += 'bg-blue-500 hover:bg-blue-600 text-white border border-blue-600 ';
          } else {
            buttonClasses += 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 ';
          }

          return (
            <button
              key={question.id}
              onClick={() => onNavigate(index)}
              className={buttonClasses}
              title={`Cau ${index + 1}${isAnswered ? ' - Da tra loi' : ''}${isFlagged ? ' - Da danh dau' : ''}`}
            >
              <span className="flex items-center justify-center gap-1">
                {index + 1}
                {isFlagged && <FiFlag className="text-xs" />}
              </span>
            </button>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-4 pt-3 border-t border-gray-200 text-sm text-gray-600">
        <div className="flex justify-between">
          <span>Da tra loi: {Object.keys(answers).filter(id => answers[id] !== null && answers[id] !== undefined).length}/{questions.length}</span>
          <span>Da danh dau: {flaggedQuestions.length}</span>
        </div>
      </div>
    </div>
  );
}

export default TestQuestionNav;
