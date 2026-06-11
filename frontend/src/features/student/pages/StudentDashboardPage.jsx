import React, { useEffect, useState } from 'react';
import StudentLayout from '../../../components/student/StudentLayout';
import StudentStats from '../../../components/student/StudentStats';
import ClassCard from '../../../components/student/ClassCard';
import AssignmentCard from '../../../components/student/AssignmentCard';
import { classService } from '../../../services/classService';
import { testService } from '../../../services/testService';
import JoinClassModal from '../../../components/student/JoinClassModal';

const StudentDashboardPage = () => {
  const [classes, setClasses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [stats, setStats] = useState({ classes: 0, tests: 0, completed: 0, averageGrade: null, recent: null });
  const [loading, setLoading] = useState(true);
  const [showJoinModal, setShowJoinModal] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [classesData, testsData, attemptsData] = await Promise.all([
        classService.getAll(),
        testService.getAvailable(),
        testService.getMyAttempts()
      ]);

      const classesList = classesData.data || [];
      const availableTests = testsData.data || [];
      const attempts = attemptsData.data || [];

      setClasses(classesList);
      setAssignments(availableTests);

      const classesCount = classesList.length;
      const testsCount = availableTests.length;

      const submittedAttempts = attempts.filter(a => a.score !== null && a.score !== undefined);
      const avgPercent = submittedAttempts.length > 0
        ? submittedAttempts.reduce((s, a) => s + (Number(a.score) || 0), 0) / submittedAttempts.length
        : null;
      const completedCount = attempts.filter(a => a.status === 'submitted').length;

      const recentAttempt = attempts.length > 0
        ? attempts.slice().sort((a, b) => new Date(b.submitted_at || b.started_at) - new Date(a.submitted_at || a.started_at))[0]
        : null;

      setStats({
        classes: classesCount,
        tests: testsCount,
        completed: completedCount,
        averageGrade: avgPercent,
        recent: recentAttempt,
      });
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinModalJoined = () => {
    fetchDashboardData();
  };

  return (
    <StudentLayout pageTitle="Màn hình chính">
      {loading ? (
        <div style={{ padding: '20px', textAlign: 'center' }}>Đang tải dữ liệu...</div>
      ) : (
        <>
          <StudentStats stats={stats} />
          <div className="dashboard-section">
            <div className="dashboard-section-header">
              <h2 className="dashboard-section-title">Các lớp học của tôi</h2>
              <button type="button" className="join-class-trigger" onClick={() => setShowJoinModal(true)}>
                Tham gia lớp học
              </button>
            </div>
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

      <JoinClassModal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        onJoined={handleJoinModalJoined}
      />
    </StudentLayout>
  );
};

export default StudentDashboardPage;
