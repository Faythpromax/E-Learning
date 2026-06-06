import api from './api';

export const authService = {
    /**
     * Logic Đăng Nhập Hệ Thống (Đã khớp với AuthController Backend)
     */
    async login(email, password, role) {
    const response = await api.post('/login', { 
        email, 
        password,
        role
    });
    
    const serverResponse = response.data;
    const payload = serverResponse?.data || serverResponse;
    const token = payload?.token;
    const user = payload?.user || payload?.teacher || serverResponse?.user || serverResponse?.teacher;

    if (serverResponse.success && token && user) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('auth_token', token);
        localStorage.setItem('auth_user', JSON.stringify(user));
    } else {
        throw new Error(serverResponse.message || "Đăng nhập thất bại.");
    }
    
    return payload;
},

    /**
     * Logic Đăng Ký Tài Khoản Học Sinh
     */
    async register(name, email, phone, password, password_confirmation, role = 'student') {
        const response = await api.post('/register', {
            name,
            email,
            phone,
            password,
            password_confirmation,
            role
        });
        return response.data;
    },

    /**
     * Logic Đăng Xuất Hệ Thống
     */
    async logout() {
        try {
            await api.post('/logout');
        } catch (error) {
            console.error("Lỗi khi hủy token trên hệ thống:", error);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            localStorage.removeItem('auth_user');
            window.location.href = '/login';
        }
    },

    getCurrentUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
};