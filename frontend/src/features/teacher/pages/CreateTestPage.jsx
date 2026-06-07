import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  FiPlus, FiTrash2, FiSearch, FiArrowLeft, FiSave, 
  FiClock, FiCalendar, FiBookOpen, FiCheckSquare, FiSquare, FiPlusCircle 
} from 'react-icons/fi';
import TeacherLayout from '../../../components/teacher/TeacherLayout';
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

  // Trả về cấu trúc màu sang xịn mịn cho từng Badge loại câu hỏi
  const getQuestionTypeBadge = (type) => {
    switch (type?.toLowerCase()) {
      case 'mcq':
        return { label: 'Trắc nghiệm', class: 'bg-blue-50 text-blue-700 border-blue-100' };
      case 'fill_blank':
        return { label: 'Điền từ', class: 'bg-emerald-50 text-emerald-700 border-emerald-100' };
      case 'matching':
        return { label: 'Nối đáp án', class: 'bg-purple-50 text-purple-700 border-purple-100' };
      default:
        return { label: 'Tự luận', class: 'bg-slate-50 text-slate-700 border-slate-100' };
    }
  };

  if (loading) {
    return (
      <TeacherLayout pageTitle="Đang tải...">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-slate-500 font-medium text-sm">Đang nạp cơ sở dữ liệu phòng thi...</p>
        </div>
      </TeacherLayout>
    );
  }

  return (
    <TeacherLayout pageTitle={isEditing ? "Chỉnh sửa bài kiểm tra" : "Tạo bài kiểm tra mới"}>
      <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto pb-12">
        
        {/* Header Action Bar */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              {isEditing ? 'Chỉnh sửa bài kiểm tra' : 'Tạo bài kiểm tra mới'}
            </h1>
            <p className="text-sm text-slate-400 mt-1">Thiết lập cấu hình phòng thi và cấu trúc điểm số bài kiểm tra.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/teacher/tests')}
              className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2"
            >
              <FiArrowLeft /> Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={saving || formData.question_ids.length === 0}
              className="px-5 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-all flex items-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiSave /> {saving ? 'Đang lưu...' : (isEditing ? 'Cập nhật đề' : 'Lưu đề thi')}
            </button>
          </div>
        </div>

        {/* Khối Thông tin cơ bản */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-5">
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2 border-b border-slate-50 pb-2">
            <span className="w-1 h-4 bg-blue-600 rounded-full"></span> Cấu hình thông tin cơ bản
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Tiêu đề bài kiểm tra *</label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleInputChange}
                placeholder="VD: Kiểm tra giữa kỳ - Toán lớp 2"
                className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Môn học *</label>
                <select
                  name="subject_id"
                  required
                  value={formData.subject_id}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="">Chọn môn học</option>
                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>{subject.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Lớp áp dụng</label>
                <select
                  name="class_id"
                  value={formData.class_id}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="">Chọn lớp học (tùy chọn)</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>{cls.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Hình thức truy cập</label>
                <select
                  name="access_type"
                  value={formData.access_type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="both">Mã truy cập & Lớp học</option>
                  <option value="public_code">Chỉ mã truy cập</option>
                  <option value="class_only">Chỉ lớp học</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Thời gian làm bài (phút)</label>
                <div className="relative">
                  <input
                    type="number"
                    name="duration"
                    min="1"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="VD: 30"
                    className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  />
                  <FiClock className="absolute right-3 top-3.5 text-slate-400" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Số lần thi tối đa</label>
                <input
                  type="number"
                  name="max_attempts"
                  min="1"
                  value={formData.max_attempts}
                  onChange={handleInputChange}
                  placeholder="VD: 3"
                  className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Ngày hết hạn</label>
                <div className="relative">
                  <input
                    type="date"
                    name="expires_at"
                    value={formData.expires_at}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Checkbox kích hoạt */}
            <div className="pt-2">
              <label className="inline-flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 transition-transform"
                />
                <span className="text-sm font-medium text-slate-700">Kích hoạt bài kiểm tra hiển thị trên hệ thống</span>
              </label>
            </div>
          </div>
        </div>

        {/* Khối Lựa chọn câu hỏi từ ngân hàng đề */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-50 pb-3">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <span className="w-1 h-4 bg-indigo-600 rounded-full"></span> 
              Danh sách câu hỏi ngân hàng
              <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full ml-1">
                Đã chọn {formData.question_ids.length} câu
              </span>
            </h2>
            
            {/* Bộ lọc tìm kiếm nhanh câu hỏi */}
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                placeholder="Tìm kiếm nội dung câu hỏi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500 transition-colors"
              />
              <FiSearch className="absolute left-3 top-2.5 text-slate-400 text-sm" />
            </div>
          </div>

          {/* Vùng cuộn danh sách câu hỏi */}
          <div className="max-h-[380px] overflow-y-auto pr-1 space-y-2.5 scrollbar-thin">
            {filteredQuestions.length > 0 ? (
              filteredQuestions.map((question) => {
                const isSelected = formData.question_ids.includes(question.id);
                const badge = getQuestionTypeBadge(question.type);
                
                return (
                  <div
                    key={question.id}
                    onClick={() => handleToggleQuestion(question.id)}
                    className={`p-4 rounded-xl border transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 select-none cursor-pointer ${
                      isSelected 
                        ? 'bg-indigo-50/40 border-indigo-200 shadow-sm' 
                        : 'bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50/30'
                    }`}
                  >
                    {/* Phần nội dung cốt lõi */}
                    <div className="flex items-start gap-4 min-w-0 flex-1">
                      <div className="text-xl mt-0.5 flex-shrink-0">
                        {isSelected ? (
                          <FiCheckSquare className="text-indigo-600 animate-fade-in" />
                        ) : (
                          <FiSquare className="text-slate-300" />
                        )}
                      </div>

                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${badge.class}`}>
                            {badge.label}
                          </span>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-600">
                            {question.subject?.name || 'Môn học'}
                          </span>
                        </div>
                        <p className="text-slate-700 font-medium text-sm leading-relaxed truncate md:whitespace-normal">
                          {question.content}
                        </p>
                      </div>
                    </div>

                    {/* Ô nhập điểm số nằm riêng biệt góc phải khi câu hỏi được kích hoạt */}
                    {isSelected && (
                      <div 
                        className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-indigo-100 shadow-inner self-end md:self-center flex-shrink-0"
                        onClick={(e) => e.stopPropagation()} // Chặn cơ chế toggle nhầm card khi click chọn input
                      >
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Điểm số:</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="0.5"
                          value={formData.question_scores[question.id] || 1}
                          onChange={(e) => handleScoreChange(question.id, e.target.value)}
                          className="w-16 text-center text-sm font-bold text-slate-800 bg-slate-50 rounded border border-slate-200 focus:outline-none focus:border-indigo-500 py-0.5"
                        />
                      </div>
                    )}

                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                <FiBookOpen className="text-3xl text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-400">Không tìm thấy câu hỏi phù hợp với tiêu chí lọc</p>
              </div>
            )}
          </div>
        </div>

      </form>
    </TeacherLayout>
  );
}

export default CreateTestPage;