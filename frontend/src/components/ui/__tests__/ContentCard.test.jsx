import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import ContentCard from '../ContentCard';
import { favoritesService } from '../../../services/favorites.service';

// Mock du service de favoris
vi.mock('../../../services/favorites.service', () => ({
  favoritesService: {
    addFavorite: vi.fn(),
    removeFavorite: vi.fn(),
  }
}));

const mockContent = {
  content_id: '1',
  title: 'Inception',
  poster_url: '/uploads/inception.jpg',
  release_year: 2010,
  average_rating: 4.5,
  content_type: 'FILM'
};

const mockUpdateFavoriteIds = vi.fn();

const renderWithProviders = (content, favoriteIds = []) => {
  return render(
    <AuthContext.Provider value={{ favoriteIds, updateFavoriteIds: mockUpdateFavoriteIds }}>
      <BrowserRouter>
        <ContentCard content={content} />
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

describe('ContentCard Component', () => {
  it('devrait afficher les informations du film correctement', () => {
    renderWithProviders(mockContent);
    
    expect(screen.getByText('Inception')).toBeInTheDocument();
    expect(screen.getByText('2010')).toBeInTheDocument();
    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText('Film')).toBeInTheDocument();
  });

  it('devrait traduire SERIES en Série', () => {
    renderWithProviders({ ...mockContent, content_type: 'SERIES' });
    expect(screen.getByText('Série')).toBeInTheDocument();
  });

  it('devrait traduire DOCUMENTARY en Documentaire', () => {
    renderWithProviders({ ...mockContent, content_type: 'DOCUMENTARY' });
    expect(screen.getByText('Documentaire')).toBeInTheDocument();
  });

  it('devrait appeler favoritesService.addFavorite lors du clic sur le coeur si non favori', async () => {
    favoritesService.addFavorite.mockResolvedValue({ success: true });
    renderWithProviders(mockContent, []);

    const favButton = screen.getByRole('button');
    fireEvent.click(favButton);

    expect(favoritesService.addFavorite).toHaveBeenCalledWith('1');
    // On ne teste pas l'update du contexte ici car c'est asynchrone et géré par le composant
  });

  it('devrait appeler favoritesService.removeFavorite lors du clic sur le coeur si déjà favori', async () => {
    favoritesService.removeFavorite.mockResolvedValue({ success: true });
    renderWithProviders(mockContent, ['1']);

    const favButton = screen.getByRole('button');
    fireEvent.click(favButton);

    expect(favoritesService.removeFavorite).toHaveBeenCalledWith('1');
  });
});
