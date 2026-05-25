import React from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import StatCard from '../../../components/admin/StatCard';
import { FiUsers } from 'react-icons/fi';

const AdminDashboardPage = () => {
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
            value="25" 
            icon={<FiUsers />} 
            bgColor="#e0e7ff" 
            color="#4f46e5" 
          />
          <StatCard 
            title="Tổng số học sinh" 
            value="320" 
            icon={<FiUsers />} 
            bgColor="#dcfce7" 
            color="#16a34a" 
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;