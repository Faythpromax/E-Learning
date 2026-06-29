import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import StatCard from '../../../components/admin/StatCard';
import { FiUsers } from 'react-icons/fi';
import { userApi } from '../../../api/userApi';

const AdminDashboardPage = () => {
  const [teachersCount, setTeachersCount] = useState(0);
  const [studentsCount, setStudentsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const [teachersRes, studentsRes] = await Promise.all([
        userApi.getTeachers(),
        userApi.getStudents()
      ]);

      const teachersList = teachersRes.data || [];
      const studentsList = studentsRes.data || [];

      setTeachersCount(teachersList.length);
      setStudentsCount(studentsList.length);
    } catch (error) {
      console.error("Lỗi khi tải thống kê admin dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Dashboard">
      <div className="admin-section">
        <h3 className="admin-section-title">Overview</h3>
        <p className="admin-section-desc">
          Thông tin hoạt động thực tế trên hệ thống dạy học trực tuyến.
        </p>

        {loading ? (
          <div style={{ color: '#666', fontSize: '14px' }}>Đang tải số liệu thống kê...</div>
        ) : (
          <div className="admin-stat-cards">
            <StatCard 
              title="Tổng số giáo viên" 
              value={teachersCount.toString()} 
              icon={<FiUsers />} 
              bgColor="#e0e7ff" 
              color="#4f46e5" 
            />
            <StatCard 
              title="Tổng số học sinh" 
              value={studentsCount.toString()} 
              icon={<FiUsers />} 
              bgColor="#dcfce7" 
              color="#16a34a" 
            />
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;