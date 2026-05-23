import apiClient from './client';

export const questionApi = {
  getQuestions: async (params = {}) => {
    const response = await apiClient.get('/questions', { params });
    return response.data;
  },

  getQuestion: async (id) => {
    const response = await apiClient.get(`/questions/${id}`);
    return response.data;
  },

  createQuestion: async (data) => {
    const response = await apiClient.post('/questions', data);
    return response.data;
  },

  updateQuestion: async (id, data) => {
    const response = await apiClient.put(`/questions/${id}`, data);
    return response.data;
  },

  deleteQuestion: async (id) => {
    const response = await apiClient.delete(`/questions/${id}`);
    return response.data;
  },

  checkAnswer: async (id, answer) => {
    const response = await apiClient.post(`/questions/${id}/check`, { answer });
    return response.data;
  },
};

export default questionApi;
