import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiFileText } from 'react-icons/fi';
import AdminLayout from '../../../components/admin/AdminLayout';
import questionApi from '../../../api/questionApi';

const AdminQuestionListPage = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await questionApi.getSystemQuestions();
      if (response.success) {
        setQuestions(response.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Ban co chan muon xoa cau hoi nay?')) return;

    try {
      await questionApi.deleteQuestion(id);
      setQuestions(questions.filter(q => q.id !== id));
    } catch (error) {
      console.error('Failed to delete question:', error);
      alert('Xoa that bai');
    }
  };

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.content?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || question.type === filterType;
    return matchesSearch && matchesType;
  });

  const getTypeBadge = (type) => {
    const badges = {
      mcq: 'bg-blue-100 text-blue-700',
      fill_blank: 'bg-green-100 text-green-700',
      matching: 'bg-purple-100 text-purple-700',
      table_fill: 'bg-orange-100 text-orange-700',
    };
    return badges[type] || 'bg-gray-100 text-gray-700';
  };

  return (
    <AdminLayout pageTitle="Quan ly cau hoi">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tim kiem cau hoi..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-64 focus:ring-2 focus:ring-green-500"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          >
            <option value="all">Tat ca loai</option>
            <option value="mcq">Lua chon</option>
            <option value="fill_blank">Dien vao cho trong</option>
            <option value="matching">Noi dong</option>
            <option value="table_fill">Dien bang</option>
          </select>
        </div>
        <button
          onClick={() => window.location.href = '/admin/questions/create'}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
        >
          <FiPlus /> Tao cau hoi
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Dang tai...</div>
      ) : filteredQuestions.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <FiFileText className="mx-auto text-4xl text-gray-300 mb-4" />
          <p className="text-gray-500">Chua co cau hoi nao</p>
          <button
            onClick={() => window.location.href = '/admin/questions/create'}
            className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Tao cau hoi dau tien
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Noi dung</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Loai</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Do kho</th>
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">Hanh dong</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredQuestions.map((question) => (
                <tr key={question.id}>
                  <td className="px-6 py-4 text-sm text-gray-800 max-w-md truncate">
                    {question.content}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeBadge(question.type)}`}>
                      {question.type === 'mcq' ? 'Lua chon' :
                       question.type === 'fill_blank' ? 'Dien vao' :
                       question.type === 'matching' ? 'Noi dong' :
                       question.type === 'table_fill' ? 'Dien bang' : question.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {question.difficulty || '-'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => navigate(`/admin/questions/${question.id}/edit`)}
                      className="p-2 text-blue-500 hover:text-blue-700 mr-2"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => handleDelete(question.id)}
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

export default AdminQuestionListPage;
