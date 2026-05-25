import api from './api';

export const authService = {
    /**
     * Logic Đăng Nhập Hệ Thống (Đã khớp với AuthController Backend)
     */
    async login(email, password) {
        const response = await api.post('/login', { email, password });
        
        // Backend trả về cấu trúc: response.data = { success: true, data: { token: "...", user: {...} } }
        const serverResponse = response.data;

        if (serverResponse.success && serverResponse.data?.token) {
            // Lưu token và user từ trong object 'data' của backend vào localStorage
            localStorage.setItem('token', serverResponse.data.token);
            localStorage.setItem('user', JSON.stringify(serverResponse.data.user));
        } else {
            // Trường hợp backend trả về success = false
            throw new Error(serverResponse.message || "Đăng nhập thất bại.");
        }
        
        return serverResponse.data; // Trả về object { user, token } cho UI dùng
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