import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { contentService } from '../../services/content.service';
import Home from '../Home';

// Mocks
vi.mock('../../services/content.service', () => ({
  contentService: {
    getAll: vi.fn(),
  }
}));

const mockContents = [
  { content_id: '1', title: 'Inception', content_type: 'FILM', genre: 'Sci-Fi', synopsis: 'Un film de rêves.', release_year: 2010 },
  { content_id: '2', title: 'The Boys', content_type: 'SERIES', genre: 'Action', release_year: 2019 }
];

const renderHome = () => {
  return render(
    <AuthContext.Provider value={{ favoriteIds: [], updateFavoriteIds: vi.fn() }}>
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

describe('Home Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('devrait afficher le Loader au chargement', () => {
    contentService.getAll.mockReturnValue(new Promise(() => {})); // Promise jamais résolue pour garder le loader
    const { container } = renderHome();
    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('devrait afficher le Hero avec le premier film de la liste', async () => {
    contentService.getAll.mockResolvedValue(mockContents);
    renderHome();

    await waitFor(() => {
      // On cherche spécifiquement le H1 du Hero pour éviter le doublon avec la carte en bas
      expect(screen.getByRole('heading', { name: 'Inception', level: 1 })).toBeInTheDocument();
      expect(screen.getByText('Un film de rêves.')).toBeInTheDocument();
    });
  });

  it('devrait ouvrir la modale synopsis lors du clic sur Plus d\'infos', async () => {
    contentService.getAll.mockResolvedValue(mockContents);
    renderHome();

    const infoBtn = await screen.findByRole('button', { name: /Plus d'infos/i });
    fireEvent.click(infoBtn);

    expect(screen.getByText('Synopsis')).toBeInTheDocument();
    // La modale contient le titre aussi
    const modalTitles = screen.getAllByText('Inception');
    expect(modalTitles.length).toBeGreaterThan(1); // Un dans le hero, un dans la modale
  });

  it('devrait afficher les catégories Films et Séries séparément', async () => {
    contentService.getAll.mockResolvedValue(mockContents);
    renderHome();

    expect(await screen.findByRole('heading', { name: 'Films' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Séries' })).toBeInTheDocument();
  });

  it('devrait afficher l\'erreur si le chargement échoue', async () => {
    contentService.getAll.mockRejectedValue(new Error('API Error'));
    renderHome();

    expect(await screen.findByText('Impossible de charger les films.')).toBeInTheDocument();
  });
});
