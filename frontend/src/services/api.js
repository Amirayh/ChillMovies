import axios from 'axios';

// Configuration de base pour toutes les requêtes Axios
const api = axios.create({
  baseURL: 'https://chillmovies.onrender.com', // Le backend tourne sur le port 3000
});

// Intercepteur pour ajouter automatiquement le token JWT à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs globales (ex: token expiré)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Déconnexion automatique si non autorisé
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
