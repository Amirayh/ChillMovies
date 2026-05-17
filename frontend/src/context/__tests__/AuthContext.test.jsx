import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { AuthProvider, AuthContext } from '../AuthContext';
import { authService } from '../../services/auth.service';
import { favoritesService } from '../../services/favorites.service';
import { useContext } from 'react';

// Mocks
vi.mock('../../services/auth.service', () => ({
  authService: {
    login: vi.fn(),
    logout: vi.fn(),
  }
}));
vi.mock('../../services/favorites.service', () => ({
  favoritesService: {
    getFavorites: vi.fn(),
  }
}));

const TestComponent = () => {
  const { isAuthenticated, favoriteIds, login, logout } = useContext(AuthContext);
  return (
    <div>
      <div data-testid="auth">{isAuthenticated ? 'YES' : 'NO'}</div>
      <div data-testid="fav-count">{favoriteIds.length}</div>
      <button onClick={() => login({ email: 'test@test.com' })}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('devrait initialiser avec isAuthenticated=false si pas de token', async () => {
    await act(async () => {
      render(<AuthProvider><TestComponent /></AuthProvider>);
    });
    expect(screen.getByTestId('auth')).toHaveTextContent('NO');
  });

  it('devrait passer à isAuthenticated=true si un token est présent au chargement', async () => {
    localStorage.setItem('token', 'fake-token');
    favoritesService.getFavorites.mockResolvedValue([{ content_id: '1' }]);

    await act(async () => {
      render(<AuthProvider><TestComponent /></AuthProvider>);
    });

    expect(screen.getByTestId('auth')).toHaveTextContent('YES');
    expect(screen.getByTestId('fav-count')).toHaveTextContent('1');
  });

  it('login() devrait mettre à jour l\'état et le localStorage', async () => {
    authService.login.mockResolvedValue({ token: 'new-token' });
    favoritesService.getFavorites.mockResolvedValue([]);

    await act(async () => {
      render(<AuthProvider><TestComponent /></AuthProvider>);
    });

    await act(async () => {
      fireEvent.click(screen.getByText('Login'));
    });

    expect(localStorage.getItem('token')).toBe('new-token');
    expect(screen.getByTestId('auth')).toHaveTextContent('YES');
  });

  it('logout() devrait nettoyer l\'état et le localStorage', async () => {
    localStorage.setItem('token', 'old-token');
    authService.logout.mockResolvedValue({});
    favoritesService.getFavorites.mockResolvedValue([]);

    await act(async () => {
      render(<AuthProvider><TestComponent /></AuthProvider>);
    });

    await act(async () => {
      fireEvent.click(screen.getByText('Logout'));
    });

    expect(localStorage.getItem('token')).toBeNull();
    expect(screen.getByTestId('auth')).toHaveTextContent('NO');
  });
});

// Import fireEvent car manquant dans l'import initial
import { fireEvent } from '@testing-library/react';
