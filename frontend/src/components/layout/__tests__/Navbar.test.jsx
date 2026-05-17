import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import Navbar from '../Navbar';

const mockLogout = vi.fn();

const renderWithAuth = (isAuthenticated) => {
  return render(
    <AuthContext.Provider value={{ isAuthenticated, logout: mockLogout }}>
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

describe('Navbar Component', () => {
  it('devrait afficher le logo ChillMovies', () => {
    renderWithAuth(false);
    expect(screen.getByText('CHILLMOVIES')).toBeInTheDocument();
  });

  it('devrait afficher les liens de connexion si non authentifié', () => {
    renderWithAuth(false);
    
    expect(screen.getByText('Connexion')).toBeInTheDocument();
    expect(screen.getByText("S'inscrire")).toBeInTheDocument();
    expect(screen.queryByText('Profil')).not.toBeInTheDocument();
    expect(screen.queryByText('Gestion')).not.toBeInTheDocument();
  });

  it('devrait afficher les liens de profil, favoris et gestion si authentifié', () => {
    renderWithAuth(true);
    
    expect(screen.getByText('Favoris')).toBeInTheDocument();
    expect(screen.getByText('Gestion')).toBeInTheDocument();
    expect(screen.getByText('Profil')).toBeInTheDocument();
    expect(screen.queryByText('Connexion')).not.toBeInTheDocument();
  });

  it('devrait appeler logout lors du clic sur le bouton déconnexion', () => {
    renderWithAuth(true);
    
    // Le bouton déconnexion est le seul bouton dans la navbar quand authentifié
    const logoutBtn = screen.getByRole('button');
    fireEvent.click(logoutBtn);
    
    expect(mockLogout).toHaveBeenCalled();
  });
});
