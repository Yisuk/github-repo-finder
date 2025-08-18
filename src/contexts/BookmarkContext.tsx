import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import {
  getBookmarks,
  addBookmark,
  removeBookmark,
  isBookmarked,
  type BookmarkedRepository,
} from "../utils/bookmarks";

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

  const handleAddBookmark = (repo: BookmarkedRepository) => {
    const newBookmarks = addBookmark(repo);
    setBookmarks(newBookmarks);
  };

  const handleRemoveBookmark = (repoId: string) => {
    const newBookmarks = removeBookmark(repoId);
    setBookmarks(newBookmarks);
  };

  const checkIsBookmarked = (repoId: string) => {
    return isBookmarked(repoId);
  };

  const value: BookmarkContextType = {
    bookmarks,
    addBookmark: handleAddBookmark,
    removeBookmark: handleRemoveBookmark,
    isBookmarked: checkIsBookmarked,
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
