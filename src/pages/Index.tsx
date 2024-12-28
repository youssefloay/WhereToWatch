import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SearchBar } from "@/components/SearchBar";
import { MovieCard } from "@/components/MovieCard";
import { MovieDialog } from "@/components/MovieDialog";
import { useToast } from "@/components/ui/use-toast";

const TMDB_API_KEY = "1234567890abcdef"; // Replace with actual API key
const TMDB_API_URL = "https://api.themoviedb.org/3";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
}

const Index = () => {
  const [search, setSearch] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const { toast } = useToast();

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ["movies", search],
    queryFn: async () => {
      if (!search) return [];
      try {
        const response = await fetch(
          `${TMDB_API_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
            search
          )}`
        );
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to fetch movies");
        return data.results;
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch movies. Please try again.",
          variant: "destructive",
        });
        return [];
      }
    },
    enabled: search.length > 0,
  });

  const { data: movieDetails } = useQuery({
    queryKey: ["movie", selectedMovie?.id],
    queryFn: async () => {
      if (!selectedMovie?.id) return null;
      const response = await fetch(
        `${TMDB_API_URL}/movie/${selectedMovie.id}?api_key=${TMDB_API_KEY}`
      );
      return response.json();
    },
    enabled: !!selectedMovie?.id,
  });

  return (
    <div className="min-h-screen bg-moviebg text-white">
      <div className="container py-12 space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Movie Search
          </h1>
          <p className="text-lg text-gray-400">
            Discover thousands of movies at your fingertips
          </p>
        </div>

        <SearchBar value={search} onChange={setSearch} />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {isLoading ? (
            Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[2/3] rounded-lg bg-white/5 animate-pulse"
              />
            ))
          ) : (
            searchResults?.map((movie: Movie) => (
              <MovieCard
                key={movie.id}
                title={movie.title}
                posterPath={movie.poster_path}
                releaseDate={movie.release_date}
                voteAverage={movie.vote_average}
                onClick={() => setSelectedMovie(movie)}
              />
            ))
          )}
        </div>

        {!search && !searchResults?.length && (
          <div className="text-center text-gray-400 py-12">
            Start typing to search for movies
          </div>
        )}

        <MovieDialog
          movie={movieDetails}
          isOpen={!!selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      </div>
    </div>
  );
};

export default Index;