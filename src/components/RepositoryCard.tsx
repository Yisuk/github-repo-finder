import { graphql, useFragment } from "react-relay";

import type { RepositoryCardFragment$key } from "../__generated__/RepositoryCardFragment.graphql";

export const RepositoryCardFragment = graphql`
  fragment RepositoryCardFragment on Repository {
    id
    name
    description
    url
    stargazerCount
    forkCount
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

interface RepositoryCardProps {
  repository: RepositoryCardFragment$key;
}

export default function RepositoryCard({ repository }: RepositoryCardProps) {
  const data = useFragment(RepositoryCardFragment, repository);
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k";
    }
    return num.toString();
  };

  return (
    <div className="border border-gray-300 rounded-xl p-6 bg-white transition-shadow duration-300 hover:shadow-lg">
      <div className="flex justify-between items-start mb-4">
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
        <div className="flex items-center gap-1">
          <span className="text-base">⭐</span>
          <span>{formatNumber(data.stargazerCount)}</span>
        </div>
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
    </div>
  );
}
