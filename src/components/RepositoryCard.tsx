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
    <div className="repository-card">
      <div className="repo-header">
        <div className="repo-info">
          <h3 className="repo-name">
            <a href={data.url} target="_blank" rel="noopener noreferrer">
              {data.owner.login}/{data.name}
            </a>
          </h3>
          {data.description && (
            <p className="repo-description">{data.description}</p>
          )}
        </div>
        <img
          src={data.owner.avatarUrl}
          alt={`${data.owner.login} avatar`}
          className="owner-avatar"
        />
      </div>

      <div className="repo-stats">
        <div className="stat">
          <span className="stat-icon">⭐</span>
          <span>{formatNumber(data.stargazerCount)}</span>
        </div>
        <div className="stat">
          <span className="stat-icon">🍴</span>
          <span>{formatNumber(data.forkCount)}</span>
        </div>
        {data.primaryLanguage && (
          <div className="stat">
            <span
              className="language-color"
              style={{
                backgroundColor: data.primaryLanguage.color || undefined,
              }}
            ></span>
            <span>{data.primaryLanguage.name}</span>
          </div>
        )}
        <div className="stat">
          <span className="stat-label">Updated:</span>
          <span>{formatDate(data.updatedAt)}</span>
        </div>
      </div>
    </div>
  );
}
