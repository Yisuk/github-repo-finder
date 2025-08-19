import { BookmarkIcon, TrashIcon, ReaderIcon } from "@radix-ui/react-icons";
import { useBookmarks } from "../contexts/BookmarkContext";

export default function Sidebar() {
  const { bookmarks, removeBookmark } = useBookmarks();
  return (
    <div className="w-80 h-full bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <BookmarkIcon className="w-5 h-5" />
          Bookmarks
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          {bookmarks.length} repositor{bookmarks.length !== 1 ? "ies" : "y"}{" "}
          saved
        </p>
      </div>

      <div className="flex-1 overflow-y-scroll">
        {bookmarks.length === 0 ? (
          <div className="p-2 text-center text-gray-500 mt-12">
            <div className="flex justify-center mb-2">
              <ReaderIcon className="w-5 h-5" />
            </div>
            <p className="text-sm mb-1">No bookmarks yet</p>
            <p className="text-xs text-gray-400">
              Add repositories to bookmarks
            </p>
          </div>
        ) : (
          <div className="p-2">
            {bookmarks.map((repo) => (
              <div
                key={repo.id}
                className="mb-3 p-3 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200 bg-gray-50"
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="flex-1 text-sm font-medium text-gray-900 truncate">
                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                      title={repo.name}
                    >
                      {repo.name}
                    </a>
                  </h3>

                  <button
                    onClick={() => removeBookmark(repo.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors duration-200"
                    title="Remove bookmark"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
