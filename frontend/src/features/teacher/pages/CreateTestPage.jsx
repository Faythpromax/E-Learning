import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiPlus, FiTrash2, FiSearch } from 'react-icons/fi';
import { testApi } from '../../../api/testApi';
import { questionApi } from '../../../api/questionApi';
import subjectApi from '../../../api/subjectApi';
import classApi from '../../../api/classApi';

export function CreateTestPage() {
  const navigate = useNavigate();
  const { testId } = useParams();
  const isEditing = !!testId;

  const [formData, setFormData] = useState({
    title: '',
    subject_id: '',
    class_id: '',
    access_type: 'both',
    is_active: true,
    expires_at: '',
    max_attempts: '',
    duration: '',
    question_ids: [],
    question_scores: {},
  });

  const [questions, setQuestions] = useState([]);
  const [availableQuestions, setAvailableQuestions] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, [testId]);

  const fetchData = async () => {
    try {
const [questionsRes, subjectsRes, classesRes] = await Promise.all([
      questionApi.getQuestions({ per_page: 1000 }),
      subjectApi.getSubjects(),
      classApi.getClasses(),
    ]);

    setAvailableQuestions(questionsRes.data || questionsRes || []);
    setSubjects(subjectsRes.data || subjectsRes || []);
    const classesData = classesRes?.data || classesRes;
    setClasses(Array.isArray(classesData) ? classesData : []);

      if (isEditing) {
        const testRes = await testApi.getTestDetails(testId);
        const test = testRes.data;
        
        setFormData({
          title: test.title || '',
          subject_id: test.subject_id?.toString() || '',
          class_id: test.class_id?.toString() || '',
          access_type: test.access_type || 'both',
          is_active: test.is_active ?? true,
          expires_at: test.expires_at ? test.expires_at.split('T')[0] : '',
          max_attempts: test.max_attempts || '',
          duration: test.duration || '',
          question_ids: test.questions?.map(q => q.id) || [],
          question_scores: {},
        });

        const scores = {};
        test.questions?.forEach(q => {
          scores[q.id] = q.pivot?.score || 1;
        });
        setFormData(prev => ({ ...prev, question_scores: scores }));
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleToggleQuestion = (questionId) => {
    setFormData(prev => {
      const newIds = prev.question_ids.includes(questionId)
        ? prev.question_ids.filter(id => id !== questionId)
        : [...prev.question_ids, questionId];
      
      return { ...prev, question_ids: newIds };
    });
  };

  const handleScoreChange = (questionId, score) => {
    setFormData(prev => ({
      ...prev,
      question_scores: {
        ...prev.question_scores,
        [questionId]: parseFloat(score) || 1,
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.question_ids.length === 0) {
      alert('Vui lòng chọn ít nhất một câu hỏi.');
      return;
    }

    try {
      setSaving(true);
      const submitData = {
        ...formData,
        subject_id: formData.subject_id ? parseInt(formData.subject_id, 10) : null,
        class_id: formData.class_id ? parseInt(formData.class_id, 10) : null,
        max_attempts: formData.max_attempts ? parseInt(formData.max_attempts, 10) : null,
        duration: formData.duration ? parseInt(formData.duration, 10) : null,
      };

      if (isEditing) {
        await testApi.updateTest(testId, submitData);
      } else {
        await testApi.createTest(submitData);
      }

      navigate('/teacher/tests');
    } catch (error) {
      console.error('Failed to save test:', error);
      alert('Lưu thất bại. Vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  };

  const filteredQuestions = availableQuestions.filter(q => {
    const subjectMatches = !formData.subject_id || q.subject?.id?.toString() === formData.subject_id.toString();
    const searchMatches = q.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.type?.toLowerCase().includes(searchQuery.toLowerCase());
    return subjectMatches && searchMatches;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Dang tai...</div>
      </div>
    );
  }

  return (
  <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 py-10 px-4">
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-8">
        {isEditing ? 'Chỉnh sửa bài kiểm tra' : 'Tạo bài kiểm tra mới'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h2 className="text-lg font-semibold mb-4">Thông tin cơ bản</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tiêu đề bài kiểm tra *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="VD: Kiểm tra giữa kỳ - Toán lớp 2"
              />
            </div>

                  <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Môn học *
              </label>
              <select
                name="subject_id"
                value={formData.subject_id}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Chọn môn học</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lớp áp dụng
              </label>
              <select
                name="class_id"
                value={formData.class_id}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Chọn lớp học (tùy chọn)</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hình thức truy cập
              </label>
              <select
                name="access_type"
                value={formData.access_type}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="both">Mã truy cập & Lớp học</option>
                <option value="public_code">Chỉ mã truy cập</option>
                <option value="class_only">Chỉ lớp học</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thời gian làm bài (phút)
              </label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="VD: 30"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số lần thi tối đa
              </label>
              <input
                type="number"
                name="max_attempts"
                value={formData.max_attempts}
                onChange={handleInputChange}
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="VD: 3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ngày hết hạn
              </label>
              <input
                type="date"
                name="expires_at"
                value={formData.expires_at}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Kích hoạt bài kiểm tra
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Question Selection */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">
              Chọn câu hỏi ({formData.question_ids.length} đã chọn)
            </h2>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm câu hỏi..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Question List */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredQuestions.map((question) => {
              const isSelected = formData.question_ids.includes(question.id);
              return (
                <div
                  key={question.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                    isSelected
                      ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md'
                      : 'border-gray-200 hover:border-blue-300 hover:shadow-md hover:-translate-y-1'
                  }`}
                  onClick={() => handleToggleQuestion(question.id)}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleQuestion(question.id)}
                      className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs px-2 py-0.5 bg-gray-100 rounded">
                          {question.type}
                        </span>
                        <span className="text-xs text-gray-500">
                          {question.subject?.name || 'Mon'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 line-clamp-2">
                        {question.content}
                      </p>

                      {isSelected && (
                        <div className="mt-2 flex items-center gap-2">
                          <label className="text-xs text-gray-600">Diem:</label>
                          <input
                            type="number"
                            value={formData.question_scores[question.id] || 1}
                            onChange={(e) => handleScoreChange(question.id, e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            min="0"
                            max="100"
                            step="0.5"
                            className="w-20 px-2 py-1 text-sm border border-gray-300 rounded"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate('/teacher/tests')}
            className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors"
          >
            Huy
          </button>
          <button
            type="submit"
            disabled={saving || formData.question_ids.length === 0}
            className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
          >
            {saving ? 'Dang luu...' : (isEditing ? 'Cap nhat' : 'Tao bai kiem tra')}
          </button>
        </div>
      </form>
    </div>
  </div>
  );
}

export default CreateTestPage;
