import { useState, useEffect } from "react";
import "./App.css";
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
    <div className="app">
      <header className="app-header">
        <h1>GitHub Repository Finder</h1>
        <p>Search and discover GitHub repositories</p>
      </header>

      <main className="app-main">
        <SearchInput
          onSearch={handleSearch}
          loading={isSearching}
          initialQuery={searchQuery}
        />
        <SearchResults query={searchQuery} />
      </main>
    </div>
  );
}

export default App;
