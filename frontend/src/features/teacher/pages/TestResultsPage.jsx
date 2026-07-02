import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiUser, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import TeacherLayout from '../../../components/teacher/TeacherLayout';
import { testApi } from '../../../api/testApi';

const TestResultsPage = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [testInfo, setTestInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, [testId]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const [resultsRes, testRes] = await Promise.all([
        testApi.getAllTestAttempts(testId),
        testApi.getTestDetails(testId)
      ]);
      setResults(resultsRes.data || []);
      setTestInfo(testRes.data);
    } catch (error) {
      console.error('Failed to fetch results:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <TeacherLayout pageTitle="Kết quả bài kiểm tra">
      <div className="max-w-6xl mx-auto p-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/teacher/tests')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiArrowLeft className="text-xl text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {testInfo ? `Kết quả: ${testInfo.title}` : 'Kết quả bài kiểm tra'}
            </h1>
            <p className="text-sm text-gray-500">
              {testInfo?.subject?.name} • {results.length} lượt làm bài
            </p>
          </div>
        </div>

        {/* Stats Summary */}
        {results.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
              <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Điểm trung bình</p>
              <h3 className="text-3xl font-extrabold text-blue-600 mt-1">
                {(results.reduce((acc, r) => acc + (r.score || 0), 0) / results.length).toFixed(1)}%
              </h3>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
              <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Điểm cao nhất</p>
              <h3 className="text-3xl font-extrabold text-green-600 mt-1">
                {Math.max(...results.map(r => r.score || 0)).toFixed(1)}%
              </h3>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
              <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Tỷ lệ đạt (&ge; 50%)</p>
              <h3 className="text-3xl font-extrabold text-indigo-600 mt-1">
                {((results.filter(r => r.score >= 50).length / results.length) * 100).toFixed(0)}%
              </h3>
            </div>
          </div>
        )}

        {/* Results Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Học sinh
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Thời gian nộp
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Lần thi
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Điểm số
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-400 text-sm">
                    Đang tải kết quả...
                  </td>
                </tr>
              ) : results.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-400 text-sm">
                    Chưa có học sinh nào làm bài kiểm tra này.
                  </td>
                </tr>
              ) : (
                results.map((result) => (
                  <tr key={result.id} className="hover:bg-gray-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-sm">
                          <FiUser />
                        </div>
                        <div>
                          <div className="font-bold text-gray-800 text-sm">{result.user?.name}</div>
                          <div className="text-xs text-gray-400 mt-0.5">{result.user?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <FiClock className="text-gray-400" />
                        {result.submitted_at ? new Date(result.submitted_at).toLocaleString('vi-VN') : 'Chưa nộp'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                      Lần {result.attempt_no}
                    </td>
                    <td className="px-6 py-4">
                      <div className={`text-base font-bold ${getScoreColor(result.score)}`}>
                        {result.score?.toFixed(1) || 0}%
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        result.status === 'submitted' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-amber-50 text-amber-700 border border-amber-100'
                      }`}>
                        {result.status === 'submitted' ? (
                          <>
                            <FiCheckCircle /> Đã nộp
                          </>
                        ) : (
                          <>
                            <FiClock /> Đang làm
                          </>
                        )}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </TeacherLayout>
  );
};

export default TestResultsPage;
