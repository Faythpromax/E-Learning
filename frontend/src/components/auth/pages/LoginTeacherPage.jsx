import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../../services/authService";
import "../../../features/auth/auth.css";

/**
 * Component LoginTeacherPage - Xử lý đăng nhập cho Giáo viên
 */
function LoginTeacherPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
  const data = await authService.login(
    email,
    password,
    "teacher"
  );

  if (data.user && data.user.role === "teacher") {
    navigate("/teacher/dashboard");
  } else {
    await authService.logout();

    setError(
      "Tài khoản không hợp lệ. Vui lòng đăng nhập bằng tài khoản giáo viên."
    );
  }
} catch (err) {
      if (err.response) {
        if (err.response.status === 422) {
          const validationErrors = err.response.data.errors;
          const firstErrorKey = Object.keys(validationErrors)[0];
          setError(validationErrors[firstErrorKey][0]);
        } else if (err.response.status === 401) {
          setError(err.response.data.message || "Email hoặc mật khẩu không chính xác.");
        } else {
          setError("Đăng nhập thất bại. Vui lòng thử lại sau.");
        }
      } else {
        setError("Lỗi kết nối server.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page auth-page--centered">
      <div className="auth-bg" />

      <div className="auth-container">
        <div className="auth-card">
          <button
            id="btn-change-role-teacher"
            className="auth-back-link"
            onClick={() => navigate("/login")}
          >
            ← Thay đổi vai trò
          </button>

          <h1 className="auth-title" style={{ marginTop: "0.75rem" }}>
            Giáo viên đăng nhập
          </h1>
          <p className="auth-subtitle">
            Hệ thống quản lý giảng dạy và đề thi.
          </p>

          {error && (
            <div className="auth-alert auth-alert-error" style={{ color: 'red', marginBottom: '1rem', textAlign: 'center', backgroundColor: '#ffebee', padding: '10px', borderRadius: '4px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field">
              <div className="auth-input-wrap">
                <input
                  id="teacher-email"
                  type="email"
                  className="auth-input"
                  placeholder="Nhập email giáo viên"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <div className="auth-input-wrap">
                <input
                  id="teacher-password"
                  type={showPassword ? "text" : "password"}
                  className="auth-input"
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="auth-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div className="auth-label-row">
              <a href="#" className="auth-forgot"> Quên mật khẩu? </a>
            </div>

            <button
              id="btn-login-teacher"
              type="submit"
              className="auth-btn auth-btn-primary"
              disabled={loading}
            >
              {loading ? "Đang xác thực..." : "Đăng nhập Giáo viên"}
            </button>
          </form>

          <p className="auth-footer-text">
            Bạn chưa có tài khoản?{" "}
            <a href="#" className="auth-link" onClick={(e) => { e.preventDefault(); navigate('/register/teacher'); }}>
              Đăng ký ngay
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginTeacherPage;
