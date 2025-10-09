# Movie Search Application

A full-stack movie discovery platform built with modern web technologies, featuring real-time search, trending analytics, and comprehensive testing infrastructure.

## Technical Overview

**Full-Stack Architecture**
- **Frontend**: React 19 with Vite, TailwindCSS for styling, debounced search optimization
- **Backend**: Node.js/Express REST API with SQLite database for metrics tracking
- **External API**: Integration with The Movie Database (TMDB) API
- **Containerization**: Docker Compose for multi-service orchestration

## Key Features

**Core Functionality**
- Real-time movie search with 500ms debounce optimization
- Trending movies based on search frequency analytics
- SQLite-powered metrics tracking and data caching
- Responsive UI with loading states and error handling
- Fallback image handling for missing posters

**Architecture Highlights**
- RESTful API design with Express routing (`/api/movies`, `/api/metrics`)
- Database abstraction layer with callback-based async operations
- CORS-enabled backend with health check endpoints
- Background caching strategy for popular movies

## Testing Strategy

**Multi-Layer Test Coverage**
- **Unit Tests**: Component testing with Vitest and React Testing Library
- **API Tests**: Backend route testing with Jest and Supertest
- **E2E Tests**: Full user flow testing with Playwright
- **Performance Tests**: Render performance monitoring

**Test Execution**
```bash
# Frontend unit tests
npm test

# Backend unit tests
cd server && npm test

# E2E tests with Docker
npm run test:e2e

# All tests in Docker environment
npm run test:docker:all
```

## Quick Start

**Prerequisites**: Docker, Docker Compose, TMDB API key

**Development Setup**
```bash
# Clone and configure
git clone <repository-url>
cd MoviesByGege
echo "TMDB_API_KEY=your_api_key" > .env

# Start with Docker
docker-compose up

# Or run locally
npm install && cd server && npm install
npm run dev  # Frontend (port 5173)
cd server && npm run dev  # Backend (port 3001)
```

**Access Points**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001/api
- Health Check: http://localhost:3001/api/health

## Project Structure

```
├── src/                      # React frontend
│   ├── components/           # Reusable UI components
│   ├── services/api.js       # API client layer
│   └── tests/                # Frontend test suites
├── server/                   # Express backend
│   ├── routes/               # API endpoints
│   ├── db.js                 # Database layer
│   └── tests/                # Backend test suites
├── e2e/                      # Playwright E2E tests
├── docker-compose.yml        # Production services
└── docker-compose.test.yml   # Test infrastructure
```

## Technical Highlights

**Frontend Engineering**
- Custom debounce implementation using `react-use` for optimized API calls
- Centralized API service layer with error handling
- Component-based architecture with separation of concerns

**Backend Engineering**
- SQLite for lightweight, serverless data persistence
- Async database operations with callback pattern
- TMDB API integration with bearer token authentication
- Background caching strategy to reduce external API calls

**DevOps & Testing**
- Multi-stage Docker builds for frontend and backend
- Separate test environment with isolated network
- Health checks with retry logic for container orchestration
- Comprehensive test scripts for different testing layers

## API Endpoints

**Movies**
- `GET /api/movies/search?q={query}` - Search movies
- `GET /api/movies/discover?page={page}` - Discover popular movies

**Metrics**
- `GET /api/metrics/trending` - Get top 5 trending searches
- `POST /api/metrics/search` - Update search frequency

**Health**
- `GET /api/health` - Service health status

## Technologies

**Frontend**: React 19, Vite, TailwindCSS, React Use
**Backend**: Node.js, Express, SQLite3
**Testing**: Vitest, Jest, Playwright, React Testing Library, Supertest
**DevOps**: Docker, Docker Compose
**API**: The Movie Database (TMDB)


