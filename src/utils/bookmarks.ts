export interface BookmarkedRepository {
  id: string;
  name: string;
  url: string;
}

const BOOKMARKS_KEY = 'github-repo-bookmarks';

export const getBookmarks = (): BookmarkedRepository[] => {
  try {
    const bookmarks = localStorage.getItem(BOOKMARKS_KEY);
    return bookmarks ? JSON.parse(bookmarks) : [];
  } catch (error) {
    console.error('Error loading bookmarks:', error);
    return [];
  }
};

export const addBookmark = (repo: BookmarkedRepository): BookmarkedRepository[] => {
  try {
    const bookmarks = getBookmarks();
    const existingIndex = bookmarks.findIndex(b => b.id === repo.id);
    
    if (existingIndex === -1) {
      const newBookmarks = [...bookmarks, repo];
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(newBookmarks));
      return newBookmarks;
    }
    
    return bookmarks;
  } catch (error) {
    console.error('Error adding bookmark:', error);
    return getBookmarks();
  }
};

export const removeBookmark = (repoId: string): BookmarkedRepository[] => {
  try {
    const bookmarks = getBookmarks();
    const newBookmarks = bookmarks.filter(b => b.id !== repoId);
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(newBookmarks));
    return newBookmarks;
  } catch (error) {
    console.error('Error removing bookmark:', error);
    return getBookmarks();
  }
};

export const isBookmarked = (repoId: string): boolean => {
  try {
    const bookmarks = getBookmarks();
    return bookmarks.some(b => b.id === repoId);
  } catch (error) {
    console.error('Error checking bookmark status:', error);
    return false;
  }
};