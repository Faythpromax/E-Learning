import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import StudentLayout from '../../../components/student/StudentLayout';
import ClassTabs from '../../../components/student/ClassTabs';
import AnnouncementCard from '../../../components/student/AnnouncementCard';
import ExerciseCard from '../../../components/student/ExerciseCard';
import TestCard from '../../../components/student/TestCard';
import StudentListItem from '../../../components/student/StudentListItem';
import {
  announcement,
  exercises,
  tests,
  students,
  classes,
} from '../../../data/classDetailMockData';

const tabOptions = [
  { id: 'overview', label: 'Về môn học' },
  { id: 'exercises', label: 'Bài tập ôn tập' },
  { id: 'tests', label: 'Bài kiểm tra' },
  { id: 'students', label: 'Danh sách lớp' },
];

const StudentClassDetailPage = () => {
  const { classId: classIdParam, id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const classId = Number(classIdParam || id);
  const classInfo = classes.find((item) => item.id === classId);
  const className = classInfo?.name || `Lớp học #${classIdParam || id || ''}`;

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
            <AnnouncementCard announcement={announcement} />
          )}

          {activeTab === 'exercises' && (
            <div className="class-detail-grid">
              {exercises.map((exercise) => (
                <ExerciseCard key={exercise.id} exercise={exercise} />
              ))}
            </div>
          )}

          {activeTab === 'tests' && (
            <div className="class-detail-grid">
              {tests.map((testItem) => (
                <TestCard key={testItem.id} testItem={testItem} />
              ))}
            </div>
          )}

          {activeTab === 'students' && (
            <div className="class-detail-table-wrap">
              <table className="student-table">
                <thead>
                  <tr>
                    <th>Họ và tên</th>
                    <th>Email</th>
                    <th>Ngày sinh</th>
                    <th>Trường</th>
                    <th>Lớp</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <StudentListItem key={student.id} student={student} />
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
