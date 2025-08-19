import { graphql, useFragment, useMutation } from "react-relay";
import { useState } from "react";
import { useBookmarks } from "../contexts/BookmarkContext";
import type { RepositoryCardFragment$key } from "../__generated__/RepositoryCardFragment.graphql";
import type { BookmarkedRepository } from "../utils/bookmarks";

export const RepositoryCardFragment = graphql`
  fragment RepositoryCardFragment on Repository {
    id
    name
    description
    url
    stargazerCount
    forkCount
    viewerHasStarred
    primaryLanguage {
      name
      color
    }
    owner {
      login
      avatarUrl
    }
    updatedAt
  }
`;

const AddStarMutation = graphql`
  mutation RepositoryCardAddStarMutation($repositoryId: ID!) {
    addStar(input: { starrableId: $repositoryId }) {
      starrable {
        id
        viewerHasStarred
        stargazerCount
      }
    }
  }
`;

const RemoveStarMutation = graphql`
  mutation RepositoryCardRemoveStarMutation($repositoryId: ID!) {
    removeStar(input: { starrableId: $repositoryId }) {
      starrable {
        id
        viewerHasStarred
        stargazerCount
      }
    }
  }
`;

interface RepositoryCardProps {
  repository: RepositoryCardFragment$key;
}

export default function RepositoryCard({ repository }: RepositoryCardProps) {
  const data = useFragment(RepositoryCardFragment, repository);
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();
  const [isStarring, setIsStarring] = useState(false);
  const [starError, setStarError] = useState('');
  
  const [addStar] = useMutation(AddStarMutation);
  const [removeStar] = useMutation(RemoveStarMutation);
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k";
    }
    return num.toString();
  };

  const bookmarked = isBookmarked(data.id);

  const handleBookmarkToggle = () => {
    if (bookmarked) {
      removeBookmark(data.id);
    } else {
      const bookmarkData: BookmarkedRepository = {
        id: data.id,
        name: `${data.owner.login}/${data.name}`,
        url: data.url,
      };
      addBookmark(bookmarkData);
    }
  };

  const handleStarToggle = () => {
    setIsStarring(true);
    setStarError('');

    const mutation = data.viewerHasStarred ? removeStar : addStar;
    
    mutation({
      variables: {
        repositoryId: data.id,
      },
      onCompleted: (response) => {
        setIsStarring(false);
        console.log('Star mutation completed:', response);
      },
      onError: (error) => {
        setIsStarring(false);
        setStarError(error.message || 'Failed to update star');
        console.error('Star mutation error:', error);
      },
    });
  };


  return (
    <>
      <div className="border border-gray-300 rounded-xl p-6 bg-white transition-shadow duration-300 hover:shadow-lg relative">
        <div className="absolute top-3 right-3">
          <button
            onClick={handleBookmarkToggle}
            className={`p-2 rounded-full transition-colors duration-200 ${
              bookmarked
                ? "text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                : "text-gray-400 hover:text-blue-500 hover:bg-blue-50"
            }`}
            title={bookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
          >
            <span className="text-lg">🔖</span>
          </button>
        </div>

        <div className="flex justify-between items-start mb-4 pr-12">
        <div className="flex-1 min-w-0">
          <h3 className="mb-2 text-xl font-semibold">
            <a
              href={data.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 no-underline font-semibold break-words hover:underline"
            >
              {data.owner.login}/{data.name}
            </a>
          </h3>
          {data.description && (
            <p className="m-0 text-gray-600 leading-relaxed text-sm">
              {data.description}
            </p>
          )}
        </div>
        <img
          src={data.owner.avatarUrl}
          alt={`${data.owner.login} avatar`}
          className="w-10 h-10 rounded-full ml-4 flex-shrink-0"
        />
      </div>

      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
        <button
          onClick={handleStarToggle}
          disabled={isStarring}
          className={`flex items-center gap-1 px-2 py-1 rounded transition-colors duration-200 ${
            data.viewerHasStarred
              ? "text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
              : "text-gray-600 hover:text-yellow-600 hover:bg-yellow-50"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          title={data.viewerHasStarred ? "Unstar repository" : "Star repository"}
        >
          <span className="text-base">{data.viewerHasStarred ? "⭐" : "☆"}</span>
          <span>{formatNumber(data.stargazerCount)}</span>
          {isStarring && <span className="text-xs ml-1">...</span>}
        </button>
        <div className="flex items-center gap-1">
          <span className="text-base">🍴</span>
          <span>{formatNumber(data.forkCount)}</span>
        </div>
        {data.primaryLanguage && (
          <div className="flex items-center gap-1">
            <span
              className="w-3 h-3 rounded-full inline-block"
              style={{
                backgroundColor: data.primaryLanguage.color || "#ccc",
              }}
            ></span>
            <span>{data.primaryLanguage.name}</span>
          </div>
        )}
        <div className="flex items-center gap-1">
          <span className="font-medium">Updated:</span>
          <span>{formatDate(data.updatedAt)}</span>
        </div>
      </div>
      
      {starError && (
        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          <p>{starError}</p>
        </div>
      )}
    </div>
    </>
  );
}
