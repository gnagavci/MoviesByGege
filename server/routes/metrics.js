const express = require('express');
const { getTrendingSearches, updateSearchCount } = require('../db');

const router = express.Router();

// Get trending searches (replaces Appwrite getTrendingMovies)
router.get('/trending', (req, res) => {
  getTrendingSearches((err, results) => {
    if (err) {
      console.error('Trending error:', err);
      return res.status(500).json({
        error: { message: 'Failed to get trending searches' }
      });
    }

    // Transform to match frontend expectations
    const documents = results.map(row => ({
      $id: row.id?.toString(),
      searchTerm: row.searchTerm,
      count: row.count,
      poster_url: row.poster_url,
      movie_id: row.movie_id
    }));

    res.json({ documents });
  });
});

// Update search count (replaces Appwrite updateSearchCount)
router.post('/search', (req, res) => {
  const { searchTerm, movie } = req.body;

  if (!searchTerm || searchTerm.trim() === '') {
    return res.status(400).json({
      error: { message: 'Search term is required' }
    });
  }

  updateSearchCount(searchTerm.trim(), movie, (err, result) => {
    if (err) {
      console.error('Update search count error:', err);
      return res.status(500).json({
        error: { message: 'Failed to update search count' }
      });
    }

    res.status(202).json({ 
      ok: true, 
      message: 'Search count updated',
      ...(result && { updated: result.updated })
    });
  });
});

module.exports = router;