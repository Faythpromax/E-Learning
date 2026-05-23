import { useState, useEffect } from 'react';
import TeacherLayout from '../../../components/teacher/TeacherLayout';

const TestResultsPage = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching results
    setLoading(false);
  }, []);

  return (
    <TeacherLayout pageTitle="Ket qua bai kiem tra">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Danh sach ket qua</h2>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Dang tai...</div>
        ) : results.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Chua co ket qua nao</p>
          </div>
        ) : (
          <div className="space-y-4">
            {results.map((result) => (
              <div key={result.id} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-800">{result.test_title}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Diem trung binh: {result.average_score || '-'}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </TeacherLayout>
  );
};

export default TestResultsPage;
