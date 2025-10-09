const request = require('supertest');
const express = require('express');

// Mock database
jest.mock('../../db', () => ({
  getTrendingSearches: jest.fn(),
  updateSearchCount: jest.fn(),
  cacheMovie: jest.fn(),
  initDatabase: jest.fn()
}));

// Mock fetch
global.fetch = jest.fn();

process.env.TMDB_API_KEY = 'test-key';

const app = express();
app.use(express.json());

const moviesRouter = require('../../routes/movies');
const metricsRouter = require('../../routes/metrics');

app.use('/api/movies', moviesRouter);
app.use('/api/metrics', metricsRouter);

describe('API Contract Tests', () => {
  describe('Movies API Contract', () => {
    test('GET /api/movies/search returns correct schema', async () => {
      const mockResponse = {
        results: [
          {
            id: 123,
            title: 'Test Movie',
            poster_path: '/test.jpg',
            vote_average: 8.5
          }
        ],
        page: 1,
        total_results: 1
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const response = await request(app)
        .get('/api/movies/search?q=test')
        .expect(200);

      // Verify response schema
      expect(response.body).toHaveProperty('results');
      expect(Array.isArray(response.body.results)).toBe(true);
      if (response.body.results.length > 0) {
        expect(response.body.results[0]).toHaveProperty('id');
        expect(response.body.results[0]).toHaveProperty('title');
      }
    });

    test('GET /api/movies/discover returns correct schema', async () => {
      const mockResponse = {
        results: [],
        page: 1,
        total_results: 0
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const response = await request(app)
        .get('/api/movies/discover')
        .expect(200);

      expect(response.body).toHaveProperty('results');
      expect(response.body).toHaveProperty('page');
      expect(response.body).toHaveProperty('total_results');
    });
  });

  describe('Metrics API Contract', () => {
    const { getTrendingSearches, updateSearchCount } = require('../../db');

    test('GET /api/metrics/trending returns correct schema', async () => {
      getTrendingSearches.mockImplementation((callback) => {
        callback(null, [
          { searchTerm: 'test', count: 5, poster_url: '/test.jpg' }
        ]);
      });

      const response = await request(app)
        .get('/api/metrics/trending')
        .expect(200);

      expect(response.body).toHaveProperty('documents');
      expect(Array.isArray(response.body.documents)).toBe(true);
      if (response.body.documents.length > 0) {
        expect(response.body.documents[0]).toHaveProperty('searchTerm');
        expect(response.body.documents[0]).toHaveProperty('count');
      }
    });

    test('POST /api/metrics/search returns correct response', async () => {
      updateSearchCount.mockImplementation((term, movie, callback) => {
        callback(null, { updated: true });
      });

      const response = await request(app)
        .post('/api/metrics/search')
        .send({ searchTerm: 'test', movie: { id: 123 } })
        .expect(202);

      expect(response.body).toHaveProperty('ok', true);
      expect(response.body).toHaveProperty('message');
    });
  });
});