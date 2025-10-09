// Simple API service to replace direct TMDB and Appwrite calls

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

/**
 * Fetch movies from server (replaces direct TMDB calls)
 */
export async function fetchMovies(query = '') {
  try {
    const endpoint = query 
      ? `/movies/search?q=${encodeURIComponent(query)}`
      : '/movies/discover';
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Fetch movies error:', error);
    throw error;
  }
}

/**
 * Get trending searches (replaces Appwrite getTrendingMovies)
 */
export async function getTrendingMovies() {
  try {
    const response = await fetch(`${API_BASE_URL}/metrics/trending`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.documents; // Match Appwrite format
  } catch (error) {
    console.error('Get trending error:', error);
    throw error;
  }
}

/**
 * Update search count (replaces Appwrite updateSearchCount)
 */
export async function updateSearchCount(searchTerm, movie) {
  try {
    const response = await fetch(`${API_BASE_URL}/metrics/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ searchTerm, movie }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Update search count error:', error);
    // Don't throw - this is not critical for user experience
  }
}