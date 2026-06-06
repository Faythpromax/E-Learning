import { useState, useEffect } from 'react';
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
  answer: initialAnswer = null,
  showResult = false,
  result = null
}) {
  const [answer, setAnswer] = useState(initialAnswer);
  const QuestionComponent = questionComponents[question.type];

  useEffect(() => {
    setAnswer(initialAnswer);
  }, [initialAnswer]);

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
        answer={answer}
        showResult={showResult}
        result={result}
      />
    </div>
  );
}

export default QuestionRenderer;
