import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../../components/admin/AdminLayout';
import { userApi } from '../../../api/userApi';
import '../../../components/admin/admin.css';

const EditUserPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('student');
  const [password, setPassword] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (id) {
      fetchUserDetails();
    }
  }, [id]);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const response = await userApi.getUser(id);
      if (response.success && response.data) {
        const user = response.data;
        setName(user.name || '');
        setEmail(user.email || '');
        setPhone(user.phone || '');
        setRole(user.role || 'student');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!name.trim()) {
      setErrorMessage('Họ và tên không được để trống.');
      return;
    }
    if (!email.trim()) {
      setErrorMessage('Email không được để trống.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        name,
        email,
        phone,
        role,
      };

      if (password.trim()) {
        if (password.length < 6) {
          setErrorMessage('Mật khẩu phải chứa ít nhất 6 ký tự.');
          setSubmitting(false);
          return;
        }
        payload.password = password;
      }

      const response = await userApi.updateUser(id, payload);
      if (response.success) {
        setSuccessMessage('Cập nhật thông tin thành công!');
        setTimeout(() => {
          if (role === 'student') {
            navigate('/admin/students');
          } else {
            navigate('/admin/teachers');
          }
        }, 1500);
      } else {
        setErrorMessage(response.message || 'Cập nhật thất bại.');
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin:', error);
      if (error.response?.data?.errors) {
        // Collect Laravel validation errors
        const validationErrors = Object.values(error.response.data.errors).flat().join(' ');
        setErrorMessage(validationErrors);
      } else {
        setErrorMessage(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout title={`Sửa thông tin người dùng #${id}`}>
      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>Đang tải thông tin người dung...</div>
      ) : (
        <div className="admin-form-card">
          <div className="admin-form-header">
            Cập nhật thông tin người dùng
          </div>
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
              <input 
                type="text" 
                className="admin-form-input" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required
              />
            </div>
            
            <div className="admin-form-group">
              <label className="admin-form-label">Email:</label>
              <input 
                type="email" 
                className="admin-form-input" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Số điện thoại:</label>
              <input 
                type="text" 
                className="admin-form-input" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Mật khẩu mới:</label>
              <input 
                type="password" 
                className="admin-form-input" 
                placeholder="Để trống nếu không muốn đổi" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Quyền:</label>
              <select 
                className="admin-form-select" 
                value={role} 
                onChange={(e) => setRole(e.target.value)}
                style={{ width: '180px' }}
              >
                <option value="student">Học sinh</option>
                <option value="teacher">Giáo viên</option>
                <option value="admin">Quản trị viên</option>
              </select>
            </div>

            <div className="admin-form-actions">
              <button 
                type="button" 
                className="admin-btn-cancel" 
                onClick={() => navigate(-1)}
                disabled={submitting}
              >
                Hủy
              </button>
              <button 
                type="submit" 
                className="admin-btn-submit"
                disabled={submitting}
              >
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
