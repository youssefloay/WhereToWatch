import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, Star, Monitor } from "lucide-react";
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
}

interface WatchProviders {
  flatrate?: WatchProvider[];
  rent?: WatchProvider[];
  buy?: WatchProvider[];
}

export function MovieDialog({ movie, isOpen, onClose }: MovieDialogProps) {
  const [watchProviders, setWatchProviders] = useState<WatchProviders | null>(null);
  const [userCountry, setUserCountry] = useState<string>("US");

  useEffect(() => {
    if (movie?.id) {
      // Fetch user's country based on IP
      fetch("https://ipapi.co/json/")
        .then((res) => res.json())
        .then((data) => setUserCountry(data.country_code))
        .catch(() => setUserCountry("US")); // Default to US if country detection fails

      // Fetch watch providers
      fetch(
        `https://api.themoviedb.org/3/movie/${movie.id}/watch/providers?api_key=${TMDB_API_KEY}`
      )
        .then((res) => res.json())
        .then((data) => {
          const countryData = data.results[userCountry];
          if (countryData) {
            setWatchProviders(countryData);
          }
        })
        .catch((error) => console.error("Error fetching watch providers:", error));
    }
  }, [movie?.id, userCountry]);

  if (!movie) return null;

  const renderProviders = (providers: WatchProvider[] | undefined, title: string) => {
    if (!providers?.length) return null;
    return (
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-zinc-400">{title}</h4>
        <div className="flex flex-wrap gap-2">
          {providers.map((provider) => (
            <div
              key={provider.provider_name}
              className="flex flex-col items-center gap-1"
            >
              <img
                src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                alt={provider.provider_name}
                className="w-8 h-8 rounded-full"
                title={provider.provider_name}
              />
              <span className="text-xs text-zinc-400">{provider.provider_name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-zinc-900 text-white border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{movie.title}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative aspect-[2/3]">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="rounded-lg w-full h-full object-cover"
            />
          </div>
          <div className="space-y-4">
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
              <div className="space-y-4 mt-4 pt-4 border-t border-zinc-800">
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