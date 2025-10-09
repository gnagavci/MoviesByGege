import { vi, describe, test, expect, beforeEach } from 'vitest';
import { fetchMovies, getTrendingMovies, updateSearchCount } from '../../services/api';

// Mock fetch
global.fetch = vi.fn();

describe('API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchMovies', () => {
    test('fetches search results when query provided', async () => {
      const mockResponse = {
        results: [{ id: 1, title: 'Test Movie' }]
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await fetchMovies('test query');

      expect(fetch).toHaveBeenCalledWith('http://backend-test:3001/api/movies/search?q=test%20query');
      expect(result).toEqual(mockResponse);
    });

    test('fetches discover results when no query', async () => {
      const mockResponse = {
        results: [{ id: 1, title: 'Popular Movie' }]
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await fetchMovies();

      expect(fetch).toHaveBeenCalledWith('http://backend-test:3001/api/movies/discover');
      expect(result).toEqual(mockResponse);
    });

    test('throws error on failed request', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500
      });

      await expect(fetchMovies('test')).rejects.toThrow('HTTP error! status: 500');
    });
  });

  describe('getTrendingMovies', () => {
    test('returns trending movie documents', async () => {
      const mockResponse = {
        documents: [
          { searchTerm: 'popular movie', count: 10 }
        ]
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await getTrendingMovies();

      expect(fetch).toHaveBeenCalledWith('http://backend-test:3001/api/metrics/trending');
      expect(result).toEqual(mockResponse.documents);
    });

    test('throws error on failed request', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500
      });

      await expect(getTrendingMovies()).rejects.toThrow('HTTP error! status: 500');
    });
  });

  describe('updateSearchCount', () => {
    test('posts search metrics', async () => {
      const mockResponse = { ok: true };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await updateSearchCount('test movie', { id: 123 });

      expect(fetch).toHaveBeenCalledWith(
        'http://backend-test:3001/api/metrics/search',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ searchTerm: 'test movie', movie: { id: 123 } })
        }
      );
      expect(result).toEqual(mockResponse);
    });

    test('handles errors gracefully', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await updateSearchCount('test', { id: 1 });
      expect(result).toBeUndefined();
    });
  });
});