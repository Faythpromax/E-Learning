import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../../services/authService";
import "../../../features/auth/auth.css";

function RegisterStudentPage() {
  const navigate = useNavigate();
  
  // 1. Khai báo các State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  // --- ĐÃ THÊM STATE PHONE Ở ĐÂY ---
  const [phone, setPhone] = useState(""); 
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // 2. Hàm xử lý Đăng ký khi bấm submit form
  const handleRegister = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (password !== passwordConfirmation) {
      setError("Mật khẩu xác nhận không trùng khớp!");
      return;
    }

    setLoading(true);

    try {
      // --- ĐÃ TRUYỀN BIẾN PHONE VÀO HÀM REGISTER ---
      await authService.register(name, email, phone, password, passwordConfirmation, "student");

      setSuccess("Đăng ký tài khoản sinh viên thành công! Đang chuyển hướng...");
      
      setTimeout(() => {
        navigate("/login"); 
      }, 2000);

    } catch (err) {
      if (err.response && err.response.status === 422) {
        const validationErrors = err.response.data.errors;
        
        // Cập nhật dòng này để ép Object hiển thị rõ chữ ở tab Console
        console.error("Chi tiết lỗi Đăng ký từ Laravel:", JSON.stringify(validationErrors, null, 2));

        // Bóc tách lỗi hiển thị lên màn hình giao diện
        const firstErrorKey = Object.keys(validationErrors)[0];
        const firstErrorMessage = validationErrors[firstErrorKey][0];
        setError(firstErrorMessage);
      } else {
        setError(err.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  }

  // 3. Phần Giao diện UI hiển thị ra màn hình
  return (
    <div className="auth-page auth-page--centered">
      <div className="auth-bg" />

      <div className="auth-container">
        <div className="auth-card">
          <button
            className="auth-back-link"
            onClick={() => navigate("/login")}
          >
            ← Quay lại đăng nhập
          </button>

          <h1 className="auth-title" style={{ marginTop: "0.75rem" }}>
            Đăng ký tài khoản Học sinh
          </h1>
          <p className="auth-subtitle">
            Tạo tài khoản học tập mới để tham gia các lớp học trực tuyến.
          </p>

          {/* Khu vực hiển thị thông báo Lỗi hoặc Thành công */}
          {error && <div className="auth-alert auth-alert-error" style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
          {success && <div className="auth-alert auth-alert-success" style={{ color: 'green', marginBottom: '1rem', textAlign: 'center' }}>{success}</div>}

          <form onSubmit={handleRegister} className="auth-form">
            
            {/* Ô nhập Họ và Tên */}
            <div className="auth-field">
              <div className="auth-input-wrap">
                <input
                  type="text"
                  className="auth-input"
                  placeholder="Nhập họ và tên của bạn"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Ô nhập Email */}
            <div className="auth-field">
              <div className="auth-input-wrap">
                <input
                  type="email"
                  className="auth-input"
                  placeholder="Nhập địa chỉ email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* === ĐÃ UPDATE UI: Ô NHẬP SỐ ĐIỆN THOẠI === */}
            <div className="auth-field">
              <div className="auth-input-wrap">
                <input
                  type="tel"
                  className="auth-input"
                  placeholder="Nhập số điện thoại của bạn"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Ô nhập Mật khẩu */}
            <div className="auth-field">
              <div className="auth-input-wrap">
                <input
                  type="password"
                  className="auth-input"
                  placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Ô nhập lại Mật khẩu */}
            <div className="auth-field">
              <div className="auth-input-wrap">
                <input
                  type="password"
                  className="auth-input"
                  placeholder="Xác nhận lại mật khẩu"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="auth-btn auth-btn-primary"
              disabled={loading}
            >
              {loading ? "Đang xử lý..." : "Đăng ký tài khoản"}
            </button>
          </form>

          <p className="auth-footer-text">
            Đã có tài khoản?{" "}
            <a 
              href="#" 
              className="auth-link"
              onClick={(e) => { e.preventDefault(); navigate('/login'); }}
            >
              Đăng nhập ngay
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterStudentPage;