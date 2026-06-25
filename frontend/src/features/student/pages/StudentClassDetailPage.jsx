import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StudentLayout from '../../../components/student/StudentLayout';
import ClassTabs from '../../../components/student/ClassTabs';
import AnnouncementCard from '../../../components/student/AnnouncementCard';
import PracticeCard from '../../../components/student/PracticeCard';
import TestCard from '../../../components/student/TestCard';
import StudentListItem from '../../../components/student/StudentListItem';
import classApi from '../../../api/classApi';

const tabOptions = [
  { id: 'overview', label: 'Về môn học' },
  { id: 'practices', label: 'Bài tập ôn tập' },
  { id: 'tests', label: 'Bài kiểm tra' },
  { id: 'students', label: 'Danh sách lớp' },
];

const StudentClassDetailPage = () => {
  const { classId: classIdParam, id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const classId = Number(classIdParam || id);

  useEffect(() => {
    fetchClassData();
  }, [classId]);

  const fetchClassData = async () => {
    try {
      const response = await classApi.getClassDetail(classId);
      if (response.success) {
        setClassData(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch class data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartTest = async (testId) => {
    navigate(`/student/tests/${testId}`);
  };

  const handleStartPractice = async (practiceId) => {
    navigate(`/student/practices/${practiceId}`);
  }

  const className = classData?.name || `Lớp học #${classIdParam || id || ''}`;
  const testsData = classData?.tests || [];
  const practicesData = classData?.practices || [];
  const studentsData = classData?.users?.filter(u => u.pivot?.role === 'student') || [];

  if (loading) {
    return (
      <StudentLayout pageTitle={className}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-gray-500">Đang tải...</div>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout
      pageTitle={className}
      pageSubtitle="Chào mừng trở lại! Tiếp tục hành trình học tập của bạn."
    >
      <div className="class-detail-container">
        <ClassTabs
          tabs={tabOptions}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        <div className="class-detail-content">
          {activeTab === 'overview' && (
            <AnnouncementCard announcement={{ title: 'Thông báo', content: 'Chào mừng đến với lớp!' }} />
          )}

          {activeTab === 'practices' && (
            <div className="class-detail-grid">
              {practicesData.length === 0 ? (
              <div className="text-center py-8 text-gray-500 col-span-full">Chưa có bài tập nào</div>
              ) : (
                practicesData.map((practiceItem) => (
                  <div key={practiceItem.id} className="class-detail-card practice-card">
                    <h3>{practiceItem.title}</h3>
                    <p className="practice-description">
                      Thời lượng: {practiceItem.duration ? `${practiceItem.duration} phút` : 'Không giới hạn'}
                    </p>
                    <p className="class-detail-meta">
                      Số câu hỏi: {practiceItem.questions_count || 0}
                    </p>
                    <div className="class-detail-action">
                      <button 
                        type="button" 
                        className="class-detail-button"
                        onClick={() => handleStartPractice(practiceItem.id)}
                      >
                        Bắt đầu
                      </button>
                    </div>
                  </div>
                ))
               )}
            </div>
          )}

          {activeTab === 'tests' && (
            <div className="class-detail-grid">
              {testsData.length === 0 ? (
                <div className="text-center py-8 text-gray-500 col-span-full">Chưa có bài kiểm tra nào</div>
              ) : (
                testsData.map((testItem) => (
                  <div key={testItem.id} className="class-detail-card test-card">
                    <h3>{testItem.title}</h3>
                    <p className="test-description">
                      Thời lượng: {testItem.duration ? `${testItem.duration} phút` : 'Không giới hạn'}
                    </p>
                    <p className="class-detail-meta">
                      Số câu hỏi: {testItem.questions_count || 0}
                    </p>
                    <div className="class-detail-action">
                      <button 
                        type="button" 
                        className="class-detail-button"
                        onClick={() => handleStartTest(testItem.id)}
                      >
                        Bắt đầu
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'students' && (
            <div className="class-detail-table-wrap">
              <table className="student-table">
                <thead>
                  <tr>
                    <th>Họ và tên</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {studentsData.map((student) => (
                    <tr key={student.id}>
                      <td>{student.name}</td>
                      <td>{student.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </StudentLayout>
  );
};

export default StudentClassDetailPage;
