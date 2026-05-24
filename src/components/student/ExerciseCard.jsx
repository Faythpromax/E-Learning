import React from 'react';

const ExerciseCard = ({ exercise }) => {
  return (
    <div className="class-detail-card exercise-card">
      <h3>{exercise.title}</h3>
      <p className="exercise-description">{exercise.description}</p>
      <p className="class-detail-meta">Hạn nộp: {exercise.dueDate}</p>
      <div className="class-detail-action">
        <button type="button" className="class-detail-button">
          Làm bài
        </button>
      </div>
    </div>
  );
};

export default ExerciseCard;
