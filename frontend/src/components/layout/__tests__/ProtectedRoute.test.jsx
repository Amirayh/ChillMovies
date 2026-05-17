import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import ProtectedRoute from '../ProtectedRoute';

const renderProtected = (isAuthenticated, loading = false) => {
  return render(
    <AuthContext.Provider value={{ isAuthenticated, loading }}>
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/login" element={<div>Page de connexion</div>} />
          <Route element={<ProtectedRoute />}>
            <Route path="/protected" element={<div>Contenu Protégé</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  );
};

describe('ProtectedRoute Component', () => {
  it('devrait rediriger vers /login si l\'utilisateur n\'est pas connecté', () => {
    renderProtected(false);
    expect(screen.getByText('Page de connexion')).toBeInTheDocument();
    expect(screen.queryByText('Contenu Protégé')).not.toBeInTheDocument();
  });

  it('devrait afficher le contenu si l\'utilisateur est connecté', () => {
    renderProtected(true);
    expect(screen.getByText('Contenu Protégé')).toBeInTheDocument();
  });

  it('devrait ne rien afficher (null) pendant le chargement', () => {
    const { container } = renderProtected(true, true);
    expect(container.firstChild).toBeNull();
  });
});
