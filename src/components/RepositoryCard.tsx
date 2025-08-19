import { graphql, useFragment, useMutation } from "react-relay";
import {
  BookmarkIcon,
  BookmarkFilledIcon,
  StarIcon,
  StarFilledIcon,
  Share1Icon,
  EyeOpenIcon,
} from "@radix-ui/react-icons";
import {
  useBookmarks,
  type BookmarkedRepository,
} from "../contexts/BookmarkContext";

import type { RepositoryCardFragment$key } from "../__generated__/RepositoryCardFragment.graphql";

export const RepositoryCardFragment = graphql`
  fragment RepositoryCardFragment on Repository {
    id
    name
    description
    url
    stargazerCount
    forkCount
    viewerHasStarred
    watchers {
      totalCount
    }
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

const formatNumber = (num: number) => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "k";
  }
  return num.toString();
};

export default function RepositoryCard({ repository }: RepositoryCardProps) {
  const data = useFragment(RepositoryCardFragment, repository);

  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();

  const [addStar, isAddingStar] = useMutation(AddStarMutation);
  const [removeStar, isRemovingStar] = useMutation(RemoveStarMutation);

  const bookmarked = isBookmarked(data.id);

  const handleBookmarkToggle = () => {
    if (bookmarked) {
      removeBookmark(data.id);
      return;
    }

    const bookmarkData: BookmarkedRepository = {
      id: data.id,
      name: `${data.owner.login}/${data.name}`,
      url: data.url,
    };
    addBookmark(bookmarkData);
  };

  const handleStarToggle = () => {
    const mutation = data.viewerHasStarred ? removeStar : addStar;

    mutation({
      variables: {
        repositoryId: data.id,
      },
      onError: (error) => {
        window.alert("Failed to update star");
        throw new Error(error.message);
      },
    });
  };

  return (
    <div className="border border-gray-300 rounded-xl p-4 bg-white transition-shadow duration-300 hover:shadow-lg relative h-52 flex flex-col gap-4 justify-between">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img
            src={data.owner.avatarUrl}
            alt={`${data.owner.login} avatar`}
            className="w-10 h-10 rounded-full"
          />
          <h3 className="text-xl font-semibold">
            <a
              href={data.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 no-underline font-semibold break-words hover:underline"
            >
              {data.owner.login}/{data.name}
            </a>
          </h3>
        </div>
        <button
          onClick={handleBookmarkToggle}
          className={`p-2 rounded-full transition-colors duration-200 ${
            bookmarked
              ? "text-blue-500 hover:text-blue-600 hover:bg-blue-50"
              : "text-gray-400 hover:text-blue-500 hover:bg-blue-50"
          }`}
          title={bookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
        >
          {bookmarked ? (
            <BookmarkFilledIcon className="w-5 h-5" />
          ) : (
            <BookmarkIcon className="w-5 h-5" />
          )}
        </button>
      </div>
      <div className="flex-1">
        {data.description && (
          <p className="text-gray-600 text-start text-sm line-clamp-3">
            {data.description}
          </p>
        )}
      </div>
      <div className="flex flex-wrap gap-2 text-sm text-gray-600">
        {data.primaryLanguage && (
          <div className="flex items-center gap-1 p-1">
            <div
              className="w-3 h-3 rounded-full"
              style={{
                backgroundColor: data.primaryLanguage.color || "#ccc",
              }}
            ></div>
            <span>{data.primaryLanguage.name}</span>
          </div>
        )}
        <div className="flex items-center gap-1 p-1">
          <EyeOpenIcon className="w-4 h-4" />
          <span>{formatNumber(data.watchers.totalCount)}</span>
        </div>
        <div className="flex items-center gap-1 p-1">
          <Share1Icon className="w-4 h-4" />
          <span>{formatNumber(data.forkCount)}</span>
        </div>
        <button
          onClick={handleStarToggle}
          disabled={isAddingStar || isRemovingStar}
          className={`flex items-center gap-1 p-1 rounded transition-colors duration-200 ${
            data.viewerHasStarred
              ? "text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
              : "text-gray-600 hover:text-yellow-600 hover:bg-yellow-50"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          title={
            data.viewerHasStarred ? "Unstar repository" : "Star repository"
          }
        >
          {data.viewerHasStarred ? (
            <StarFilledIcon className="w-4 h-4" />
          ) : (
            <StarIcon className="w-4 h-4" />
          )}
          <span>{formatNumber(data.stargazerCount)}</span>
        </button>
        <div className="flex items-center gap-1 p-1">
          <span className="font-medium">Updated on</span>
          <span>{new Date(data.updatedAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}
