import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { authService } from '../../services/auth.service';
import Profile from '../Profile';

// Mocks
vi.mock('../../services/auth.service', () => ({
  authService: {
    getProfile: vi.fn(),
    updateAvatar: vi.fn(),
  }
}));

const mockUser = {
  username: 'AdminTest',
  email: 'admin@test.com',
  created_at: '2024-01-01T10:00:00Z',
  avatar_url: null
};

const mockLogout = vi.fn();

const renderProfile = (favoriteIds = []) => {
  return render(
    <AuthContext.Provider value={{ favoriteIds, logout: mockLogout }}>
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

describe('Profile Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('devrait afficher les informations utilisateur après chargement', async () => {
    authService.getProfile.mockResolvedValue(mockUser);
    renderProfile(['1', '2']);

    expect(await screen.findByRole('heading', { name: 'AdminTest' })).toBeInTheDocument();
    expect(screen.getByText('admin@test.com')).toBeInTheDocument();
    expect(screen.getByText('2 films')).toBeInTheDocument();
  });

  it('devrait appeler logout lors de la déconnexion', async () => {
    authService.getProfile.mockResolvedValue(mockUser);
    renderProfile();

    const logoutBtn = await screen.findByText('Se déconnecter');
    fireEvent.click(logoutBtn);

    expect(mockLogout).toHaveBeenCalled();
  });

  it('devrait permettre de changer d\'avatar', async () => {
    authService.getProfile.mockResolvedValue(mockUser);
    authService.updateAvatar.mockResolvedValue({ avatar_url: '/new/avatar.jpg' });
    renderProfile();

    await screen.findByRole('heading', { name: 'AdminTest' });
    
    const file = new File(['(⌐□_□)'], 'test.png', { type: 'image/png' });
    const input = document.querySelector('input[type="file"]');
    
    // Simuler le changement de fichier
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(authService.updateAvatar).toHaveBeenCalledWith(file);
    });
  });

  it('devrait afficher une erreur si le profil ne charge pas', async () => {
    authService.getProfile.mockRejectedValue(new Error('Fetch failed'));
    renderProfile();

    expect(await screen.findByText('Impossible de charger le profil.')).toBeInTheDocument();
  });
});
