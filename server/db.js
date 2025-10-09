const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'movie_app.db');
const db = new sqlite3.Database(dbPath);

// Initialize database tables
function initDatabase() {
  db.serialize(() => {
    // Search metrics table (replaces Appwrite)
    db.run(`
      CREATE TABLE IF NOT EXISTS search_metrics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        searchTerm TEXT UNIQUE NOT NULL,
        count INTEGER DEFAULT 1,
        poster_url TEXT,
        movie_id INTEGER,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Movies cache table (for TMDB caching)
    db.run(`
      CREATE TABLE IF NOT EXISTS movies (
        id INTEGER PRIMARY KEY,
        title TEXT NOT NULL,
        overview TEXT,
        poster_url TEXT,
        release_date TEXT,
        vote_average REAL,
        language TEXT,
        cached_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('📄 Database initialized');
  });
}

// Get trending search terms (top 5)
function getTrendingSearches(callback) {
  const query = `
    SELECT searchTerm, count, poster_url, movie_id 
    FROM search_metrics 
    ORDER BY count DESC 
    LIMIT 5
  `;
  
  db.all(query, callback);
}

// Update search count (increment existing or create new)
function updateSearchCount(searchTerm, movie, callback) {
  const posterUrl = movie?.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;

  // Try to increment existing record
  db.run(
    `UPDATE search_metrics 
     SET count = count + 1, updated_at = CURRENT_TIMESTAMP 
     WHERE searchTerm = ?`,
    [searchTerm],
    function(err) {
      if (err) return callback(err);
      
      // If no rows were updated, insert new record
      if (this.changes === 0) {
        db.run(
          `INSERT INTO search_metrics (searchTerm, count, poster_url, movie_id) 
           VALUES (?, 1, ?, ?)`,
          [searchTerm, posterUrl, movie?.id || null],
          callback
        );
      } else {
        callback(null, { updated: true });
      }
    }
  );
}

// Cache movie data from TMDB
function cacheMovie(movie, callback) {
  const query = `
    INSERT OR REPLACE INTO movies 
    (id, title, overview, poster_url, release_date, vote_average, language, cached_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
  `;

  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;

  db.run(query, [
    movie.id,
    movie.title,
    movie.overview,
    posterUrl,
    movie.release_date,
    movie.vote_average,
    movie.original_language
  ], callback);
}

module.exports = {
  db,
  initDatabase,
  getTrendingSearches,
  updateSearchCount,
  cacheMovie
};