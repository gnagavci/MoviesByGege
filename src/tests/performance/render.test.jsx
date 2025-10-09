import { render } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import App from '../../App';
import MovieCard from '../../components/MovieCard';

describe('Performance Tests', () => {
  test('App renders within acceptable time', () => {
    const startTime = performance.now();
    const { container } = render(<App />);
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    console.log(`App render time: ${renderTime}ms`);
    expect(renderTime).toBeLessThan(1000); // Should render in under 1 second
    expect(container).toBeTruthy();
  });

  test('MovieCard batch rendering performance', () => {
    const movies = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      title: `Movie ${i}`,
      vote_average: 8.0,
      poster_path: null,
      release_date: '2023-01-01',
      original_language: 'en'
    }));

    const startTime = performance.now();
    movies.forEach(movie => {
      render(<MovieCard movie={movie} />);
    });
    const endTime = performance.now();
    const totalTime = endTime - startTime;
    
    console.log(`Rendered 100 MovieCards in ${totalTime}ms`);
    expect(totalTime).toBeLessThan(5000); // Should handle 100 cards in under 5 seconds
  });
});