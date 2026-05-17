import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { contentService } from '../../services/content.service';
import ContentManager from '../ContentManager';

// Mocks
vi.mock('../../services/content.service', () => ({
  contentService: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  }
}));

const mockContents = [
  { content_id: '1', title: 'Inception', content_type: 'FILM', release_year: 2010 }
];

const renderManager = () => {
  return render(
    <BrowserRouter>
      <ContentManager />
    </BrowserRouter>
  );
};

describe('ContentManager Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('confirm', vi.fn(() => true));
  });

  it('devrait afficher la liste des contenus dans le tableau', async () => {
    contentService.getAll.mockResolvedValue(mockContents);
    renderManager();

    expect(await screen.findByText('Inception')).toBeInTheDocument();
    expect(screen.getByText('FILM')).toBeInTheDocument();
  });

  it('devrait ouvrir la modale d\'ajout lors du clic sur le bouton', async () => {
    contentService.getAll.mockResolvedValue([]);
    renderManager();

    const addBtn = await screen.findByText(/Ajouter un Contenu/i);
    fireEvent.click(addBtn);

    expect(screen.getByText('Ajouter un contenu')).toBeInTheDocument();
  });

  it('devrait appeler contentService.create lors de la soumission du formulaire', async () => {
    contentService.getAll.mockResolvedValue([]);
    contentService.create.mockResolvedValue({ success: true });
    renderManager();

    // Ouvrir modal
    fireEvent.click(await screen.findByText(/Ajouter un Contenu/i));

    // Remplir titre (on utilise findByLabelText car "Titre *" est le label)
    const titleInput = screen.getByLabelText(/Titre \*/i);
    fireEvent.change(titleInput, { target: { value: 'Avatar', name: 'title' } });
    
    // Soumettre
    fireEvent.click(screen.getByText('Créer le contenu'));

    await waitFor(() => {
      expect(contentService.create).toHaveBeenCalled();
      // On vérifie que c'est bien un FormData
      const call = contentService.create.mock.calls[0];
      expect(call[0]).toBeInstanceOf(FormData);
      expect(call[0].get('title')).toBe('Avatar');
    });
  });

  it('devrait appeler contentService.delete lors du clic sur supprimer', async () => {
    contentService.getAll.mockResolvedValue(mockContents);
    renderManager();

    // Trouver le bouton supprimer dans la première ligne de données
    const rows = await screen.findAllByRole('row');
    const dataRow = rows[1]; // Index 1 car index 0 est le header
    const deleteBtn = dataRow.querySelectorAll('button')[1]; // Le 2ème bouton est Supprimer (Trash2)
    
    fireEvent.click(deleteBtn);

    expect(window.confirm).toHaveBeenCalled();
    expect(contentService.delete).toHaveBeenCalledWith('1');
  });
});
