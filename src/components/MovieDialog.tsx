import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, Star } from "lucide-react";

interface MovieDialogProps {
  movie: any;
  isOpen: boolean;
  onClose: () => void;
}

export function MovieDialog({ movie, isOpen, onClose }: MovieDialogProps) {
  if (!movie) return null;

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
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}