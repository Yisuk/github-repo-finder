import { useState, useEffect } from "react";
import SearchInput from "./components/SearchInput";
import SearchResults from "./components/SearchResults";
import Sidebar from "./components/Sidebar";
import { BookmarkProvider } from "./contexts/BookmarkContext";
import { GitHubLogoIcon } from "@radix-ui/react-icons";

function App() {
  const [searchQuery, setSearchQuery] = useState("");

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
    setSearchQuery(query);

    const url = new URL(window.location.href);

    if (query && query !== url.searchParams.get("q")) {
      url.searchParams.set("q", query);
      window.history.pushState(null, "", url.toString());
      return;
    }
  };

  return (
    <BookmarkProvider>
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <div className="max-w-4xl mx-auto p-4 w-full">
            <div className="text-center py-8 border-b border-gray-200 mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 flex items-center justify-center gap-3">
                <GitHubLogoIcon className="w-10 h-10 text-gray-700" />
                GitHub Repository Finder
              </h1>
              <p className="text-lg text-gray-600">
                Search and discover GitHub repositories
              </p>
            </div>
            <div className="w-full">
              <div className="mb-8">
                <SearchInput
                  onSearch={handleSearch}
                  initialQuery={searchQuery}
                />
              </div>
              <SearchResults query={searchQuery} key={searchQuery} />
            </div>
          </div>
        </div>
      </div>
    </BookmarkProvider>
  );
}

export default App;
