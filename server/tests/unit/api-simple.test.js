// Simple backend tests that don't require SQLite
const request = require('supertest');
const express = require('express');

// Mock the database functions
jest.mock('../../db', () => ({
  getTrendingSearches: jest.fn(),
  updateSearchCount: jest.fn(),
  cacheMovie: jest.fn(),
  initDatabase: jest.fn()
}));

// Mock fetch for TMDB API calls
global.fetch = jest.fn();

// Set environment variables
process.env.TMDB_API_KEY = 'test-api-key';

const app = express();
app.use(express.json());

// Import routes after mocking
const moviesRouter = require('../../routes/movies');
const metricsRouter = require('../../routes/metrics');

app.use('/api/movies', moviesRouter);
app.use('/api/metrics', metricsRouter);

describe('Movies API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/movies/search', () => {
    test('should return search results', async () => {
      const mockTmdbResponse = {
        results: [
          {
            id: 123,
            title: 'Test Movie',
            overview: 'Test overview',
            poster_path: '/test.jpg',
            release_date: '2023-01-01',
            vote_average: 8.5
          }
        ]
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockTmdbResponse)
      });

      const response = await request(app)
        .get('/api/movies/search')
        .query({ q: 'test movie' })
        .expect(200);

      expect(response.body).toEqual(mockTmdbResponse);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('search/movie?query=test%20movie'),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-api-key'
          })
        })
      );
    });

    test('should return 400 for missing query', async () => {
      const response = await request(app)
        .get('/api/movies/search')
        .expect(400);

      expect(response.body.error.message).toBe('Search query is required');
    });
  });

  describe('GET /api/movies/discover', () => {
    test('should return popular movies', async () => {
      const mockTmdbResponse = {
        results: [
          { id: 1, title: 'Popular Movie 1' },
          { id: 2, title: 'Popular Movie 2' }
        ]
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockTmdbResponse)
      });

      const response = await request(app)
        .get('/api/movies/discover')
        .expect(200);

      expect(response.body).toEqual(mockTmdbResponse);
    });
  });
});

describe('Metrics API', () => {
  const { getTrendingSearches, updateSearchCount } = require('../../db');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/metrics/trending', () => {
    test('should return trending searches', async () => {
      const mockTrending = [
        { searchTerm: 'movie1', count: 10, poster_url: '/poster1.jpg' },
        { searchTerm: 'movie2', count: 8, poster_url: '/poster2.jpg' }
      ];

      getTrendingSearches.mockImplementation((callback) => {
        callback(null, mockTrending);
      });

      const response = await request(app)
        .get('/api/metrics/trending')
        .expect(200);

      expect(response.body.documents).toHaveLength(2);
      expect(response.body.documents[0].searchTerm).toBe('movie1');
    });
  });

  describe('POST /api/metrics/search', () => {
    test('should update search count', async () => {
      updateSearchCount.mockImplementation((term, movie, callback) => {
        callback(null, { success: true });
      });

      const response = await request(app)
        .post('/api/metrics/search')
        .send({ searchTerm: 'test movie', movie: { id: 123 } })
        .expect(202);

      expect(response.body.ok).toBe(true);
    });

    test('should return 400 for missing search term', async () => {
      const response = await request(app)
        .post('/api/metrics/search')
        .send({})
        .expect(400);

      expect(response.body.error.message).toBe('Search term is required');
    });
  });
});