import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBook, FiBookOpen } from 'react-icons/fi';
import StudentLayout from '../../../components/student/StudentLayout';
import { practiceApi } from '../../../api/practiceApi';

const PracticeListPage = () => {
  const [practices, setPractices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPractices();
  }, []);

  const fetchPractices = async () => {
    try {
      setLoading(true);
      const response = await practiceApi.getStudentPractices();
      if (response.success) {
        setPractices(response.data || []);
      } else {
        setError(response.message || 'Không thể tải danh sách bài ôn tập.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Lỗi khi tải danh sách bài ôn tập.');
    } finally {
      setLoading(false);
    }
  };

  const groupedByClass = practices.reduce((acc, practice) => {
    const cls = practice.class_name || 'Khác';
    if (!acc[cls]) acc[cls] = [];
    acc[cls].push(practice);
    return acc;
  }, {});

  return (
    <StudentLayout pageTitle="Bài tập ôn tập" pageSubtitle="Chon bai on tap theo lop hoc cua ban">
      <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Danh sách bài ôn tập</h1>
      </div>
      {/* Practice List */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Dang tai...</div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">{error}</div>
      ) : practices.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-12 text-center">
          <FiBookOpen className="mx-auto text-gray-300 mb-4" size={48} />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Chua co bai on tap</h3>
          <p className="text-gray-500 text-sm">
            Cac bai on tap se xuat hien o day khi giao vien gan cho lop hoc cua ban.
          </p>
        </div>
      ) : (
        Object.entries(groupedByClass).map(([className, classPractices]) => (
          <div key={className} className="bg-white rounded-xl shadow p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FiBook className="text-purple-600" />
              {className}
            </h2>
            <div className="space-y-3">
              {classPractices.map((practice) => (
                <div
                  key={practice.id}
                  className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 hover:border-purple-200 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-800 truncate">{practice.title}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {practice.subject?.name || 'Không rõ môn'} · {practice.questions_count || 0} câu
                    </p>
                  </div>
                  <button
                    onClick={() => navigate(`/student/practices/${practice.id}`)}
                    className="ml-4 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 whitespace-nowrap flex items-center gap-1.5"
                  >
                    <FiBook /> Lam bai
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </StudentLayout>
  );
};

export default PracticeListPage;
