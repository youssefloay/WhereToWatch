import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, Star, Monitor, Play } from "lucide-react";
import { useState, useEffect } from "react";

const TMDB_API_KEY = "cf34ec67e2254a274416a11c1a30ba82";

interface MovieDialogProps {
  movie: any;
  isOpen: boolean;
  onClose: () => void;
}

interface WatchProvider {
  provider_name: string;
  logo_path: string;
  provider_id: number;
  display_priority: number;
  link?: string;
}

interface WatchProviders {
  flatrate?: WatchProvider[];
  rent?: WatchProvider[];
  buy?: WatchProvider[];
  link?: string;
}

export function MovieDialog({ movie, isOpen, onClose }: MovieDialogProps) {
  const [watchProviders, setWatchProviders] = useState<WatchProviders | null>(null);
  const [userCountry, setUserCountry] = useState<string>("US");
  const [trailerKey, setTrailerKey] = useState<string | null>(null);

  useEffect(() => {
    if (movie?.id) {
      // Fetch user's country based on IP
      fetch("https://ipapi.co/json/")
        .then((res) => res.json())
        .then((data) => setUserCountry(data.country_code))
        .catch(() => setUserCountry("US"));

      // Fetch watch providers
      fetch(
        `https://api.themoviedb.org/3/movie/${movie.id}/watch/providers?api_key=${TMDB_API_KEY}`
      )
        .then((res) => res.json())
        .then((data) => {
          const countryData = data.results[userCountry];
          if (countryData) {
            setWatchProviders({ ...countryData });
          }
        })
        .catch((error) => console.error("Error fetching watch providers:", error));

      // Fetch movie videos (trailers)
      fetch(
        `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${TMDB_API_KEY}`
      )
        .then((res) => res.json())
        .then((data) => {
          const trailer = data.results?.find(
            (video: any) =>
              video.type === "Trailer" && video.site === "YouTube"
          );
          if (trailer) {
            setTrailerKey(trailer.key);
          }
        })
        .catch((error) => console.error("Error fetching trailer:", error));
    }
  }, [movie?.id, userCountry]);

  if (!movie) return null;

  const renderProviders = (providers: WatchProvider[] | undefined, title: string) => {
    if (!providers?.length) return null;
    return (
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-zinc-400">{title}</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {providers.map((provider) => (
            <a
              key={provider.provider_name}
              href={watchProviders?.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-colors group"
            >
              <img
                src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                alt={provider.provider_name}
                className="w-12 h-12 rounded-lg group-hover:scale-110 transition-transform"
                title={provider.provider_name}
              />
              <span className="text-xs text-zinc-400 group-hover:text-white text-center">
                {provider.provider_name}
              </span>
            </a>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-zinc-900 text-white border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{movie.title}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="relative aspect-[2/3]">
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="rounded-lg w-full h-full object-cover"
              />
            </div>
            {trailerKey && (
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Play className="w-4 h-4" />
                  Watch Trailer
                </h3>
                <div className="relative aspect-video rounded-lg overflow-hidden">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${trailerKey}`}
                    title="Movie Trailer"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0"
                  ></iframe>
                </div>
              </div>
            )}
          </div>
          <div className="space-y-6">
            <p className="text-zinc-300">{movie.overview}</p>
            <div className="flex flex-wrap gap-2">
              {movie.genres?.map((genre: any) => (
                <Badge
                  key={genre.id}
                  className="bg-purple-500/20 text-purple-200 hover:bg-purple-500/30"
                >
                  {genre.name}
                </Badge>
              ))}
            </div>
            <div className="flex flex-col gap-2 text-sm text-zinc-400">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4" />
                <span>Release Date: {movie.release_date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4" />
                <span>Rating: {movie.vote_average.toFixed(1)}/10</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Runtime: {movie.runtime} minutes</span>
              </div>
            </div>

            {watchProviders && (
              <div className="space-y-4 pt-4 border-t border-zinc-800">
                <div className="flex items-center gap-2">
                  <Monitor className="w-4 h-4" />
                  <h3 className="font-semibold">Where to Watch</h3>
                </div>
                {renderProviders(watchProviders.flatrate, "Stream")}
                {renderProviders(watchProviders.rent, "Rent")}
                {renderProviders(watchProviders.buy, "Buy")}
                {!watchProviders.flatrate && !watchProviders.rent && !watchProviders.buy && (
                  <p className="text-sm text-zinc-400">
                    No streaming information available for your region.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}