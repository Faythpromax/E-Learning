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
    <TeacherLayout pageTitle="Ket qua bai kiem tra">
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
              {testInfo ? `Ket qua: ${testInfo.title}` : 'Ket qua bai kiem tra'}
            </h1>
            <p className="text-sm text-gray-500">
              {testInfo?.subject?.name} • {results.length} luot lam bai
            </p>
          </div>
        </div>

        {/* Stats Summary */}
        {results.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <p className="text-sm text-gray-500 mb-1">Diem trung binh</p>
              <h3 className="text-3xl font-bold text-blue-600">
                {(results.reduce((acc, r) => acc + (r.score || 0), 0) / results.length).toFixed(1)}%
              </h3>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <p className="text-sm text-gray-500 mb-1">Diem cao nhat</p>
              <h3 className="text-3xl font-bold text-green-600">
                {Math.max(...results.map(r => r.score || 0)).toFixed(1)}%
              </h3>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <p className="text-sm text-gray-500 mb-1">Ti le dat (`{'>'}` 50%)</p>
              <h3 className="text-3xl font-bold text-indigo-600">
                {((results.filter(r => r.score >= 50).length / results.length) * 100).toFixed(0)}%
              </h3>
            </div>
          </div>
        )}

        {/* Results Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Hoc sinh
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Thoi gian nop
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Lan thi
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Diem so
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Trang thai
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    Dang tai ket qua...
                  </td>
                </tr>
              ) : results.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    Chua co hoc sinh nao lam bai kiem tra nay.
                  </td>
                </tr>
              ) : (
                results.map((result) => (
                  <tr key={result.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                          <FiUser />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{result.user?.name}</div>
                          <div className="text-xs text-gray-500">{result.user?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <FiClock className="text-gray-400" />
                        {result.submitted_at ? new Date(result.submitted_at).toLocaleString('vi-VN') : 'Chua nop'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      Lan {result.attempt_no}
                    </td>
                    <td className="px-6 py-4">
                      <div className={`text-lg font-bold ${getScoreColor(result.score)}`}>
                        {result.score?.toFixed(1) || 0}%
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        result.status === 'submitted' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {result.status === 'submitted' ? (
                          <>
                            <FiCheckCircle /> Da nop
                          </>
                        ) : (
                          <>
                            <FiClock /> Dang lam
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
