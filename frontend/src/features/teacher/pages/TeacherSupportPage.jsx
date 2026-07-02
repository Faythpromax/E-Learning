import React from 'react';
import TeacherLayout from '../../../components/teacher/TeacherLayout';

const TeacherSupportPage = () => {
  return (
    <TeacherLayout pageTitle="Trợ giúp">
      <div className="dashboard-section">
        {/* <h3 className="dashboard-section-title">Trợ giúp</h3> */}
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
            Tính năng trợ giúp sẽ được phát triển sớm.
          </p>
        </div>
      </div>
    </TeacherLayout>
  );
};

export default TeacherSupportPage;
