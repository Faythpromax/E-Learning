import React from 'react';
import { useParams } from 'react-router-dom';
import StudentLayout from '../../../components/student/StudentLayout';

const StudentClassDetailPage = () => {
  const { classId } = useParams();

  return (
    <StudentLayout pageTitle="Chi tiết lớp học">
      <div className="dashboard-section">
        <h3 className="dashboard-section-title">
          Chi tiết lớp học #{classId}
        </h3>
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
            Tính năng chi tiết lớp học sẽ được phát triển sớm.
          </p>
        </div>
      </div>
    </StudentLayout>
  );
};

export default StudentClassDetailPage;
