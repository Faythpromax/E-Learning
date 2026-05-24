import React from 'react';
import StudentLayout from '../../../components/student/StudentLayout';

const StudentGradesPage = () => {
  return (
    <StudentLayout pageTitle="Kết quả học tập">
      <div className="dashboard-section">
        <h3 className="dashboard-section-title">Kết quả học tập</h3>
        <div
          style={{
            background: 'white',
            padding: '32px',
            borderRadius: '16px',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          }}
        >
          <p style={{ color: '#666', fontSize: '16px' }}>
            Tính năng kết quả học tập sẽ được phát triển sớm.
          </p>
        </div>
      </div>
    </StudentLayout>
  );
};

export default StudentGradesPage;
