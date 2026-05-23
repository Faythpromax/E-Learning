import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiEdit, FiTrash2, FiFileText, FiCopy, FiBarChart2 } from 'react-icons/fi';
import { testApi } from '../../../api/testApi';

export function TeacherTestListPage() {
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const response = await testApi.getTests();
      setTests(response.data || []);
    } catch (error) {
      console.error('Failed to fetch tests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (testId) => {
    navigate(`/teacher/tests/${testId}/edit`);
  };

  const handleViewResults = (testId) => {
    navigate(`/teacher/tests/${testId}/results`);
  };

  const handleDelete = async (testId) => {
    if (!confirm('Ban co chac chan muon xoa bai kiem tra nay?')) {
      return;
    }

    try {
      setDeletingId(testId);
      await testApi.deleteTest(testId);
      setTests(prev => prev.filter(t => t.id !== testId));
    } catch (error) {
      console.error('Failed to delete test:', error);
      alert('Xoa that bai. Vui long thu lai.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    alert('Da copy ma truy cap!');
  };

  const formatDuration = (minutes) => {
    if (!minutes) return 'Khong gioi han';
    if (minutes >= 60) return `${Math.floor(minutes / 60)}h ${minutes % 60}p`;
    return `${minutes} phut`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Dang tai...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Quan ly bai kiem tra</h1>
        <button
          onClick={() => navigate('/teacher/tests/create')}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
        >
          <FiPlus />
          Tao bai kiem tra moi
        </button>
      </div>

      {tests.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <FiFileText className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Chua co bai kiem tra
          </h3>
          <p className="text-gray-500 mb-4">
            Ban chua tao bai kiem tra nao. Tao bai kiem tra dau tien de bat dau!
          </p>
          <button
            onClick={() => navigate('/teacher/tests/create')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            Tao bai kiem tra moi
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tieu de
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mon hoc
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cau hoi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thoi gian
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trang thai
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tac
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tests.map((test) => (
                <tr key={test.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{test.title}</div>
                    <div className="text-sm text-gray-500">
                      Ma: <code className="bg-gray-100 px-1 rounded">{test.test_code}</code>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {test.subject?.name || '-'}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {test.questions?.length || 0}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {formatDuration(test.duration)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${
                      test.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {test.is_active ? 'Dang hoat dong' : 'Khong hoat dong'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleViewResults(test.id)}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Xem ket qua"
                      >
                        <FiBarChart2 />
                      </button>
                      <button
                        onClick={() => handleCopyCode(test.test_code)}
                        className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Copy ma truy cap"
                      >
                        <FiCopy />
                      </button>
                      <button
                        onClick={() => handleEdit(test.id)}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Chinh sua"
                      >
                        <FiEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(test.id)}
                        disabled={deletingId === test.id}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Xoa"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default TeacherTestListPage;
