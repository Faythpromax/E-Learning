import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../../components/admin/AdminLayout';
import { userApi } from '../../../api/userApi';
import '../../../components/admin/admin.css';

const EditUserPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'student',
    password: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const response = await userApi.getUser(id);
        const user = response?.data || response;
        if (user) {
          setForm({
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            role: user.role || 'student',
            password: '',
          });
        } else {
          setErrorMessage('Không thể tìm thấy thông tin người dùng.');
        }
      } catch (error) {
        console.error('Lỗi khi tải chi tiết người dùng:', error);
        setErrorMessage('Có lỗi xảy ra khi lấy thông tin người dùng.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUserDetails();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!form.name.trim()) {
      setErrorMessage('Họ và tên không được để trống.');
      return;
    }
    if (!form.email.trim()) {
      setErrorMessage('Email không được để trống.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        role: form.role,
      };

      if (form.password.trim()) {
        if (form.password.length < 6) {
          setErrorMessage('Mật khẩu phải chứa ít nhất 6 ký tự.');
          return;
        }
        payload.password = form.password;
      }

      const response = await userApi.updateUser(id, payload);
      if (response?.success) {
        setSuccessMessage('Cập nhật thông tin thành công!');
        setTimeout(() => {
          if (form.role === 'student') {
            navigate('/admin/students');
          } else {
            navigate('/admin/teachers');
          }
        }, 1000);
      } else {
        setErrorMessage(response?.message || 'Cập nhật thất bại.');
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin:', error);
      if (error?.response?.data?.errors) {
        const validationErrors = Object.values(error.response.data.errors).flat().join(' ');
        setErrorMessage(validationErrors);
      } else {
        setErrorMessage(error?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout title={`Sửa thông tin người dùng #${id}`}>
      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>Đang tải thông tin người dùng...</div>
      ) : (
        <div className="admin-form-card">
          <div className="admin-form-header">Cập nhật thông tin người dùng</div>
          <form className="admin-form-body" onSubmit={handleSubmit}>
            {errorMessage && (
              <div className="question-error" style={{ marginBottom: '20px' }}>
                {errorMessage}
              </div>
            )}
            {successMessage && (
              <div style={{ backgroundColor: '#ecfdf5', borderLeft: '4px solid #10b981', color: '#065f46', padding: '12px 16px', borderRadius: '8px', fontSize: '14px', marginBottom: '20px' }}>
                {successMessage}
              </div>
            )}

            <div className="admin-form-group">
              <label className="admin-form-label">Họ và tên:</label>
              <input type="text" className="admin-form-input" name="name" value={form.name} onChange={handleChange} required />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Email:</label>
              <input type="email" className="admin-form-input" name="email" value={form.email} onChange={handleChange} required />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Số điện thoại:</label>
              <input type="text" className="admin-form-input" name="phone" value={form.phone} onChange={handleChange} />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Mật khẩu mới:</label>
              <input type="password" className="admin-form-input" name="password" placeholder="Để trống nếu không muốn đổi" value={form.password} onChange={handleChange} />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Quyền:</label>
              <select className="admin-form-select" name="role" value={form.role} onChange={handleChange} style={{ width: '180px' }}>
                <option value="student">Học sinh</option>
                <option value="teacher">Giáo viên</option>
                <option value="admin">Quản trị viên</option>
              </select>
            </div>

            <div className="admin-form-actions">
              <button type="button" className="admin-btn-cancel" onClick={() => navigate(-1)} disabled={submitting}>
                Hủy
              </button>
              <button type="submit" className="admin-btn-submit" disabled={submitting}>
                {submitting ? 'Đang lưu...' : 'Lưu lại'}
              </button>
            </div>
          </form>
        </div>
      )}
    </AdminLayout>
  );
};

export default EditUserPage;
