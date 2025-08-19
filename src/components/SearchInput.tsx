import { useState, useEffect } from "react";

interface SearchInputProps {
  onSearch: (query: string) => void;
  initialQuery?: string;
}

export default function SearchInput({
  onSearch,
  initialQuery = "",
}: SearchInputProps) {
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex justify-center">
      <div className="flex gap-2 max-w-lg w-full md:flex-row flex-col">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search GitHub repositories"
          className="flex-1 p-2 border-2 border-gray-400 rounded-lg text-base transition-colors duration-300 focus:outline-none focus:border-black"
        />
        <button
          disabled={!query.trim()}
          className="px-4 py-2 bg-black text-white border-none rounded-lg text-base cursor-pointer transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
        >
          Search
        </button>
      </div>
    </form>
  );
}
