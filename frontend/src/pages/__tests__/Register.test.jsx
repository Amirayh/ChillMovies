import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import Register from '../Register';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { 
    ...actual, 
    useNavigate: () => mockNavigate 
  };
});

vi.mock('../../services/auth.service', () => ({
  authService: {
    register: vi.fn(),
  }
}));

const renderRegister = () => {
  return render(
    <BrowserRouter>
      <Register />
    </BrowserRouter>
  );
};

describe('Register Page', () => {
  it('devrait afficher les champs d\'inscription', () => {
    renderRegister();
    expect(screen.getByPlaceholderText('cinephile_99')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('votre@email.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
  });

  it('devrait appeler register et naviguer vers /login en cas de succès', async () => {
    authService.register.mockResolvedValue({ success: true });
    renderRegister();

    fireEvent.change(screen.getByPlaceholderText('cinephile_99'), { target: { value: 'user1', name: 'username' } });
    fireEvent.change(screen.getByPlaceholderText('votre@email.com'), { target: { value: 'test@test.com', name: 'email' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'password123', name: 'password' } });
    
    fireEvent.click(screen.getByRole('button', { name: /S'inscrire/i }));

    await waitFor(() => {
      expect(authService.register).toHaveBeenCalledWith({
        username: 'user1',
        email: 'test@test.com',
        password: 'password123'
      });
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  it('devrait afficher une erreur si l\'inscription échoue', async () => {
    const errorResponse = { response: { data: { message: 'Email déjà utilisé' } } };
    authService.register.mockRejectedValue(errorResponse);
    renderRegister();

    fireEvent.change(screen.getByPlaceholderText('cinephile_99'), { target: { value: 'user1', name: 'username' } });
    fireEvent.change(screen.getByPlaceholderText('votre@email.com'), { target: { value: 'duplicate@test.com', name: 'email' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'password123', name: 'password' } });

    fireEvent.click(screen.getByRole('button', { name: /S'inscrire/i }));

    expect(await screen.findByText('Email déjà utilisé')).toBeInTheDocument();
  });
});
