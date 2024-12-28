import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SearchBar } from "@/components/SearchBar";
import { MovieCard } from "@/components/MovieCard";
import { MovieDialog } from "@/components/MovieDialog";
import { useToast } from "@/components/ui/use-toast";

const TMDB_API_KEY = "cf34ec67e2254a274416a11c1a30ba82";
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

  return (
    <div className="min-h-screen bg-[#121212]">
      <div className="gradient-bg">
        <div className="container py-24 space-y-12">
          <div className="text-center space-y-4 animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
              Discover Movies
            </h1>
            <p className="text-lg text-zinc-400">
              Search through millions of movies in our database
            </p>
          </div>

          <SearchBar value={search} onChange={setSearch} />

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {isLoading ? (
              Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[2/3] rounded-lg bg-zinc-800/50 animate-pulse"
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
            <div className="text-center text-zinc-500 py-12">
              Start typing to search for movies
            </div>
          )}

          <MovieDialog
            movie={selectedMovie}
            isOpen={!!selectedMovie}
            onClose={() => setSelectedMovie(null)}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;