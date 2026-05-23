import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiUsers, FiFileText, FiClipboard, FiLogOut } from 'react-icons/fi';
import StudentLayout from '../../../components/student/StudentLayout';
import classApi from '../../../api/classApi';

const StudentClassDetailPage = () => {
  const { classId } = useParams();
  const navigate = useNavigate();

  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    fetchClassDetail();
  }, [classId]);

  const fetchClassDetail = async () => {
    try {
      setLoading(true);
      const response = await classApi.getClassDetail(classId);
      if (response.success) {
        setClassData(response.data);
      } else {
        alert('Khong the tai thong tin lop');
        navigate('/student/dashboard');
      }
    } catch (error) {
      console.error('Failed to fetch class detail:', error);
      alert('Khong the tai thong tin lop');
      navigate('/student/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveClass = async () => {
    if (!confirm('Ban co chac chan muon roi khoi lop nay?')) return;

    setLeaving(true);
    try {
      const response = await classApi.leaveClass(classId);
      if (response.success) {
        alert('Ban da roi khoi lop thanh cong');
        navigate('/student/dashboard');
      } else {
        alert(response.message || 'Roi khoi that bai');
      }
    } catch (error) {
      console.error('Failed to leave class:', error);
      alert('Roi khoi that bai');
    } finally {
      setLeaving(false);
    }
  };

  const tabOptions = [
    { id: 'overview', label: 'Ve lop hoc', icon: FiUsers },
    { id: 'materials', label: 'Tai lieu', icon: FiFileText },
    { id: 'tests', label: 'Bai kiem tra', icon: FiClipboard },
  ];

  if (loading) {
    return (
      <StudentLayout pageTitle="Chi tiet lop">
        <div className="flex items-center justify-center py-20">
          <div className="text-gray-500">Dang tai...</div>
        </div>
      </StudentLayout>
    );
  }

  if (!classData) {
    return (
      <StudentLayout pageTitle="Chi tiet lop">
        <div className="text-center py-20">
          <p className="text-gray-500">Khong tim thay lop</p>
          <button onClick={() => navigate('/student/dashboard')} className="mt-4 text-blue-500">
            Quay lai
          </button>
        </div>
      </StudentLayout>
    );
  }

  const students = classData.users?.filter(u => u.class_pivot?.role === 'student') || [];
  const teachers = classData.users?.filter(u => u.class_pivot?.role === 'teacher') || [];
  const materials = classData.materials || [];
  const tests = classData.tests || [];

  const renderOverviewTab = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="font-semibold text-lg text-blue-800 mb-2">Chao mung ban den voi lop!</h3>
        <p className="text-blue-600">
          Lop {classData.name} duoc tao boi giao vien. Hay cung hoc tap va lam bai kiem tra cung lop nhe.
        </p>
      </div>

      {classData.description && (
        <div className="bg-white rounded-lg shadow p-4">
          <h4 className="font-medium text-gray-800 mb-2">Mo ta lop hoc</h4>
          <p className="text-gray-600">{classData.description}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-4">
        <h4 className="font-medium text-gray-800 mb-3">Giao vien ({teachers.length})</h4>
        {teachers.length === 0 ? (
          <p className="text-gray-500">Chua co giao vien</p>
        ) : (
          <div className="space-y-2">
            {teachers.map((teacher) => (
              <div key={teacher.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                  {teacher.name?.charAt(0) || 'T'}
                </div>
                <div>
                  <p className="font-medium text-gray-800">{teacher.name}</p>
                  <p className="text-sm text-gray-500">{teacher.email}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <h4 className="font-medium text-gray-800 mb-3">Thong tin lop</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Ma lop</p>
            <p className="font-semibold font-mono">{classData.class_code}</p>
          </div>
          <div>
            <p className="text-gray-500">So hoc sinh</p>
            <p className="font-semibold">{students.length}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMaterialsTab = () => (
    <div className="space-y-4">
      {materials.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <FiFileText className="mx-auto text-4xl text-gray-300 mb-4" />
          <p className="text-gray-500">Chua co tai lieu nao</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {materials.map((material) => (
            <div key={material.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FiFileText className="text-blue-600 text-xl" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">{material.title}</h4>
                  <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded mt-1">
                    {material.type?.toUpperCase()}
                  </span>
                  {material.description && (
                    <p className="text-sm text-gray-500 mt-2">{material.description}</p>
                  )}
                  <a
                    href={material.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Xem tai lieu
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderTestsTab = () => (
    <div className="space-y-4">
      {tests.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <FiClipboard className="mx-auto text-4xl text-gray-300 mb-4" />
          <p className="text-gray-500">Chua co bai kiem tra nao</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tests.map((test) => (
            <div key={test.id} className="bg-white rounded-lg shadow p-4">
              <h4 className="font-medium text-gray-800">{test.title}</h4>
              <div className="mt-2 text-sm text-gray-500">
                {test.duration ? `${test.duration} phut` : 'Khong gioi han'}
              </div>
              <button
                onClick={() => navigate(`/student/tests/${test.id}`)}
                className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                Lam bai
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <StudentLayout pageTitle={classData.name}>
      <div className="class-detail-container">
        <button
          onClick={() => navigate('/student/dashboard')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
        >
          <FiArrowLeft /> Quay lai
        </button>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{classData.name}</h2>
              <p className="text-gray-500 text-sm mt-1">
                Ma lop: <span className="font-mono font-semibold">{classData.class_code}</span>
              </p>
            </div>
            <button
              onClick={handleLeaveClass}
              disabled={leaving}
              className="px-4 py-2 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 flex items-center gap-2"
            >
              <FiLogOut />
              {leaving ? 'Dang xu ly...' : 'Roi lop'}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="flex border-b overflow-x-auto">
            {tabOptions.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="p-6">
            {activeTab === 'overview' && renderOverviewTab()}
            {activeTab === 'materials' && renderMaterialsTab()}
            {activeTab === 'tests' && renderTestsTab()}
          </div>
        </div>
      </div>
    </StudentLayout>
  );
};

export default StudentClassDetailPage;
