import { useState, useEffect } from 'react';

interface SearchInputProps {
  onSearch: (query: string) => void;
  loading?: boolean;
  initialQuery?: string;
}

export default function SearchInput({ onSearch, loading = false, initialQuery = '' }: SearchInputProps) {
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
    <div className="mb-8">
      <form onSubmit={handleSubmit} className="flex justify-center">
        <div className="flex gap-2 max-w-lg w-full md:flex-row flex-col">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search GitHub repositories..."
            className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg text-base transition-colors duration-300 focus:outline-none focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="px-6 py-3 bg-blue-500 text-white border-none rounded-lg text-base cursor-pointer transition-colors duration-300 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>
    </div>
  );
}