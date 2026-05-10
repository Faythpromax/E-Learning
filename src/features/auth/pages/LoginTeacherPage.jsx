import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../auth.css';

function LoginTeacherPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ contact: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    alert(`Đăng nhập giáo viên: ${formData.contact}`);
  };

  return (
    <div className="auth-page auth-page--centered">
      <div className="auth-bg" />

      <div className="auth-container">
        <div className="auth-card">
          <button
            id="btn-change-role-teacher"
            className="auth-back-link"
            onClick={() => navigate('/login')}
          >
            ← Thay đổi vai trò
          </button>

          <h1 className="auth-title" style={{ marginTop: '0.75rem' }}>
            Giáo viên đăng nhập
          </h1>
          <p className="auth-subtitle">Chào mừng trở lại! Nhập thông tin tài khoản của bạn.</p>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field">
              <div className="auth-input-wrap">
                <input
                  id="teacher-contact"
                  type="text"
                  name="contact"
                  className="auth-input"
                  placeholder="Nhập email hoặc số điện thoại"
                  value={formData.contact}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <div className="auth-input-wrap">
                <input
                  id="teacher-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className="auth-input"
                  placeholder="Nhập mật khẩu"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="auth-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Hiện/ẩn mật khẩu"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div className="auth-label-row">
              <a href="#" className="auth-forgot">Quên mật khẩu?</a>
            </div>

            <button id="btn-login-teacher" type="submit" className="auth-btn auth-btn-primary">
              Đăng nhập
            </button>
          </form>

          <p className="auth-footer-text">
            Bạn chưa có tài khoản?{' '}
            <a href="#" className="auth-link">Đăng ký ngay</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginTeacherPage;