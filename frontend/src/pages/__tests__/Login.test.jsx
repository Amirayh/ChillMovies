import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Login from '../Login';

const mockLogin = vi.fn();
const mockNavigate = vi.fn();

// Mock de react-router-dom pour capturer la navigation
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { 
    ...actual, 
    useNavigate: () => mockNavigate 
  };
});

const renderLogin = () => {
  return render(
    <AuthContext.Provider value={{ login: mockLogin }}>
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

describe('Login Page', () => {
  it('devrait afficher les champs email et password', () => {
    renderLogin();
    expect(screen.getByPlaceholderText('votre@email.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
  });

  it('devrait appeler login et naviguer vers / en cas de succès', async () => {
    mockLogin.mockResolvedValue({ success: true });
    renderLogin();

    fireEvent.change(screen.getByPlaceholderText('votre@email.com'), { target: { value: 'test@test.com', name: 'email' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'password123', name: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /Se Connecter/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({ email: 'test@test.com', password: 'password123' });
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('devrait afficher une erreur si la connexion échoue', async () => {
    mockLogin.mockResolvedValue({ success: false, error: 'Identifiants invalides' });
    renderLogin();

    // On remplit les champs pour déclencher la soumission proprement
    fireEvent.change(screen.getByPlaceholderText('votre@email.com'), { target: { value: 'wrong@test.com', name: 'email' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'wrongpass', name: 'password' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Se Connecter/i }));

    expect(await screen.findByText('Identifiants invalides')).toBeInTheDocument();
  });
});
