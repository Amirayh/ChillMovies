import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { contentService } from '../../services/content.service';
import { favoritesService } from '../../services/favorites.service';
import ContentDetail from '../ContentDetail';

// Mocks
vi.mock('../../services/content.service', () => ({
  contentService: {
    getById: vi.fn(),
  }
}));
vi.mock('../../services/favorites.service', () => ({
  favoritesService: {
    addFavorite: vi.fn(),
    removeFavorite: vi.fn(),
  }
}));

const mockContent = {
  content_id: '1',
  title: 'Interstellar',
  synopsis: 'Un voyage à travers l\'espace.',
  release_year: 2014,
  average_rating: 4.8,
  content_type: 'FILM',
  director: 'Christopher Nolan'
};

const mockUpdateFavoriteIds = vi.fn();

const renderDetail = (favoriteIds = []) => {
  return render(
    <AuthContext.Provider value={{ favoriteIds, updateFavoriteIds: mockUpdateFavoriteIds }}>
      <MemoryRouter initialEntries={['/content/1']}>
        <Routes>
          <Route path="/content/:id" element={<ContentDetail />} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  );
};

describe('ContentDetail Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('devrait charger et afficher les détails du film', async () => {
    contentService.getById.mockResolvedValue(mockContent);
    renderDetail();

    expect(await screen.findByRole('heading', { name: 'Interstellar' })).toBeInTheDocument();
    expect(screen.getByText('Christopher Nolan')).toBeInTheDocument();
    expect(screen.getByText('Un voyage à travers l\'espace.')).toBeInTheDocument();
    expect(screen.getByText('4.8')).toBeInTheDocument();
  });

  it('devrait permettre d\'ajouter aux favoris', async () => {
    contentService.getById.mockResolvedValue(mockContent);
    favoritesService.addFavorite.mockResolvedValue({ success: true });
    renderDetail([]);

    const favBtn = await screen.findByRole('button', { name: /Ajouter aux favoris/i });
    fireEvent.click(favBtn);

    await waitFor(() => {
      expect(favoritesService.addFavorite).toHaveBeenCalledWith('1');
      expect(mockUpdateFavoriteIds).toHaveBeenCalledWith('1', true);
    });
  });

  it('devrait permettre de retirer des favoris', async () => {
    contentService.getById.mockResolvedValue(mockContent);
    favoritesService.removeFavorite.mockResolvedValue({ success: true });
    renderDetail(['1']); // ID 1 est déjà dans les favoris

    const favBtn = await screen.findByRole('button', { name: /Retirer des favoris/i });
    fireEvent.click(favBtn);

    await waitFor(() => {
      expect(favoritesService.removeFavorite).toHaveBeenCalledWith('1');
      expect(mockUpdateFavoriteIds).toHaveBeenCalledWith('1', false);
    });
  });

  it('devrait afficher une erreur si le film est introuvable', async () => {
    contentService.getById.mockRejectedValue(new Error('404'));
    renderDetail();

    expect(await screen.findByText('Film introuvable.')).toBeInTheDocument();
  });
});
