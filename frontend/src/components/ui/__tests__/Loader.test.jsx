import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Loader from '../Loader';

describe('Loader Component', () => {
  it('devrait s\'afficher correctement dans le DOM', () => {
    const { container } = render(<Loader />);
    
    // Vérifie la présence de la div animée (animate-spin)
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
    
    // Vérifie que les classes de design premium sont présentes
    expect(spinner).toHaveClass('border-t-pink-500');
    expect(spinner).toHaveClass('border-r-purple-600');
  });
});
