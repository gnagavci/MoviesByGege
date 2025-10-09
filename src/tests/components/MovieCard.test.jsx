import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import MovieCard from '../../components/MovieCard';

describe('MovieCard Component', () => {
  const mockMovie = {
    title: 'Test Movie',
    vote_average: 8.5,
    poster_path: '/test.jpg',
    release_date: '2023-01-01',
    original_language: 'en'
  };

  test('renders movie information', () => {
    render(<MovieCard movie={mockMovie} />);

    expect(screen.getByText('Test Movie')).toBeInTheDocument();
    expect(screen.getByText('8.5')).toBeInTheDocument();
    expect(screen.getByText('en')).toBeInTheDocument();
    expect(screen.getByText('2023')).toBeInTheDocument();
  });

  test('renders poster image with correct src', () => {
    render(<MovieCard movie={mockMovie} />);

    const images = screen.getAllByRole('img');
    const poster = images.find(img => img.src.includes('tmdb.org'));
    expect(poster).toHaveAttribute('src', 'https://image.tmdb.org/t/p/w500//test.jpg');
  });

  test('uses fallback image when poster_path is null', () => {
    const movieWithoutPoster = { ...mockMovie, poster_path: null };
    
    render(<MovieCard movie={movieWithoutPoster} />);

    const images = screen.getAllByRole('img');
    const poster = images.find(img => img.src.includes('no-movie.png'));
    expect(poster).toHaveAttribute('src', '/no-movie.png');
  });

  test('handles missing vote_average', () => {
    const movieWithoutRating = { ...mockMovie, vote_average: null };
    
    render(<MovieCard movie={movieWithoutRating} />);

    expect(screen.getByText('N/A')).toBeInTheDocument();
  });

  test('handles missing release_date', () => {
    const movieWithoutDate = { ...mockMovie, release_date: null };
    
    render(<MovieCard movie={movieWithoutDate} />);

    expect(screen.getByText('N/A')).toBeInTheDocument();
  });
});