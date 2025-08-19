import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

const BOOKMARKS_KEY = "github-repo-bookmarks";

export interface BookmarkedRepository {
  id: string;
  name: string;
  url: string;
}

const getBookmarks = (): BookmarkedRepository[] => {
  try {
    const bookmarks = localStorage.getItem(BOOKMARKS_KEY);
    return bookmarks ? JSON.parse(bookmarks) : [];
  } catch (error) {
    throw new Error(`Error loading bookmarks: ${error}`);
  }
};

interface BookmarkContextType {
  bookmarks: BookmarkedRepository[];
  addBookmark: (repo: BookmarkedRepository) => void;
  removeBookmark: (repoId: string) => void;
  isBookmarked: (repoId: string) => boolean;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(
  undefined
);

interface BookmarkProviderProps {
  children: ReactNode;
}

export function BookmarkProvider({ children }: BookmarkProviderProps) {
  const [bookmarks, setBookmarks] = useState<BookmarkedRepository[]>([]);

  useEffect(() => {
    setBookmarks(getBookmarks());
  }, []);

  const addBookmark = (repo: BookmarkedRepository) => {
    const existingIndex = bookmarks.findIndex((b) => b.id === repo.id);

    if (existingIndex !== -1) {
      return;
    }

    const newBookmarks = [...bookmarks, repo];
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(newBookmarks));
    setBookmarks(newBookmarks);
  };

  const removeBookmark = (repoId: string) => {
    const newBookmarks = bookmarks.filter((b) => b.id !== repoId);
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(newBookmarks));
    setBookmarks(newBookmarks);
  };

  const isBookmarked = (repoId: string): boolean => {
    return bookmarks.some((b) => b.id === repoId);
  };

  const value: BookmarkContextType = {
    bookmarks,
    addBookmark,
    removeBookmark,
    isBookmarked,
  };

  return (
    <BookmarkContext.Provider value={value}>
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmarks() {
  const context = useContext(BookmarkContext);
  if (context === undefined) {
    throw new Error("useBookmarks must be used within a BookmarkProvider");
  }
  return context;
}
