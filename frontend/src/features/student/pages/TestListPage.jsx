import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiClock, FiFileText, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { testApi } from '../../../api/testApi';

export function TestListPage() {
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('available');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [testsRes, attemptsRes] = await Promise.all([
        testApi.getAvailableTests(),
        testApi.getMyAttempts(),
      ]);
      setTests(testsRes.data || []);
      setAttempts(attemptsRes.data || []);
    } catch (error) {
      console.error('Failed to fetch tests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartTest = (testId) => {
    navigate(`/student/tests/${testId}`);
  };

  const handleViewResults = (attemptId) => {
    navigate(`/student/tests/${attemptId}/results`);
  };

  const formatDuration = (minutes) => {
    if (!minutes) return 'Khong gioi han';
    if (minutes >= 60) return `${Math.floor(minutes / 60)}h ${minutes % 60}p`;
    return `${minutes} phut`;
  };

  const getStatusBadge = (test) => {
    if (!test.expires_at) return null;
    const expires = new Date(test.expires_at);
    const now = new Date();
    const daysLeft = Math.ceil((expires - now) / (1000 * 60 * 60 * 24));
    
    if (daysLeft < 0) {
      return <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">Het han</span>;
    }
    if (daysLeft <= 3) {
      return <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded">Con {daysLeft} ngay</span>;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Dang tai...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Bai kiem tra</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b">
        <button
          onClick={() => setActiveTab('available')}
          className={`pb-3 px-4 font-semibold transition-colors ${
            activeTab === 'available'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Bai kiem tra ({tests.length})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`pb-3 px-4 font-semibold transition-colors ${
            activeTab === 'history'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Lich su ({attempts.length})
        </button>
      </div>

      {/* Available Tests */}
      {activeTab === 'available' && (
        <div className="space-y-4">
          {tests.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <FiFileText className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Chua co bai kiem tra
              </h3>
              <p className="text-gray-500">
                Hien tai chua co bai kiem tra nao duoc gan cho ban.
              </p>
            </div>
          ) : (
            tests.map((test) => (
              <div key={test.id} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-800">{test.title}</h3>
                      {getStatusBadge(test)}
                    </div>
                    <p className="text-gray-600 mb-3">{test.subject?.name || 'Khong ro mon'}</p>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <FiFileText />
                        {test.questions?.length || test.test_questions?.length || 0} cau hoi
                      </span>
                      <span className="flex items-center gap-1">
                        <FiClock />
                        {formatDuration(test.duration)}
                      </span>
                    </div>

                    {/* Test code info */}
                    {(test.access_type === 'public_code' || test.access_type === 'both') && (
                      <div className="mt-3 text-sm">
                        <span className="text-gray-500">Ma truy cap: </span>
                        <code className="bg-gray-100 px-2 py-1 rounded font-mono text-blue-600">
                          {test.test_code}
                        </code>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleStartTest(test.id)}
                    className="ml-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    Bat dau
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Attempt History */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          {attempts.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <FiFileText className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Chua co lich su
              </h3>
              <p className="text-gray-500">
                Ban chua lam bai kiem tra nao.
              </p>
            </div>
          ) : (
            attempts.map((attempt) => (
              <div key={attempt.attempt_id} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">{attempt.test_title}</h3>
                    <p className="text-gray-500 text-sm mb-3">
                      {attempt.subject || 'Khong ro mon'} - Lan thi thu {attempt.attempt_no}
                    </p>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <FiClock />
                        {new Date(attempt.started_at).toLocaleDateString('vi-VN')}
                      </span>
                      <span className={`flex items-center gap-1 ${
                        attempt.status === 'submitted' ? 'text-green-600' :
                        attempt.status === 'in_progress' ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {attempt.status === 'submitted' && <FiCheckCircle />}
                        {attempt.status === 'in_progress' && <FiClock />}
                        {attempt.status === 'expired' && <FiAlertCircle />}
                        {attempt.status === 'submitted' ? 'Da nop' :
                         attempt.status === 'in_progress' ? 'Dang lam' : 'Het han'}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    {attempt.status === 'submitted' && (
                      <div className="mb-2">
                        <div className={`text-2xl font-bold ${
                          attempt.score >= 80 ? 'text-green-600' :
                          attempt.score >= 60 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {attempt.score?.toFixed(1) || 0}%
                        </div>
                        <div className="text-sm text-gray-500">
                          {attempt.correct_count || 0}/{attempt.total_questions || 0} dung
                        </div>
                      </div>
                    )}
                    
                    {attempt.status === 'submitted' && (
                      <button
                        onClick={() => handleViewResults(attempt.attempt_id)}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
                      >
                        Xem ket qua
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default TestListPage;
