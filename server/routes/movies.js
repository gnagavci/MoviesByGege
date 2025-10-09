const express = require('express');
const { cacheMovie } = require('../db');

const router = express.Router();

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_API_KEY = process.env.TMDB_API_KEY;

if (!TMDB_API_KEY) {
  console.error('❌ TMDB_API_KEY is required in environment variables');
  process.exit(1);
}

const tmdbOptions = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${TMDB_API_KEY}`
  }
};

// Search movies
router.get('/search', async (req, res) => {
  try {
    const { q: query, page = 1 } = req.query;
    
    if (!query || query.trim() === '') {
      return res.status(400).json({
        error: { message: 'Search query is required' }
      });
    }

    const url = `${TMDB_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=${page}`;
    
    const response = await fetch(url, tmdbOptions);
    
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Cache movies in background (don't wait)
    if (data.results?.length > 0) {
      data.results.slice(0, 5).forEach(movie => {
        cacheMovie(movie, (err) => {
          if (err) console.error('Cache error:', err);
        });
      });
    }
    
    res.json(data);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      error: { message: 'Failed to search movies' }
    });
  }
});

// Discover popular movies
router.get('/discover', async (req, res) => {
  try {
    const { page = 1 } = req.query;
    
    const url = `${TMDB_BASE_URL}/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc`;
    
    const response = await fetch(url, tmdbOptions);
    
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Cache popular movies in background
    if (data.results?.length > 0) {
      data.results.slice(0, 10).forEach(movie => {
        cacheMovie(movie, (err) => {
          if (err) console.error('Cache error:', err);
        });
      });
    }
    
    res.json(data);
  } catch (error) {
    console.error('Discover error:', error);
    res.status(500).json({
      error: { message: 'Failed to discover movies' }
    });
  }
});

module.exports = router;