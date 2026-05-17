import api from './api';

export const favoritesService = {
  getFavorites: async () => {
    const response = await api.get('/favorites');
    return response.data;
  },

  addFavorite: async (contentId) => {
    const response = await api.post('/favorites', { content_id: contentId });
    return response.data;
  },

  removeFavorite: async (contentId) => {
    const response = await api.delete(`/favorites/${contentId}`);
    return response.data;
  },

  togglePin: async (contentId) => {
    const response = await api.patch(`/favorites/${contentId}/pin`);
    return response.data;
  }
};
