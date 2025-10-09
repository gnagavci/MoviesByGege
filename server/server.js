const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { initDatabase } = require('./db');


dotenv.config();


const moviesRouter = require('./routes/movies');
const metricsRouter = require('./routes/metrics');

// Load environment variables
dotenv.config();

console.log('🔍 Environment Debug:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('TMDB_API_KEY exists:', !!process.env.TMDB_API_KEY);
console.log('TMDB_API_KEY first 20 chars:', process.env.TMDB_API_KEY?.substring(0, 20));

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Initialize database
initDatabase();

// Health check endpoint (before other routes)
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'movie-app-backend',
    version: '1.0.0'
  });
});

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Routes
app.use('/api/movies', moviesRouter);
app.use('/api/metrics', metricsRouter);

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: { 
      message: 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { details: err.message })
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: { message: 'Route not found' } });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});