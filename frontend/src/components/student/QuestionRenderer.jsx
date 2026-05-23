import { useState } from 'react';
import { McqQuestion } from './McqQuestion';
import { FillBlankQuestion } from './FillBlankQuestion';
import { MatchingQuestion } from './MatchingQuestion';
import { TableFillQuestion } from './TableFillQuestion';

const questionComponents = {
  mcq: McqQuestion,
  fill_blank: FillBlankQuestion,
  matching: MatchingQuestion,
  table_fill: TableFillQuestion,
};

export function QuestionRenderer({
  question,
  onAnswer,
  showResult = false,
  result = null
}) {
  const [answer, setAnswer] = useState(null);
  const QuestionComponent = questionComponents[question.type];

  const handleAnswer = (userAnswer) => {
    setAnswer(userAnswer);
    onAnswer(userAnswer);
  };

  if (!QuestionComponent) {
    return <div className="text-red-500">Loai cau hoi khong xac dinh</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <QuestionComponent
        question={question}
        onAnswer={handleAnswer}
        showResult={showResult}
        result={result}
      />
    </div>
  );
}

export default QuestionRenderer;
