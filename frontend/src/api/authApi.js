import apiClient from './client';

export const authApi = {
  login: async (email, password) => {
    const response = await apiClient.post('/login', { email, password });
    return response.data;
  },

  register: async (data) => {
    const response = await apiClient.post('/register', data);
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post('/logout');
    return response.data;
  },

  getMe: async () => {
    const response = await apiClient.get('/me');
    return response.data;
  },
};

export default authApi;
