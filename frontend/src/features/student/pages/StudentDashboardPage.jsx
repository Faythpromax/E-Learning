import React from 'react';
import StudentLayout from '../../../components/student/StudentLayout';
import ClassCard from '../../../components/student/ClassCard';
import AssignmentCard from '../../../components/student/AssignmentCard';

const StudentDashboardPage = () => {
  const mockClasses = [
    {
      id: 1,
      name: 'Tiếng Anh 5A3',
      teacher: 'Nguyễn Văn An',
      color: '#4ec28a',
      avatar: 'N',
    },
    {
      id: 2,
      name: 'Lịch Sử 5A3',
      teacher: 'Nguyễn Văn An',
      color: '#c04ac0',
      avatar: 'N',
    },
  ];

  const mockAssignments = [
    {
      id: 1,
      title: 'Ôn tập từ vựng',
    },
  ];

  return (
    <StudentLayout pageTitle="Màn hình chính">
      {/* Recent Classes Section */}
      <div className="dashboard-section">
        <h2 className="dashboard-section-title">Các lớp học gần đây</h2>
        <div className="dashboard-grid">
          {mockClasses.map((classItem) => (
            <ClassCard key={classItem.id} classData={classItem} />
          ))}
        </div>
      </div>

      {/* Recent Assignments Section */}
      <div className="dashboard-section">
        <h2 className="dashboard-section-title">Bài tập gần đây</h2>
        <div className="dashboard-list">
          {mockAssignments.map((assignment) => (
            <AssignmentCard key={assignment.id} assignment={assignment} />
          ))}
        </div>
      </div>
    </StudentLayout>
  );
};

export default StudentDashboardPage;