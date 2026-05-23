import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiSearch, FiUsers, FiFileText, FiEdit2, FiTrash2, FiCopy } from 'react-icons/fi';
import TeacherLayout from '../../../components/teacher/TeacherLayout';
import classApi from '../../../api/classApi';

const ClassListPage = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [joinLoading, setJoinLoading] = useState(false);

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

  const handleEditClass = (classId) => {
    navigate(`/teacher/classes/${classId}/edit`);
  };

  const handleViewClass = (classId) => {
    navigate(`/teacher/classes/${classId}`);
  };

  const handleDeleteClick = (classItem) => {
    setSelectedClass(classItem);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedClass) return;

    try {
      await classApi.deleteClass(selectedClass.id);
      setClasses(classes.filter(c => c.id !== selectedClass.id));
      setShowDeleteModal(false);
      setSelectedClass(null);
    } catch (error) {
      console.error('Failed to delete class:', error);
      alert('Xoa that bai. Vui long thu lai.');
    }
  };

  const handleCopyCode = (classCode) => {
    navigator.clipboard.writeText(classCode);
    alert('Da copy ma lop!');
  };

  const handleJoinClass = async () => {
    if (!joinCode.trim()) return;

    setJoinLoading(true);
    try {
      const response = await classApi.joinClass(joinCode.trim());
      if (response.success) {
        alert('Tham gia lop thanh cong!');
        setShowJoinModal(false);
        setJoinCode('');
        fetchClasses();
      } else {
        alert(response.message || 'Tham gia that bai.');
      }
    } catch (error) {
      console.error('Failed to join class:', error);
      alert('Tham gia that bai. Vui long thu lai.');
    } finally {
      setJoinLoading(false);
    }
  };

  const filteredClasses = classes.filter(classItem =>
    classItem.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    classItem.class_code?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleBadge = (classItem, userId) => {
    if (classItem.created_by === userId) {
      return <span className="badge badge-primary">Chu lop</span>;
    }
    return <span className="badge badge-secondary">Giao vien</span>;
  };

  if (loading) {
    return (
      <TeacherLayout pageTitle="Quan ly lop hoc">
        <div className="flex items-center justify-center py-20">
          <div className="text-gray-500">Dang tai...</div>
        </div>
      </TeacherLayout>
    );
  }

  return (
    <TeacherLayout pageTitle="Quan ly lop hoc">
      <div className="class-list-container">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tim kiem lop hoc..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-64 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowJoinModal(true)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <FiPlus />
              Tham gia lop
            </button>
            <button
              onClick={handleCreateClass}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <FiPlus />
              Tao lop moi
            </button>
          </div>
        </div>

        {/* Class List */}
        {filteredClasses.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow">
            <FiUsers className="mx-auto text-4xl text-gray-300 mb-4" />
            <p className="text-gray-500 mb-4">
              {searchQuery ? 'Khong tim thay lop nao.' : 'Ban chua co lop hoc nao.'}
            </p>
            {!searchQuery && (
              <button
                onClick={handleCreateClass}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Tao lop hoc dau tien
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredClasses.map((classItem) => (
              <div key={classItem.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-800">{classItem.name}</h3>
                      <p className="text-sm text-gray-500">
                        Ma lop: <span className="font-mono">{classItem.class_code}</span>
                        <button
                          onClick={() => handleCopyCode(classItem.class_code)}
                          className="ml-2 text-blue-500 hover:text-blue-700"
                          title="Copy ma lop"
                        >
                          <FiCopy size={14} />
                        </button>
                      </p>
                    </div>
                    <div className="dropdown">
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <FiTrash2 className="text-gray-400" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <span className="flex items-center gap-1">
                      <FiUsers /> {classItem.users?.length || 0} thanh vien
                    </span>
                    <span className="flex items-center gap-1">
                      <FiFileText /> {classItem.materials?.length || 0} tai lieu
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleViewClass(classItem.id)}
                      className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm"
                    >
                      Xem chi tiet
                    </button>
                    <button
                      onClick={() => handleEditClass(classItem.id)}
                      className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(classItem)}
                      className="px-3 py-2 border border-red-200 text-red-500 rounded-lg hover:bg-red-50"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96">
              <h3 className="text-lg font-semibold mb-4">Xac nhan xoa lop</h3>
              <p className="text-gray-600 mb-6">
                Ban co chac chan muon xoa lop "{selectedClass?.name}"? Hanh dong nay khong the hoan tac.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Huy
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Xoa
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Join Modal */}
        {showJoinModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96">
              <h3 className="text-lg font-semibold mb-4">Tham gia lop hoc</h3>
              <p className="text-gray-600 mb-4">
                Nhap ma lop de tham gia.
              </p>
              <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder="VD: ABC123"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase"
                maxLength={20}
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowJoinModal(false);
                    setJoinCode('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Huy
                </button>
                <button
                  onClick={handleJoinClass}
                  disabled={!joinCode.trim() || joinLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {joinLoading ? 'Dang xu ly...' : 'Tham gia'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .badge {
          display: inline-block;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-size: 0.75rem;
          font-weight: 500;
        }
        .badge-primary {
          background-color: #dbeafe;
          color: #1d4ed8;
        }
        .badge-secondary {
          background-color: #f3f4f6;
          color: #6b7280;
        }
      `}</style>
    </TeacherLayout>
  );
};

export default ClassListPage;
