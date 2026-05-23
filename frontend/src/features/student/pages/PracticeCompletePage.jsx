import { useNavigate } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';
import StudentLayout from '../../../components/student/StudentLayout';

const PracticeCompletePage = () => {
  const navigate = useNavigate();

  return (
    <StudentLayout pageTitle="Hoan thanh luyen tap">
      <div className="max-w-xl mx-auto text-center">
        <div className="bg-white rounded-xl shadow p-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiCheckCircle className="text-green-600 text-4xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Chuc mung!</h2>
          <p className="text-gray-600 mb-8">Ban da hoan thanh buoi luyen tap</p>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => navigate('/student/practice')}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Quay lai
            </button>
            <button
              onClick={() => navigate('/student/practice/random')}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Luyen tap tiep
            </button>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
};

export default PracticeCompletePage;
