import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { favoritesService } from '../../services/favorites.service';
import Favorites from '../Favorites';

// Mocks
vi.mock('../../services/favorites.service', () => ({
  favoritesService: {
    getFavorites: vi.fn(),
  }
}));

const mockFavorites = [
  { content_id: '1', title: 'Inception', content_type: 'FILM' },
  { content_id: '2', title: 'The Boys', content_type: 'SERIES' }
];

const renderFavorites = () => {
  return render(
    <AuthContext.Provider value={{ favoriteIds: ['1', '2'], updateFavoriteIds: vi.fn() }}>
      <BrowserRouter>
        <Favorites />
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

describe('Favorites Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('devrait afficher le titre Mes Favoris', async () => {
    favoritesService.getFavorites.mockResolvedValue([]);
    renderFavorites();
    expect(await screen.findByText('Mes Favoris')).toBeInTheDocument();
  });

  it('devrait afficher la liste des favoris après chargement', async () => {
    favoritesService.getFavorites.mockResolvedValue(mockFavorites);
    renderFavorites();

    expect((await screen.findAllByText('Inception')).length).toBeGreaterThan(0);
    expect(screen.getAllByText('The Boys').length).toBeGreaterThan(0);
  });

  it('devrait afficher un message si la liste est vide', async () => {
    favoritesService.getFavorites.mockResolvedValue([]);
    renderFavorites();

    expect(await screen.findByText(/n'avez pas encore ajouté de favoris/i)).toBeInTheDocument();
  });

  it('devrait afficher une erreur si l\'appel API échoue', async () => {
    favoritesService.getFavorites.mockRejectedValue(new Error('API Down'));
    renderFavorites();

    expect(await screen.findByText('Impossible de charger vos favoris.')).toBeInTheDocument();
  });
});
