import { describe, it, expect, vi, beforeEach } from 'vitest';
import { contentService } from '../content.service';
import api from '../api';

vi.mock('../api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  }
}));

describe('contentService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getAll() devrait récupérer tout le catalogue', async () => {
    const mockData = [{ title: 'Inception' }, { title: 'Interstellar' }];
    api.get.mockResolvedValue({ data: mockData });

    const result = await contentService.getAll();
    
    expect(api.get).toHaveBeenCalledWith('/api/contents');
    expect(result).toEqual(mockData);
  });

  it('getById() devrait récupérer un contenu spécifique', async () => {
    const mockContent = { content_id: '1', title: 'Inception' };
    api.get.mockResolvedValue({ data: mockContent });

    const result = await contentService.getById('1');
    
    expect(api.get).toHaveBeenCalledWith('/api/contents/1');
    expect(result).toEqual(mockContent);
  });

  it('create() devrait envoyer un FormData pour l\'ajout', async () => {
    const formData = new FormData();
    formData.append('title', 'Titanic');
    api.post.mockResolvedValue({ data: { id: 1, title: 'Titanic' } });

    const result = await contentService.create(formData);
    
    expect(api.post).toHaveBeenCalledWith('/api/contents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    expect(result.title).toBe('Titanic');
  });

  it('update() devrait envoyer un FormData pour la modification', async () => {
    const formData = new FormData();
    formData.append('title', 'Titanic 2');
    api.put.mockResolvedValue({ data: { id: 1, title: 'Titanic 2' } });

    const result = await contentService.update('1', formData);
    
    expect(api.put).toHaveBeenCalledWith('/api/contents/1', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    expect(result.title).toBe('Titanic 2');
  });

  it('delete() devrait supprimer un contenu par son ID', async () => {
    api.delete.mockResolvedValue({ data: { success: true } });

    await contentService.delete('123');
    
    expect(api.delete).toHaveBeenCalledWith('/api/contents/123');
  });
});
