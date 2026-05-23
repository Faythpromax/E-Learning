import apiClient from './client';

export const practiceApi = {
  getQuestion: async (id) => {
    const response = await apiClient.get(`/practice/questions/${id}`);
    return response.data;
  },

  getRandomQuestions: async (params = {}) => {
    const response = await apiClient.get('/practice/random', { params });
    return response.data;
  },

  submitAnswer: async (data) => {
    const response = await apiClient.post('/practice/answer', data);
    return response.data;
  },

  getProgress: async () => {
    const response = await apiClient.get('/practice/progress');
    return response.data;
  },
};

export default practiceApi;
