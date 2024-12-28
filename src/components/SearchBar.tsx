import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative max-w-2xl mx-auto">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 h-5 w-5" />
      <Input
        type="text"
        placeholder="Search for movies..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 py-6 text-lg bg-zinc-800/50 border-zinc-700/50 text-white placeholder:text-zinc-400 focus-visible:ring-purple-500 transition-colors"
      />
    </div>
  );
}