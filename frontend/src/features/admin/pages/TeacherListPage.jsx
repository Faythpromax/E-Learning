import { useState, useEffect } from 'react';
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiMail } from 'react-icons/fi';
import AdminLayout from '../../../components/admin/AdminLayout';
import userApi from '../../../api/userApi';

const TeacherListPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const response = await userApi.getTeachers();
      if (response.success) {
        setTeachers(response.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch teachers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Ban co chan muon xoa giao vien nay?')) return;

    try {
      await userApi.deleteUser(id);
      setTeachers(teachers.filter(t => t.id !== id));
    } catch (error) {
      console.error('Failed to delete teacher:', error);
      alert('Xoa that bai');
    }
  };

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout pageTitle="Quan ly giao vien">
      <div className="flex items-center justify-between mb-6">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tim kiem giao vien..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-64 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <FiPlus /> Them giao vien
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Dang tai...</div>
      ) : filteredTeachers.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">Chua co giao vien nao</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Ho va ten</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Email</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Ngay tao</th>
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">Hanh dong</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTeachers.map((teacher) => (
                <tr key={teacher.id}>
                  <td className="px-6 py-4 text-sm text-gray-800">{teacher.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <span className="flex items-center gap-2">
                      <FiMail size={14} /> {teacher.email}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {teacher.created_at ? new Date(teacher.created_at).toLocaleDateString('vi-VN') : '-'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-blue-500 hover:text-blue-700 mr-2">
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => handleDelete(teacher.id)}
                      className="p-2 text-red-500 hover:text-red-700"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
};

export default TeacherListPage;
