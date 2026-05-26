import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import TeacherLayout from '../../../components/teacher/TeacherLayout';
import ClassCard from '../../../components/teacher/ClassCard';
import AssignmentCard from '../../../components/teacher/AssignmentCard';
import { classService } from '../../../services/classService';
import { testService } from '../../../services/testService';

const TeacherDashboardPage = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [classesData, testsData] = await Promise.all([
        classService.getAll(),
        testService.getAll()
      ]);
      setClasses(classesData.data || []);
      setAssignments(testsData.data || []);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClass = () => {
    // navigate('/teacher/classes/create');
    console.log('Create class clicked');
  };

  return (
    <TeacherLayout pageTitle="Màn hình chính">
      {loading ? (
        <div style={{ padding: '20px', textAlign: 'center' }}>Đang tải dữ liệu...</div>
      ) : (
        <>
          {/* Recent Classes Section */}
          <div className="dashboard-section">
            <div className="dashboard-section-header">
              <h2 className="dashboard-section-title">Các lớp học của tôi</h2>
              <button className="create-class-btn" onClick={handleCreateClass}>
                <FiPlus className="btn-icon" />
                Tạo lớp học
              </button>
            </div>
            <div className="dashboard-grid">
              {classes.length > 0 ? (
                classes.map((classItem) => (
                  <ClassCard key={classItem.id} classData={{
                    ...classItem,
                    color: classItem.color || '#4ec28a',
                    avatar: classItem.name ? classItem.name.charAt(0).toUpperCase() : 'C',
                    teacher: 'Bạn'
                  }} />
                ))
              ) : (
                <p>Bạn chưa có lớp học nào.</p>
              )}
            </div>
          </div>

          {/* Recent Assignments Section */}
          <div className="dashboard-section">
            <h2 className="dashboard-section-title">Đề thi / Bài tập mới nhất</h2>
            <div className="dashboard-list">
              {assignments.length > 0 ? (
                assignments.map((assignment) => (
                  <AssignmentCard key={assignment.id} assignment={assignment} />
                ))
              ) : (
                <p>Chưa có đề thi nào được tạo.</p>
              )}
            </div>
          </div>
        </>
      )}
    </TeacherLayout>
  );
};

export default TeacherDashboardPage;