import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBook, FiUsers, FiClipboard, FiTrendingUp } from 'react-icons/fi';
import StudentLayout from '../../../components/student/StudentLayout';
import classApi from '../../../api/classApi';

const StudentDashboardPage = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await classApi.getClasses();
      if (response.success) {
        setClasses(response.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { label: 'Luyen tap', path: '/student/practice', icon: FiBook, color: 'purple' },
    { label: 'Bai kiem tra', path: '/student/tests', icon: FiClipboard, color: 'blue' },
    { label: 'Diem so', path: '/student/grades', icon: FiTrendingUp, color: 'green' },
  ];

  return (
    <StudentLayout pageTitle="Dashboard" pageSubtitle="Chao mung tro lai!">
      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          const colorClasses = {
            purple: 'bg-purple-50 text-purple-600 hover:bg-purple-100',
            blue: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
            green: 'bg-green-50 text-green-600 hover:bg-green-100',
          };
          return (
            <button
              key={index}
              onClick={() => navigate(action.path)}
              className={`p-6 rounded-xl transition-colors ${colorClasses[action.color]}`}
            >
              <Icon size={32} className="mb-2" />
              <span className="font-medium">{action.label}</span>
            </button>
          );
        })}
      </div>

      {/* My Classes */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Lop hoc cua toi</h2>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-500">Dang tai...</div>
        ) : classes.length === 0 ? (
          <div className="text-center py-8">
            <FiUsers className="mx-auto text-4xl text-gray-300 mb-4" />
            <p className="text-gray-500 mb-4">Ban chua tham gia lop hoc nao</p>
            <button
              onClick={() => navigate('/teacher/classes')}
              className="text-blue-600 hover:underline"
            >
              Tham gia ngay
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classes.slice(0, 6).map((classItem) => (
              <div
                key={classItem.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-purple-500 cursor-pointer transition-colors"
                onClick={() => navigate(`/student/classes/${classItem.id}`)}
              >
                <h3 className="font-medium text-gray-800">{classItem.name}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {classItem.users?.length || 0} thanh vien
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </StudentLayout>
  );
};

export default StudentDashboardPage;
