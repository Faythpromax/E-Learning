import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiPlus, FiTrash2 } from 'react-icons/fi';
import TeacherLayout from '../../../components/teacher/TeacherLayout';
import questionApi from '../../../api/questionApi';
import subjectApi from '../../../api/subjectApi';

const CreateQuestionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  // ĐÃ CẬP NHẬT ĐẦY ĐỦ ĐÚNG TỪNG TRƯỜNG CỦA BẠN TRONG FORM DATA
  const [formData, setFormData] = useState({
    subject_id: '',
    type: 'mcq',
    content: '',
    explanation: '', // Thêm trường giải thích đáp án
    difficulty: 'medium',
    options: ['', '', '', ''],
    correct_answer: 'a',
    matching_pairs: [{ left: '', right: '' }],
    table_data: { 
      headers: ['Tiêu đề 1', 'Tiêu đề 2'], 
      rows: [['', '']] 
    },
  });
  
  const [subjects, setSubjects] = useState([
    { id: '1', name: 'Tiếng Anh 5A3' },
    { id: '2', name: 'Tiếng Anh 4A2' }
  ]); // Mock danh sách môn học đồng bộ với Sidebar của bạn
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Nếu bạn có API lấy danh sách môn học thực tế từ DB, chạy ở đây:
    fetchSubjects();
    
    if (isEditing) {
      fetchQuestion();
    }
  }, [id]);

  const fetchSubjects = async () => {
    try {
      const resp = await subjectApi.getSubjects();
      if (resp && resp.success) {
        setSubjects(resp.data);
      }
    } catch (err) {
      // keep fallback mock subjects
      console.error('Không lấy được danh sách môn học:', err);
    }
  };

  const fetchQuestion = async () => {
    try {
      setLoading(true);
      const response = await questionApi.getQuestion(id);
      
      if (response && response.success) {
        const qData = response.data; 
        
        setFormData({
          subject_id: qData.subject_id?.toString() || '',
          type: qData.type || 'mcq',
          content: qData.content || '',
          explanation: qData.explanation || '', // Đọc dữ liệu giải thích từ Backend
          difficulty: qData.difficulty || 'medium',
          options: qData.data?.options?.map((opt) => opt.text) || ['', '', '', ''],
          correct_answer: qData.data?.correct_answer ?? qData.data?.correct_answers?.[0] ?? 'a',
          matching_pairs: qData.data?.matching_pairs || [{ left: '', right: '' }],
          table_data: qData.data?.table_data || { headers: ['Tiêu đề 1', 'Tiêu đề 2'], rows: [['', '']] },
        });
      }
    } catch (err) {
      setError('Không thể tải thông tin câu hỏi này từ hệ thống.');
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

  // --- Logic động cho câu hỏi Nối dòng (Matching) ---
  const handleMatchingChange = (index, field, value) => {
    const newPairs = [...formData.matching_pairs];
    newPairs[index][field] = value;
    setFormData({ ...formData, matching_pairs: newPairs });
  };

  const addMatchingPair = () => {
    setFormData({
      ...formData,
      matching_pairs: [...formData.matching_pairs, { left: '', right: '' }]
    });
  };

  const removeMatchingPair = (index) => {
    const newPairs = formData.matching_pairs.filter((_, i) => i !== index);
    setFormData({ ...formData, matching_pairs: newPairs });
  };

  // --- Logic động cho câu hỏi Điền bảng (Table Fill) ---
  const handleHeaderChange = (index, value) => {
    const newHeaders = [...formData.table_data.headers];
    newHeaders[index] = value;
    setFormData({
      ...formData,
      table_data: { ...formData.table_data, headers: newHeaders }
    });
  };

  const handleCellChange = (rowIndex, colIndex, value) => {
    const newRows = [...formData.table_data.rows];
    newRows[rowIndex][colIndex] = value;
    setFormData({
      ...formData,
      table_data: { ...formData.table_data, rows: newRows }
    });
  };

  const addTableColumn = () => {
    const newHeaders = [...formData.table_data.headers, `Tiêu đề ${formData.table_data.headers.length + 1}`];
    const newRows = formData.table_data.rows.map(row => [...row, '']);
    setFormData({
      ...formData,
      table_data: { headers: newHeaders, rows: newRows }
    });
  };

  const addTableRow = () => {
    const emptyRow = Array(formData.table_data.headers.length).fill('');
    setFormData({
      ...formData,
      table_data: { ...formData.table_data, rows: [...formData.table_data.rows, emptyRow] }
    });
  };

  const removeTableRow = (rowIndex) => {
    const newRows = formData.table_data.rows.filter((_, i) => i !== rowIndex);
    setFormData({
      ...formData,
      table_data: { ...formData.table_data, rows: newRows }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // 1. Kiểm tra nhanh các trường bắt buộc ở Frontend
    if (!formData.subject_id) {
      setError('Vui lòng lựa chọn Môn học / Lớp học cho câu hỏi này.');
      return;
    }

    if (!formData.content.trim()) {
      setError('Vui lòng nhập nội dung đề bài câu hỏi.');
      return;
    }

    if (formData.type === 'mcq' && formData.options.some(o => !o.trim())) {
      setError('Vui lòng nhập đầy đủ nội dung cho cả 4 đáp án lựa chọn.');
      return;
    }

    setLoading(true);

    try {
      // 2. Tự động đóng gói object 'data' tương ứng với từng loại câu hỏi
      let questionDataStructure = {};
      
      if (formData.type === 'mcq') {
        questionDataStructure = {
          options: formData.options.map((option, index) => ({
            id: String.fromCharCode(97 + index),
            text: option,
          })),
          correct_answer: formData.correct_answer || 'a'
        };
      } else if (formData.type === 'fill_blank') {
        questionDataStructure = {
          correct_answers: [formData.correct_answer || ''],
        };
      } else if (formData.type === 'matching') {
        questionDataStructure = {
          matching_pairs: formData.matching_pairs,
        };
      } else if (formData.type === 'table_fill') {
        questionDataStructure = {
          table_data: formData.table_data,
        };
      }

      // 3. Gom tất cả thành Payload hoàn chỉnh chuẩn Laravel yêu cầu
      const payload = {
        subject_id: Number(formData.subject_id),
        type: formData.type,
        content: formData.content,
        explanation: formData.explanation,
        difficulty: formData.difficulty || 'medium',
        data: questionDataStructure // Nhét cục dữ liệu đặc thù vào đây
      };

      // 4. Gọi API gửi đi (Xử lý linh hoạt giữa Thêm mới và Cập nhật)
      if (isEditing) {
        await questionApi.updateQuestion(id, payload);
        alert('Cập nhật thay đổi câu hỏi thành công!');
      } else {
        await questionApi.createQuestion(payload);
        alert('Tạo câu hỏi học tập mới thành công!');
      }
      
      navigate('/teacher/questions');
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra trong quá trình kết nối và lưu dữ liệu.');
    } finally {
      setLoading(false);
    }
  };

  // --- RENDER GIAO DIỆN CÁC LOẠI CÂU HỎI ---

  const renderMcqFields = () => (
    <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
      <label className="block text-sm font-semibold text-gray-700">Các lựa chọn đáp án</label>
      {formData.options.map((option, index) => {
        const optionId = String.fromCharCode(97 + index);
        return (
          <div key={index} className="flex items-center gap-3">
            <input
              type="radio"
              name="correct_choice"
              checked={formData.correct_answer === optionId}
              onChange={() => setFormData({ ...formData, correct_answer: optionId })}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
            />
            <input
              type="text"
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              placeholder={`Nội dung lựa chọn ${index + 1}`}
              className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        );
      })}
      <p className="text-xs text-gray-500 italic">* Tích chọn nút tròn bên trái để xác định đáp án đúng.</p>
    </div>
  );

  const renderFillBlankFields = () => (
    <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Đáp án đúng cho từ khóa cần điền</label>
        <input
          type="text"
          value={formData.correct_answer || ''}
          onChange={(e) => setFormData({ ...formData, correct_answer: e.target.value })}
          placeholder="Nhập cụm từ đáp án chính xác..."
          className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
                />
      </div>
    </div>
  );

  const renderMatchingFields = () => (
    <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-semibold text-gray-700">Thiết lập các cặp ghép nối đúng</label>
        <button
          type="button"
          onClick={addMatchingPair}
          className="flex items-center gap-1 text-xs bg-blue-600 text-white px-2.5 py-1.5 rounded-md hover:bg-blue-700"
        >
          <FiPlus /> Thêm cặp nối
        </button>
      </div>
      {formData.matching_pairs.map((pair, index) => (
        <div key={index} className="flex items-center gap-2 bg-white p-2 rounded-lg border border-gray-200">
          <input
            type="text"
            value={pair.left}
            onChange={(e) => handleMatchingChange(index, 'left', e.target.value)}
            placeholder={`Vế trái ${index + 1}`}
            className="flex-1 px-3 py-1.5 border rounded-md text-sm focus:ring-2 focus:ring-blue-500"
            required
          />
          <span className="text-gray-400 font-bold">⇄</span>
          <input
            type="text"
            value={pair.right}
            onChange={(e) => handleMatchingChange(index, 'right', e.target.value)}
            placeholder={`Vế phải ${index + 1}`}
            className="flex-1 px-3 py-1.5 border rounded-md text-sm focus:ring-2 focus:ring-blue-500"
            required
          />
          {formData.matching_pairs.length > 1 && (
            <button
              type="button"
              onClick={() => removeMatchingPair(index)}
              className="text-red-500 hover:text-red-700 p-1"
            >
              <FiTrash2 />
            </button>
          )}
        </div>
      ))}
    </div>
  );

  const renderTableFillFields = () => (
    <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-200 overflow-x-auto">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-semibold text-gray-700">Dữ liệu bảng và Ô đáp án</label>
        <div className="flex gap-2">
          <button type="button" onClick={addTableColumn} className="text-xs bg-gray-200 text-gray-700 px-2 py-1.5 rounded hover:bg-gray-300">+ Thêm Cột</button>
          <button type="button" onClick={addTableRow} className="text-xs bg-blue-600 text-white px-2 py-1.5 rounded hover:bg-blue-700">+ Thêm Hàng</button>
        </div>
      </div>
      <table className="w-full border-collapse bg-white border border-gray-300 rounded-lg text-sm">
        <thead>
          <tr className="bg-gray-100">
            {formData.table_data.headers.map((header, i) => (
              <th key={i} className="border p-2">
                <input
                  type="text"
                  value={header}
                  onChange={(e) => handleHeaderChange(i, e.target.value)}
                  className="w-full text-center bg-transparent font-bold focus:outline-none focus:bg-white"
                />
              </th>
            ))}
            <th className="border w-10"></th>
          </tr>
        </thead>
        <tbody>
          {formData.table_data.rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, colIndex) => (
                <td key={colIndex} className="border p-1.5">
                  <input
                    type="text"
                    value={cell}
                    onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                    placeholder="Điền từ..."
                    className="w-full border-0 focus:ring-2 focus:ring-blue-500 p-1"
                  />
                </td>
              ))}
              <td className="border text-center">
                {formData.table_data.rows.length > 1 && (
                  <button type="button" onClick={() => removeTableRow(rowIndex)} className="text-red-500 hover:text-red-700"><FiTrash2 className="mx-auto" /></button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <TeacherLayout pageTitle={isEditing ? 'Chỉnh sửa câu hỏi' : 'Tạo câu hỏi mới'}>
      <div className="max-w-3xl mx-auto px-4 py-2">
        <button
          onClick={() => navigate('/teacher/questions')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium mb-6 transition-colors"
        >
          <FiArrowLeft /> Quay lại danh sách
        </button>

        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">
            {isEditing ? '📝 Chỉnh sửa câu hỏi' : '✨ Tạo câu hỏi học tập mới'}
          </h2>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* HÀNG 1: LỰA CHỌN MÔN HỌC (MỚI BỔ SUNG) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Môn học / Lớp phụ trách</label>
              <select
                value={formData.subject_id}
                onChange={(e) => handleChange('subject_id', e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">-- Chọn môn học ứng với câu hỏi --</option>
                {subjects.map(sub => (
                  <option key={sub.id} value={sub.id}>{sub.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Loại hình câu hỏi</label>
                <select
                  value={formData.type}
                  onChange={(e) => handleChange('type', e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="mcq">Trắc nghiệm nhiều lựa chọn</option>
                  <option value="fill_blank">Điền từ vào chỗ trống</option>
                  <option value="matching">Ghép nối vế (Nối dòng)</option>
                  <option value="table_fill">Điền thông tin vào ô bảng</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Độ khó câu hỏi</label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => handleChange('difficulty', e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="easy">Dễ (Nhận biết)</option>
                  <option value="medium">Trung bình (Thông hiểu)</option>
                  <option value="hard">Khó (Vận dụng nâng cao)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nội dung đề bài câu hỏi</label>
              <textarea
                value={formData.content}
                onChange={(e) => handleChange('content', e.target.value)}
                placeholder="Nhập câu hỏi hoặc yêu cầu đề bài tại đây..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                required
              />
            </div>

            {/* Render động các form đáp án đặc thù */}
            {formData.type === 'mcq' && renderMcqFields()}
            {formData.type === 'fill_blank' && renderFillBlankFields()}
            {formData.type === 'matching' && renderMatchingFields()}
            {formData.type === 'table_fill' && renderTableFillFields()}

            {/* Ô NHẬP LỜI GIẢI THÍCH (MỚI BỔ SUNG) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Lời giải thích chi tiết (Không bắt buộc)</label>
              <textarea
                value={formData.explanation}
                onChange={(e) => handleChange('explanation', e.target.value)}
                placeholder="Nhập lời giải hoặc ghi chú đáp án giúp học sinh hiểu bài sau khi thi xong..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              />
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={() => navigate('/teacher/questions')}
                className="px-5 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 text-gray-700 font-medium transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 font-medium shadow-md shadow-blue-500/10 transition-all"
              >
                {loading ? 'Đang xử lý...' : (isEditing ? 'Cập nhật thay đổi' : 'Lưu câu hỏi')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </TeacherLayout>
  );
};

export default CreateQuestionPage;