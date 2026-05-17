import { createContext, useState, useEffect } from 'react';
import { authService } from '../services/auth.service';
import { favoritesService } from '../services/favorites.service';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        setIsAuthenticated(true);
        try {
          const favs = await favoritesService.getFavorites();
          // Extract content_id from favorites
          setFavoriteIds(favs.map(f => f.content_id));
        } catch (err) {
          console.error("Erreur lors de la récupération des favoris", err);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const data = await authService.login(credentials);
      if (data.token) {
        localStorage.setItem('token', data.token);
        setIsAuthenticated(true);
        try {
          const favs = await favoritesService.getFavorites();
          setFavoriteIds((favs || []).map(f => f.content_id));
        } catch (e) {
          console.error("Erreur favorites au login:", e);
        }
        return { success: true };
      }
      return { success: false, error: "Identifiants incorrects" };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || "Erreur de connexion" };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setFavoriteIds([]);
    authService.logout().catch(console.error);
  };

  const updateFavoriteIds = (id, add) => {
    if (add) {
      setFavoriteIds(prev => [...prev, id]);
    } else {
      setFavoriteIds(prev => prev.filter(fId => fId !== id));
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, favoriteIds, updateFavoriteIds, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
