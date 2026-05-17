import api from './api';

export const contentService = {
  getAll: async () => {
    const response = await api.get('/api/contents');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/api/contents/${id}`);
    return response.data;
  },

  create: async (formData) => {
    // formData peut inclure un fichier (multer), on utilise donc FormData
    const response = await api.post('/api/contents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  update: async (id, formData) => {
    const response = await api.put(`/api/contents/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/api/contents/${id}`);
    return response.data;
  }
};
