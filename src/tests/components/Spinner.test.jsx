import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import Spinner from '../../components/Spinner';

describe('Spinner Component', () => {
  test('renders loading indicator', () => {
    render(<Spinner />);

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('has proper accessibility attributes', () => {
    render(<Spinner />);

    const status = screen.getByRole('status');
    expect(status).toBeInTheDocument();
    
    const hiddenText = screen.getByText('Loading...');
    expect(hiddenText).toHaveClass('sr-only');
  });
});