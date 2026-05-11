import { useNavigate } from 'react-router-dom';

function AdminLoginPage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    const Email = document.querySelector('input[placeholder="Email"]').value;
    const Password = document.querySelector('input[placeholder="Mật khẩu"]').value;

    const mockEmail = 'NHV123@gmail.com';
    const mockPassword = '123';

    if (!Email || !Password) {
      alert('Vui lòng nhập đầy đủ thông tin.');
      return;
    }

    if (Email === mockEmail && Password === mockPassword) {
      navigate('/admin/dashboard');
    } else {
      alert('Email hoặc mật khẩu không đúng. Vui lòng thử lại.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '24px', background: '#f6f9ff' }}>
      <div style={{ width: '100%', maxWidth: '420px', background: '#fff', borderRadius: '20px', padding: '32px', boxShadow: '0 24px 80px rgba(0, 100, 200, 0.12)' }}>
        <button onClick={() => navigate('/')} style={{ border: 'none', background: 'none', color: '#0084FF', fontWeight: 600, cursor: 'pointer', marginBottom: '16px', padding: 0 }}>
          ← Quay về trang chủ
        </button>
        <h1 style={{ fontSize: '1.6rem', marginBottom: '8px', color: '#0f1f3d' }}>Đăng nhập quản trị viên</h1>
        <p style={{ color: '#6b7280', lineHeight: 1.6, marginBottom: '24px' }}>Khu vực quản trị hoạt động riêng cho role Admin.</p>
        <div style={{ display: 'grid', gap: '12px' }}>
          <input type="email" placeholder="Email" style={{ padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #d1dff7' }} required />
          <input type="password" placeholder="Mật khẩu" style={{ padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #d1dff7' }} required />
          <button
            type="button"
            onClick={handleLogin}
            style={{ padding: '12px 14px', border: 'none', borderRadius: '12px', background: 'linear-gradient(135deg, #0084FF, #0070d9)', color: '#fff', fontWeight: 700 }}>
            Đăng Nhập
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminLoginPage;