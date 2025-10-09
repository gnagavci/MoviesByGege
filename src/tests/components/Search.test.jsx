import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, test, expect } from 'vitest';
import Search from '../../components/Search';

describe('Search Component', () => {
  test('renders search input and icon', () => {
    const mockSetSearchTerm = vi.fn();
    
    render(<Search searchTerm="" setSearchTerm={mockSetSearchTerm} />);

    expect(screen.getByPlaceholderText(/Search through thousands of movies/)).toBeInTheDocument();
    expect(screen.getByAltText('search')).toBeInTheDocument();
  });

  test('calls setSearchTerm when typing', () => {
    const mockSetSearchTerm = vi.fn();
    
    render(<Search searchTerm="" setSearchTerm={mockSetSearchTerm} />);

    const input = screen.getByPlaceholderText(/Search through thousands of movies/);
    fireEvent.change(input, { target: { value: 'new search' } });

    expect(mockSetSearchTerm).toHaveBeenCalledWith('new search');
  });

  test('displays current search term', () => {
    const mockSetSearchTerm = vi.fn();
    
    render(<Search searchTerm="current search" setSearchTerm={mockSetSearchTerm} />);

    const input = screen.getByDisplayValue('current search');
    expect(input).toBeInTheDocument();
  });
});