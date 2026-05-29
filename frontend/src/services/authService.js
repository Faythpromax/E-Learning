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

    if (serverResponse.success && serverResponse.data?.token) {
        localStorage.setItem('token', serverResponse.data.token);
        localStorage.setItem('user', JSON.stringify(serverResponse.data.user));
    } else {
        throw new Error(serverResponse.message || "Đăng nhập thất bại.");
    }
    
    return serverResponse.data;
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
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
    },

    getCurrentUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
};