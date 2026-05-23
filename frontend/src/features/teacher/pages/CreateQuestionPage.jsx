import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiPlus, FiTrash2 } from 'react-icons/fi';
import TeacherLayout from '../../../components/teacher/TeacherLayout';
import questionApi from '../../../api/questionApi';

const CreateQuestionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    type: 'mcq',
    content: '',
    difficulty: 'medium',
    options: ['', '', '', ''],
    correct_answer: 0,
    options_matching: [],
    matching_pairs: [],
    table_data: { headers: [], rows: [] },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditing) {
      fetchQuestion();
    }
  }, [id]);

  const fetchQuestion = async () => {
    try {
      setLoading(true);
      const response = await questionApi.getQuestion(id);
      if (response.success) {
        setFormData({ ...formData, ...response.data });
      }
    } catch (err) {
      setError('Khong the tai cau hoi');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isEditing) {
        await questionApi.updateQuestion(id, formData);
      } else {
        await questionApi.createQuestion(formData);
      }
      alert(isEditing ? 'Cap nhat thanh cong!' : 'Tao cau hoi thanh cong!');
      navigate('/teacher/questions');
    } catch (err) {
      setError(err.response?.data?.message || 'Luu that bai');
    } finally {
      setLoading(false);
    }
  };

  const renderMcqFields = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Cac lua chon</label>
        {formData.options.map((option, index) => (
          <div key={index} className="flex items-center gap-2 mb-2">
            <input
              type="radio"
              name="correct"
              checked={formData.correct_answer === index}
              onChange={() => setFormData({ ...formData, correct_answer: index })}
              className="w-4 h-4 text-green-600"
            />
            <input
              type="text"
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              placeholder={`Lua chon ${index + 1}`}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>
        ))}
        <p className="text-xs text-gray-500 mt-1">Chon radio de danh dau dap an dung</p>
      </div>
    </div>
  );

  const renderFillBlankFields = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Dap an dung</label>
        <input
          type="text"
          value={formData.correct_answer || ''}
          onChange={(e) => setFormData({ ...formData, correct_answer: e.target.value })}
          placeholder="Nhap dap an dung"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
        />
      </div>
    </div>
  );

  return (
    <TeacherLayout pageTitle={isEditing ? 'Chinh sua cau hoi' : 'Tao cau hoi moi'}>
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate('/teacher/questions')}
          className="flex items-center gap-2 text-green-600 hover:text-green-800 mb-6"
        >
          <FiArrowLeft /> Quay lai
        </button>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            {isEditing ? 'Chinh sua cau hoi' : 'Tao cau hoi moi'}
          </h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Loai cau hoi</label>
              <select
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="mcq">Lua chon</option>
                <option value="fill_blank">Dien vao cho trong</option>
                <option value="matching">Noi dong</option>
                <option value="table_fill">Dien bang</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Noi dung cau hoi</label>
              <textarea
                value={formData.content}
                onChange={(e) => handleChange('content', e.target.value)}
                placeholder="Nhap noi dung cau hoi"
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Do kho</label>
              <select
                value={formData.difficulty}
                onChange={(e) => handleChange('difficulty', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="easy">De</option>
                <option value="medium">Trung binh</option>
                <option value="hard">Kho</option>
              </select>
            </div>

            {formData.type === 'mcq' && renderMcqFields()}
            {formData.type === 'fill_blank' && renderFillBlankFields()}
            {(formData.type === 'matching' || formData.type === 'table_fill') && (
              <div className="text-gray-500 text-sm">
                Tinh nang dang duoc phat trien...
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={() => navigate('/teacher/questions')}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Huy
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Dang luu...' : (isEditing ? 'Cap nhat' : 'Tao cau hoi')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </TeacherLayout>
  );
};

export default CreateQuestionPage;
