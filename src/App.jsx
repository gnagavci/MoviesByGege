import { useState, useEffect } from "react";
import { useDebounce } from "react-use";
import { fetchMovies, getTrendingMovies, updateSearchCount } from "./services/api";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";

///////// MAIN APP COMPONENT ///////////

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [trendingMovies, setTrendingMovies] = useState([]);

  const fetchMoviesFromAPI = async (query = '') => {
    setIsLoading(true);
    setErrorMessage("");
  
    try {
      const data = await fetchMovies(query);
      
      console.log("This is data:");
      console.log(data);
  
      setMovieList(data.results || []);

      // Update search count only when there's a query and results
      if(query && data.results?.length > 0){
        await updateSearchCount(query, data.results[0]);
      }

    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage("Error fetching movies. Please try again later!");
    } finally {
      setIsLoading(false);
    }
  };
  
  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
    } catch (error) {
      console.error(`Error fetching trending movies: ${error}`);
    }
  }

  useDebounce(() => {setDebouncedSearchTerm(searchTerm)}, 500, [searchTerm]);  
  
  useEffect(() => {
    fetchMoviesFromAPI(debouncedSearchTerm);
  }, [debouncedSearchTerm]);
  
  useEffect(() => {
    loadTrendingMovies();
  }, [])
  
  return (
    <main>
      <div className="pattern" />

      <div className="wrapper">
        <header>
          <img src="/hero.png" alt="Hero Banner" />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy
            Without the Hassle
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>
        
        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>

            <ul>
            {trendingMovies.map((movie, index) => (
              <li key={movie.$id}>
                  <p>{index+1}</p>
                  <img 
                    src={movie.poster_url || "/no-movie.png"} 
                    alt={movie.searchTerm}
                    onError={(e) => {
                      e.target.src = "/no-movie.png";
                    }}
                  />
              </li>
            ))}
            </ul>
          </section> 
        )}

        <section className="all-movies">
          <h2>All movies</h2>
          {isLoading ? (<Spinner />) : errorMessage ? ( <p className="text-red-500">{errorMessage}</p>) : 
          (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default App;