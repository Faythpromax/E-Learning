import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import StatCard from '../../../components/admin/StatCard';
import { FiUsers, FiHelpCircle } from 'react-icons/fi';
import { userApi } from '../../../api/userApi';
import { questionApi } from '../../../api/questionApi';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({ teachers_count: 0, students_count: 0, questions_count: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [statsRes, questionsRes] = await Promise.all([
          userApi.getStats(),
          questionApi.getSystemQuestions(),
        ]);
        if (statsRes.success) {
          setStats({ ...statsRes.data, questions_count: Array.isArray(questionsRes?.data) ? questionsRes.data.length : 0 });
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <AdminLayout title="Dashboard">
      <div className="admin-section">
        <h3 className="admin-section-title">Overview</h3>
        <p className="admin-section-desc">
          Here's what's happening with your e-learning platform today.
        </p>

        <div className="admin-stat-cards">
          <StatCard
            title="Tổng số giáo viên"
            value={loading ? '...' : stats.teachers_count}
            icon={<FiUsers />}
            bgColor="#e0e7ff"
            color="#4f46e5"
          />
          <StatCard
            title="Tổng số học sinh"
            value={loading ? '...' : stats.students_count}
            icon={<FiUsers />}
            bgColor="#dcfce7"
            color="#16a34a"
          />
          <StatCard
            title="Tổng số câu hỏi"
            value={loading ? '...' : stats.questions_count}
            icon={<FiHelpCircle />}
            bgColor="#fef3c7"
            color="#d97706"
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;