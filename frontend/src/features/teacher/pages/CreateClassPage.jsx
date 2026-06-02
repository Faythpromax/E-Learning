import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TeacherLayout from '../../../components/teacher/TeacherLayout';
import classApi from '../../../api/classApi';

const CreateClassPage = () => {
  const navigate = useNavigate();
  const { classId } = useParams();
  const isEditing = !!classId;

  const [formData, setFormData] = useState({
    name: '',
    class_code: '',
    description: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditing) {
      fetchClass();
    }
  }, [classId]);

  const fetchClass = async () => {
    try {
      setLoading(true);
      const response = await classApi.getClassDetail(classId);
      if (response.success) {
        const classData = response.data;
        setFormData({
          name: classData.name || '',
          class_code: classData.class_code || '',
          description: classData.description || '',
        });
      }
    } catch (err) {
      setError('Khong the tai thong tin lop');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError('Vui lòng nhập tên lớp');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (isEditing) {
        await classApi.updateClass(classId, formData);
        alert('Cập nhật lớp thành công!');
      } else {
        await classApi.createClass(formData);
        alert('Tạo lớp thành công!');
      }
      navigate('/teacher/classes');
    } catch (err) {
      console.error('Failed to save class:', err);
      setError(err.response?.data?.message || 'Lưu thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return (
      <TeacherLayout pageTitle="Chỉnh sửa lớp">
        <div className="flex items-center justify-center py-20">
          <div className="text-gray-500">Đang tải...</div>
        </div>
      </TeacherLayout>
    );
  }

  return (
    <TeacherLayout pageTitle={isEditing ? 'Chỉnh sửa lớp' : 'Tạo lớp mới'}>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">
            {isEditing ? 'Chỉnh sửa thông tin lớp' : 'Tạo lớp học mới'}
          </h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên lớp <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="VD: Toán Lớp 2A"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mã lớp
              </label>
              <input
                type="text"
                name="class_code"
                value={formData.class_code}
                onChange={handleChange}
                placeholder="VD: LOP2A (để trống để tự động tạo)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase"
                maxLength={20}
              />
              <p className="text-xs text-gray-500 mt-1">
                Mã lớp được sử dụng để học sinh tham gia lớp. Để trống để tự động tạo mã ngẫu nhiên.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mô tả
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Mô tả về lớp học (tùy chọn)"
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={() => navigate('/teacher/classes')}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Đang lưu...' : (isEditing ? 'Cập nhật' : 'Tạo lớp')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </TeacherLayout>
  );
};

export default CreateClassPage;
