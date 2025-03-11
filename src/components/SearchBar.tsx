
import React, { useState } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  onSearch: (query: string) => void;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, className }) => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  const clearSearch = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <div 
      className={cn(
        "relative transition-all duration-200 ease-in-out",
        "max-w-md w-full",
        isFocused ? "scale-[1.02]" : "scale-100",
        className
      )}
    >
      <div 
        className={cn(
          "flex items-center h-10 w-full rounded-full",
          "bg-white/80 backdrop-blur-md border border-gray-200/50",
          "shadow-sm transition-all duration-200",
          isFocused ? "ring-2 ring-apple-blue/30 border-apple-blue/20" : "hover:border-gray-300/70"
        )}
      >
        <Search 
          size={18} 
          className={cn(
            "ml-3 transition-colors duration-200",
            isFocused ? "text-apple-blue" : "text-gray-400"
          )} 
        />
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search leads..."
          className="h-full flex-1 px-3 py-2 bg-transparent border-none outline-none text-sm text-gray-800 placeholder-gray-400"
        />
        {query && (
          <button 
            onClick={clearSearch}
            className="mr-2 p-1 rounded-full hover:bg-gray-200/70 text-gray-400 hover:text-gray-600 transition-colors duration-150"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
