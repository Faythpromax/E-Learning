import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiUsers, FiFileText } from 'react-icons/fi';
import TeacherLayout from '../../../components/teacher/TeacherLayout';
import classApi from '../../../api/classApi';

const TeacherDashboardPage = () => {
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
        setClasses(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClass = () => {
    navigate('/teacher/classes/create');
  };

  const handleViewClass = (classId) => {
    navigate(`/teacher/classes/${classId}`);
  };

  const handleViewAllClasses = () => {
    navigate('/teacher/classes');
  };

  const recentClasses = classes.slice(0, 4);

  return (
    <TeacherLayout pageTitle="Man hinh chinh">
      <div className="dashboard-section">
        <div className="dashboard-section-header">
          <h2 className="dashboard-section-title">Cac lop hoc gan day</h2>
          <button 
            className="create-class-btn" 
            onClick={handleCreateClass}
          >
            <FiPlus className="btn-icon" />
            Tao lop hoc
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Dang tai...</p>
          </div>
        ) : recentClasses.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-lg shadow">
            <FiUsers className="mx-auto text-4xl text-gray-300 mb-4" />
            <p className="text-gray-500 mb-4">Ban chua co lop hoc nao</p>
            <button
              onClick={handleCreateClass}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Tao lop hoc dau tien
            </button>
          </div>
        ) : (
          <>
            <div className="dashboard-grid">
              {recentClasses.map((classItem) => (
                <div 
                  key={classItem.id} 
                  className="class-card"
                  onClick={() => handleViewClass(classItem.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <div 
                    className="class-card-header"
                    style={{ backgroundColor: getRandomColor(classItem.id) }}
                  >
                    <div className="class-card-info">
                      <h3 className="class-card-title">{classItem.name}</h3>
                      <p className="class-card-teacher">
                        {classItem.users?.length || 0} thanh vien
                      </p>
                    </div>
                    <div className="class-card-avatar">
                      {classItem.name?.charAt(0) || 'L'}
                    </div>
                  </div>

                  <div className="class-card-footer">
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <FiUsers /> {classItem.users?.length || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiFileText /> {classItem.materials?.length || 0}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {classes.length > 4 && (
              <div className="mt-4 text-center">
                <button
                  onClick={handleViewAllClasses}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Xem tat ca ({classes.length} lop)
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <div className="dashboard-section">
        <h2 className="dashboard-section-title">Han dong nhanh</h2>
        <div className="dashboard-grid">
          <button
            onClick={handleCreateClass}
            className="bg-white rounded-lg shadow p-6 text-left hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FiPlus className="text-blue-600 text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Tao lop moi</h3>
                <p className="text-sm text-gray-500">Bat dau mot lop hoc moi</p>
              </div>
            </div>
          </button>

          <button
            onClick={handleViewAllClasses}
            className="bg-white rounded-lg shadow p-6 text-left hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FiUsers className="text-green-600 text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Quan ly lop hoc</h3>
                <p className="text-sm text-gray-500">Xem tat ca cac lop</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate('/teacher/questions')}
            className="bg-white rounded-lg shadow p-6 text-left hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FiFileText className="text-purple-600 text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Quan ly cau hoi</h3>
                <p className="text-sm text-gray-500">Tao va chinh sua cau hoi</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate('/teacher/tests')}
            className="bg-white rounded-lg shadow p-6 text-left hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <FiFileText className="text-orange-600 text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Quan ly bai kiem tra</h3>
                <p className="text-sm text-gray-500">Tao va xem ket qua</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </TeacherLayout>
  );
};

const getRandomColor = (id) => {
  const colors = [
    '#4ec28a', '#c04ac0', '#4a90c0', '#c0a04a', '#c04a4a', '#4ac0c0'
  ];
  return colors[id % colors.length];
};

export default TeacherDashboardPage;
