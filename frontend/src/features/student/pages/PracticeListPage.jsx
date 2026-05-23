import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiBook, FiPlus } from 'react-icons/fi';
import StudentLayout from '../../../components/student/StudentLayout';

const PracticeListPage = () => {
  const navigate = useNavigate();
  const [subjects] = useState([
    { id: 1, name: 'Toan', icon: FiBook, questions: 150 },
    { id: 2, name: 'Tieng Viet', icon: FiBook, questions: 120 },
    { id: 3, name: 'Tieng Anh', icon: FiBook, questions: 100 },
    { id: 4, name: 'Khoa hoc', icon: FiBook, questions: 80 },
  ]);

  return (
    <StudentLayout pageTitle="Luyen tap" pageSubtitle="Chon mon hoc de bat dau luyen tap">
      {/* Random Practice */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-6 mb-8 text-white">
        <h2 className="text-xl font-semibold mb-2">Luyen tap ngau nhien</h2>
        <p className="text-purple-100 mb-4">Bat dau voi 10 cau hoi ngau nhien</p>
        <button
          onClick={() => navigate('/student/practice/random')}
          className="px-6 py-2 bg-white text-purple-600 rounded-lg font-medium hover:bg-purple-50 flex items-center gap-2"
        >
          <FiPlus /> Bat dau luyen tap
        </button>
      </div>

      {/* Subjects */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Mon hoc</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {subjects.map((subject) => {
            const Icon = subject.icon;
            return (
              <button
                key={subject.id}
                onClick={() => navigate('/student/practice/subjects')}
                className="p-4 border border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors text-left"
              >
                <Icon className="text-purple-600 mb-2" size={24} />
                <h3 className="font-medium text-gray-800">{subject.name}</h3>
                <p className="text-sm text-gray-500">{subject.questions} cau hoi</p>
              </button>
            );
          })}
        </div>
      </div>
    </StudentLayout>
  );
};

export default PracticeListPage;
