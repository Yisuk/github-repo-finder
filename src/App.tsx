import { useState, useEffect } from "react";
import SearchInput from "./components/SearchInput";
import SearchResults from "./components/SearchResults";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const queryParam = urlParams.get("q");
    if (queryParam) {
      setSearchQuery(queryParam);
    }

    const handlePopState = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const queryParam = urlParams.get("q");
      setSearchQuery(queryParam || "");
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleSearch = async (query: string) => {
    setIsSearching(true);
    setSearchQuery(query);

    const url = new URL(window.location.href);
    if (query) {
      url.searchParams.set("q", query);
    } else {
      url.searchParams.delete("q");
    }
    window.history.pushState(null, "", url.toString());

    setIsSearching(false);
  };

  return (
    <div className="h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4">
        <header className="text-center py-8 border-b border-gray-200 mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            GitHub Repository Finder
          </h1>
          <p className="text-lg text-gray-600">
            Search and discover GitHub repositories
          </p>
        </header>

        <main className="w-full">
          <SearchInput
            onSearch={handleSearch}
            loading={isSearching}
            initialQuery={searchQuery}
          />
          <SearchResults query={searchQuery} />
        </main>
      </div>
    </div>
  );
}

export default App;
