import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Tự động lấy token từ localStorage đính vào mọi Request gửi lên Laravel
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // Lấy chuỗi token đã lưu
        if (token) {
            config.headers.Authorization = `Bearer ${token}`; // Đính vào Header gửi đi
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Tự động xử lý khi Token hết hạn (Lỗi 401)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Nếu Backend trả về lỗi 401 Unauthorized
        if (error.response && error.response.status === 401) {
            // KIỂM TRA: Nếu đường dẫn hiện tại KHÔNG PHẢI là các trang đăng nhập thì mới đá về /login
            const currentPath = window.location.pathname;
            if (!currentPath.includes('/login')) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login'; 
            }
        }
        return Promise.reject(error);
    }
);

export default api;