import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Star } from "lucide-react";

interface MovieCardProps {
  title: string;
  posterPath: string;
  releaseDate: string;
  voteAverage: number;
  onClick: () => void;
}

export function MovieCard({ title, posterPath, releaseDate, voteAverage, onClick }: MovieCardProps) {
  return (
    <Card 
      onClick={onClick}
      className="group movie-card cursor-pointer bg-zinc-900/50 border-zinc-800/50 hover:border-purple-500/50"
    >
      <img
        src={`https://image.tmdb.org/t/p/w500${posterPath}`}
        alt={title}
        className="w-full h-full object-cover"
      />
      <div className="movie-card-overlay p-4 flex flex-col justify-end">
        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
        <div className="flex items-center gap-2 text-sm text-zinc-300">
          <CalendarDays className="w-4 h-4" />
          <span>{new Date(releaseDate).getFullYear()}</span>
          <Star className="w-4 h-4 ml-2 text-yellow-400" />
          <span>{voteAverage.toFixed(1)}</span>
        </div>
      </div>
    </Card>
  );
}