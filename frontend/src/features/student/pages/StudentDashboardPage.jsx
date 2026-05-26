import React, { useEffect, useState } from 'react';
import StudentLayout from '../../../components/student/StudentLayout';
import ClassCard from '../../../components/student/ClassCard';
import AssignmentCard from '../../../components/student/AssignmentCard';
import { classService } from '../../../services/classService';
import { testService } from '../../../services/testService';

const StudentDashboardPage = () => {
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
        testService.getAvailable()
      ]);
      setClasses(classesData.data || []);
      setAssignments(testsData.data || []);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <StudentLayout pageTitle="Màn hình chính">
      {loading ? (
        <div style={{ padding: '20px', textAlign: 'center' }}>Đang tải dữ liệu...</div>
      ) : (
        <>
          {/* Recent Classes Section */}
          <div className="dashboard-section">
            <h2 className="dashboard-section-title">Các lớp học của tôi</h2>
            <div className="dashboard-grid">
              {classes.length > 0 ? (
                classes.map((classItem) => (
                  <ClassCard key={classItem.id} classData={{
                    ...classItem,
                    color: classItem.color || '#4ec28a',
                    avatar: classItem.name ? classItem.name.charAt(0).toUpperCase() : 'C',
                    teacher: classItem.teacher?.name || 'Giáo viên'
                  }} />
                ))
              ) : (
                <p>Bạn chưa tham gia lớp học nào.</p>
              )}
            </div>
          </div>

          {/* Recent Assignments Section */}
          <div className="dashboard-section">
            <h2 className="dashboard-section-title">Bài tập cần làm</h2>
            <div className="dashboard-list">
              {assignments.length > 0 ? (
                assignments.map((assignment) => (
                  <AssignmentCard key={assignment.id} assignment={assignment} />
                ))
              ) : (
                <p>Không có bài tập nào cần hoàn thành.</p>
              )}
            </div>
          </div>
        </>
      )}
    </StudentLayout>
  );
};

export default StudentDashboardPage;