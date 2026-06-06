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

  useEffect(() => {
    const storedUser = localStorage.getItem('auth_user') || localStorage.getItem('user');
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token');

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (email, password, role = 'teacher') => {
    try {
      const response = await apiClient.post('/login', {
        email,
        password,
        role,
      });

      // 1. Log toàn bộ những gì Backend trả về để check
      console.log("BACKEND TRA VE:", response.data);

      const payload = response.data?.data || response.data;
      console.log('BACKEND TRA VE:', response.data);
      const token = payload?.token;
      const userData = payload?.user || payload?.teacher || response.data?.user || response.data?.teacher;

      if (token) {
        localStorage.setItem('auth_token', token);
        localStorage.setItem('token', token);
      }
      if (userData) {
        localStorage.setItem('auth_user', JSON.stringify(userData));
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setIsAuthenticated(true);
      }

      return { success: true, user: userData };
    } catch (error) {
      console.error('Login API error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      };
    }
  };

  const register = async (data) => {
    try {
      const response = await apiClient.post('/register', data);
      const payload = response.data?.data || response.data;
      const userData = payload?.user || payload?.teacher || response.data?.user || response.data?.teacher;
      const token = payload?.token;

      if (token) {
        localStorage.setItem('auth_token', token);
        localStorage.setItem('token', token);
      }
      if (userData) {
        localStorage.setItem('auth_user', JSON.stringify(userData));
        localStorage.setItem('user', JSON.stringify(userData));
      }

      setUser(userData);
      setIsAuthenticated(true);

      return { success: true, user: userData };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
      };
    }
  };

  const logout = async () => {
    try {
      await apiClient.post('/logout');
    } catch (error) {
      console.error('Logout API error:', error);
    }

    localStorage.removeItem('auth_token');
    localStorage.removeItem('token');
    localStorage.removeItem('auth_user');
    localStorage.removeItem('user');

    setUser(null);
    setIsAuthenticated(false);

    navigate('/login');
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('auth_user', JSON.stringify(userData));
    localStorage.setItem('user', JSON.stringify(userData));
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
