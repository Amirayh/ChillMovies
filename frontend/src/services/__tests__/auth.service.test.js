import { describe, it, expect, vi } from 'vitest';
import { authService } from '../auth.service';
import api from '../api';

vi.mock('../api', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    put: vi.fn(),
  }
}));

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('login() devrait envoyer les credentials et retourner les données', async () => {
    const mockResponse = { data: { token: 'new-token' } };
    api.post.mockResolvedValue(mockResponse);

    const credentials = { email: 'test@test.com', password: 'password123' };
    const result = await authService.login(credentials);
    
    expect(api.post).toHaveBeenCalledWith('/auth/login', credentials);
    expect(result).toEqual(mockResponse.data);
  });

  it('register() devrait envoyer les infos utilisateur', async () => {
    const mockResponse = { data: { message: 'User created' } };
    api.post.mockResolvedValue(mockResponse);

    const userData = { 
      username: 'tester', 
      email: 'test@test.com', 
      password: 'password123' 
    };
    const result = await authService.register(userData);
    
    expect(api.post).toHaveBeenCalledWith('/auth/register', userData);
    expect(result).toEqual(mockResponse.data);
  });

  it('getProfile() devrait appeler l\'endpoint /auth/me', async () => {
    const mockUser = { username: 'Admin', email: 'admin@chill.com' };
    api.get.mockResolvedValue({ data: mockUser });

    const result = await authService.getProfile();
    
    expect(api.get).toHaveBeenCalledWith('/auth/me');
    expect(result).toEqual(mockUser);
  });

  it('updateAvatar() devrait envoyer un FormData avec le fichier', async () => {
    const mockFile = new File([''], 'avatar.jpg', { type: 'image/jpeg' });
    api.put.mockResolvedValue({ data: { avatar_url: '/new/path.jpg' } });

    const result = await authService.updateAvatar(mockFile);
    
    expect(api.put).toHaveBeenCalledWith(
      '/auth/me/avatar', 
      expect.any(FormData),
      expect.objectContaining({ headers: { 'Content-Type': 'multipart/form-data' } })
    );
    expect(result.avatar_url).toBe('/new/path.jpg');
  });
});
