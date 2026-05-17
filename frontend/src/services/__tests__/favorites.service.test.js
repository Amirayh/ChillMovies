import { describe, it, expect, vi, beforeEach } from 'vitest';
import { favoritesService } from '../favorites.service';
import api from '../api';

vi.mock('../api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  }
}));

describe('favoritesService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getFavorites() devrait récupérer la liste des favoris', async () => {
    const mockFavs = [{ content_id: '1', title: 'Movie 1' }];
    api.get.mockResolvedValue({ data: mockFavs });

    const result = await favoritesService.getFavorites();
    
    expect(api.get).toHaveBeenCalledWith('/favorites');
    expect(result).toEqual(mockFavs);
  });

  it('addFavorite() devrait envoyer l\'ID du contenu à ajouter', async () => {
    api.post.mockResolvedValue({ data: { success: true } });

    await favoritesService.addFavorite('123');
    
    expect(api.post).toHaveBeenCalledWith('/favorites', { content_id: '123' });
  });

  it('removeFavorite() devrait supprimer le favori via l\'ID du contenu', async () => {
    api.delete.mockResolvedValue({ data: { success: true } });

    await favoritesService.removeFavorite('456');
    
    expect(api.delete).toHaveBeenCalledWith('/favorites/456');
  });
});
