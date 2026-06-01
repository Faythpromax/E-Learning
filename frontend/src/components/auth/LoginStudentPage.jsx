import React, { useState } from 'react';
import { authService } from '../../../../services/authService'; // Điều chỉnh đường dẫn tương đối cho đúng vị trí file

function LoginStudentPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // 1. Gọi hàm login từ authService đã cấu hình ở bước trước
            const data = await authService.login(email, password, 'student');
            
            // 2. Kiểm tra vai trò trả về từ Laravel Backend
            if (data.user.role === 'student') {
                alert('Đăng nhập Sinh viên thành công!');
                window.location.href = '/student/dashboard'; // Hoặc dùng useNavigate() nếu có react-router-dom
            } else {
                setError('Tài khoản này không thuộc quyền hạn Sinh viên.');
                await authService.logout();
            }
        } catch (err) {
            // 3. Bắt lỗi trả về từ LoginRequest validation hoặc AuthController của Laravel
            setError(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-box">
            <h2>Đăng Nhập Hệ Thống (Sinh Viên)</h2>
            {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
            
            <form onSubmit={handleLoginSubmit}>
                <input 
                    type="email" 
                    placeholder="Email sinh viên" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    required 
                />
                <input 
                    type="password" 
                    placeholder="Mật khẩu" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    required 
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Đang xác thực...' : 'Đăng Nhập'}
                </button>
            </form>
        </div>
    );
}

export default LoginStudentPage;