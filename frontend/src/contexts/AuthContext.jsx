import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const TOKEN_KEY = 'auth_token';
  const USER_KEY = 'auth_user';

  useEffect(() => {
    const initAuth = () => {
      try {
        const storedUser = localStorage.getItem(USER_KEY);
        const token = localStorage.getItem(TOKEN_KEY);

        if (storedUser && token) {
          const parsedUser = JSON.parse(storedUser);
          console.log("=== THÔNG TIN USER KHI KHỞI TẠO TRANG ===", parsedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);
        } else {
          clearAuthStorage();
        }
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        clearAuthStorage();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const clearAuthStorage = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const login = async (email, password, role = 'teacher') => {
    try {
      clearAuthStorage();

      const response = await apiClient.post('/login', {
        email,
        password,
        role,
      });

      const payload = response.data?.data || response.data;
      const token = payload?.token || response.data?.token;
      const userData = payload?.user || payload?.teacher || response.data?.user || response.data?.teacher || payload;

      if (!token) {
        throw new Error('Không tìm thấy Token trong dữ liệu Auth trả về');
      }

      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      
      // Gán trực tiếp token mới vào apiClient ngay lập tức để chặn dùng token cũ
      if (apiClient.defaults.headers.common) {
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }

      setUser(userData);
      setIsAuthenticated(true);

      // 👉 THAY VÌ DÙNG navigate(), ÉP TRÌNH DUYỆT TẢI LẠI TRANG ĐỂ LÀM SẠCH AXIOS STATE
      window.location.href = role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard';

      return { success: true, user: userData };
    } catch (error) {
      console.error('Login API error:', error);
      clearAuthStorage();
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Login failed',
      };
    }
  };

  const register = async (data) => {
    try {
      clearAuthStorage();

      const response = await apiClient.post('/register', data);
      const payload = response.data?.data || response.data;
      const token = payload?.token || response.data?.token;
      const userData = payload?.user || payload?.teacher || response.data?.user || response.data?.teacher || payload;

      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      
      setUser(userData);
      setIsAuthenticated(true);

      return { success: true, user: userData };
    } catch (error) {
      console.error('Register API error:', error);
      clearAuthStorage();
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Registration failed',
      };
    }
  };

  const logout = async () => {
    try {
      await apiClient.post('/logout');
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      clearAuthStorage();
      window.location.href = '/login';
    }
  };

  const updateUser = (userData) => {
    if (userData) {
      setUser(userData);
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;