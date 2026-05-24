import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import TeacherLayout from '../../../components/teacher/TeacherLayout';
import ClassCard from '../../../components/teacher/ClassCard';
import AssignmentCard from '../../../components/teacher/AssignmentCard';

const TeacherDashboardPage = () => {
  const navigate = useNavigate();
  
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
      name: 'Tiếng Anh 4A2',
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

  const handleCreateClass = () => {
    // TODO: Navigate to create class page or open a modal
    // navigate('/teacher/create-class');
    console.log('Create class clicked');
  };

  return (
    <TeacherLayout pageTitle="Màn hình chính">
      {/* Recent Classes Section */}
      <div className="dashboard-section">
        <div className="dashboard-section-header">
          <h2 className="dashboard-section-title">Các lớp học gần đây</h2>
          <button className="create-class-btn" onClick={handleCreateClass}>
            <FiPlus className="btn-icon" />
            Tạo lớp học
          </button>
        </div>
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
    </TeacherLayout>
  );
};

export default TeacherDashboardPage;