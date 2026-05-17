import { describe, it, expect, vi, beforeEach } from 'vitest';
import api from '../api';

describe('api service', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('devrait avoir une baseURL configurée', () => {
    expect(api.defaults.baseURL).toBeDefined();
  });

  it('devrait ajouter le token JWT dans les headers si présent', async () => {
    const mockToken = 'fake-jwt-token';
    localStorage.setItem('token', mockToken);

    const config = { headers: {} };
    // On appelle l'intercepteur directement pour tester sa logique
    const interceptedConfig = api.interceptors.request.handlers[0].fulfilled(config);
    
    expect(interceptedConfig.headers.Authorization).toBe(`Bearer ${mockToken}`);
  });

  it('devrait ne pas ajouter de header Authorization si le token est absent', async () => {
    const config = { headers: {} };
    const interceptedConfig = api.interceptors.request.handlers[0].fulfilled(config);
    
    expect(interceptedConfig.headers.Authorization).toBeUndefined();
  });

  it('devrait supprimer le token et rediriger en cas d\'erreur 401', async () => {
    // Mock de window.location.href
    const originalLocation = window.location;
    delete window.location;
    window.location = { href: '' };

    localStorage.setItem('token', 'expired-token');

    const error401 = {
      response: { status: 401 }
    };

    try {
      await api.interceptors.response.handlers[0].rejected(error401);
    } catch (e) {
      expect(localStorage.getItem('token')).toBeNull();
      expect(window.location.href).toBe('/login');
    }

    window.location = originalLocation;
  });
});
