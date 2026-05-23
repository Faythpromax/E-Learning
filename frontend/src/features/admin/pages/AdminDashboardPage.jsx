import { useState, useEffect } from 'react';
import { FiUsers, FiBook, FiClipboard, FiTrendingUp, FiArrowRight } from 'react-icons/fi';
import AdminLayout from '../../../components/admin/AdminLayout';
import userApi from '../../../api/userApi';
import classApi from '../../../api/classApi';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    teachers: 0,
    students: 0,
    classes: 0,
    tests: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      // Simulate fetching stats - replace with actual API calls when backend is ready
      setStats({
        teachers: 0,
        students: 0,
        classes: 0,
        tests: 0,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Giao vien', value: stats.teachers, icon: FiUsers, color: 'blue' },
    { label: 'Hoc sinh', value: stats.students, icon: FiBook, color: 'green' },
    { label: 'Lop hoc', value: stats.classes, icon: FiClipboard, color: 'purple' },
    { label: 'Bai kiem tra', value: stats.tests, icon: FiTrendingUp, color: 'orange' },
  ];

  const quickActions = [
    { label: 'Quan ly giao vien', path: '/admin/teachers', icon: FiUsers },
    { label: 'Quan ly hoc sinh', path: '/admin/students', icon: FiBook },
    { label: 'Xem phan hoi', path: '/admin/feedback', icon: FiClipboard },
  ];

  return (
    <AdminLayout pageTitle="Dashboard" pageSubtitle="Tong quan he thong">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          const colorClasses = {
            blue: 'bg-blue-50 text-blue-600',
            green: 'bg-green-50 text-green-600',
            purple: 'bg-purple-50 text-purple-600',
            orange: 'bg-orange-50 text-orange-600',
          };
          return (
            <div key={index} className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">
                    {loading ? '...' : stat.value}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[stat.color]}`}>
                  <Icon size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Han dong nhanh</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <a
                key={index}
                href={action.path}
                className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <Icon className="text-gray-400" size={24} />
                <span className="font-medium text-gray-700">{action.label}</span>
                <FiArrowRight className="ml-auto text-gray-400" />
              </a>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
