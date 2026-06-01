import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../../services/authService";
import "../../../features/auth/auth.css";

/**
 * Component LoginStudentPage - Xử lý đăng nhập cho Học sinh
 */
function LoginStudentPage() {
  const navigate = useNavigate();
  
  // 1. Quản lý State cho Email và Password (Chuẩn ES6)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 2. Hàm xử lý khi người dùng nhấn Đăng nhập
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Gọi API đăng nhập từ authService
      const data = await authService.login(email, password, "student");

      // 4. Kiểm tra vai trò sau khi đăng nhập thành công
      if (data.user && data.user.role === "student") {
        // Chuyển hướng đến Dashboard học sinh
        navigate("/student/dashboard");
      } else {
        // Nếu không phải role student, logout ngay lập tức để xóa token
        await authService.logout();
        setError("Tài khoản không hợp lệ. Vui lòng đăng nhập bằng tài khoản học sinh.");
      }
    } catch (err) {
      // 3. Xử lý logic lỗi dựa trên mã lỗi HTTP từ Laravel
      if (err.response) {
        const status = err.response.status;
        
        if (status === 422) {
          // Lỗi Validation (Dữ liệu đầu vào không hợp lệ)
          const validationErrors = err.response.data.errors;
          const firstErrorKey = Object.keys(validationErrors)[0];
          setError(validationErrors[firstErrorKey][0]);
        } else if (status === 401) {
          // Lỗi Unauthorized (Sai tài khoản hoặc mật khẩu)
          setError(err.response.data.message || "Tài khoản hoặc mật khẩu không chính xác.");
        } else {
          // Các lỗi hệ thống khác
          setError("Đăng nhập thất bại. Vui lòng thử lại sau.");
        }
      } else {
        setError("Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại mạng.");
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
            id="btn-change-role-student"
            className="auth-back-link"
            onClick={() => navigate("/login")}
          >
            ← Thay đổi vai trò
          </button>

          <h1 className="auth-title" style={{ marginTop: "0.75rem" }}>
            Học sinh đăng nhập
          </h1>
          <p className="auth-subtitle">
            Chào mừng trở lại! Nhập thông tin tài khoản của bạn.
          </p>

          {/* Hiển thị thông báo lỗi trực quan cho người dùng */}
          {error && (
            <div 
              className="auth-alert auth-alert-error" 
              style={{ color: 'red', marginBottom: '1rem', textAlign: 'center', backgroundColor: '#ffebee', padding: '10px', borderRadius: '4px' }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field">
              <div className="auth-input-wrap">
                <input
                  id="student-email"
                  type="email"
                  name="email"
                  className="auth-input"
                  placeholder="Nhập email của bạn"
                  value={email}
                  // Cập nhật State chuẩn xác qua onChange
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <div className="auth-input-wrap">
                <input
                  id="student-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="auth-input"
                  placeholder="Nhập mật khẩu"
                  value={password}
                  // Cập nhật State chuẩn xác qua onChange
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="auth-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Hiện/ẩn mật khẩu"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div className="auth-label-row">
              <a href="#" className="auth-forgot">
                Quên mật khẩu?
              </a>
            </div>

            <button
              id="btn-login-student"
              type="submit"
              className="auth-btn auth-btn-primary"
              disabled={loading}
            >
              {loading ? "Đang xác thực..." : "Đăng nhập"}
            </button>
          </form>

          <p className="auth-footer-text">
            Bạn chưa có tài khoản?{" "}
            <a 
              href="#" 
              className="auth-link"
              onClick={(e) => { e.preventDefault(); navigate('/register/student'); }}
            >
              Đăng ký ngay
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginStudentPage;
