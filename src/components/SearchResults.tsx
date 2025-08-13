import { Suspense } from "react";
import { useLazyLoadQuery } from "react-relay";
import { graphql } from "react-relay";
import RepositoryCard from "./RepositoryCard";

import type { SearchResultsQuery } from "../__generated__/SearchResultsQuery.graphql";

const SearchRepositoriesQuery = graphql`
  query SearchResultsQuery($query: String!, $first: Int!) {
    search(query: $query, type: REPOSITORY, first: $first) {
      repositoryCount
      nodes {
        ... on Repository {
          id
          ...RepositoryCardFragment
        }
      }
    }
  }
`;

interface SearchResultsProps {
  query: string;
  resultsPerPage?: number;
}

function SearchResultsContent({
  query,
  resultsPerPage = 20,
}: SearchResultsProps) {
  const data = useLazyLoadQuery<SearchResultsQuery>(SearchRepositoriesQuery, {
    query,
    first: resultsPerPage,
  });

  // Filter for Repository nodes only and use their IDs for keys
  const repositories = (data.search.nodes || []).filter(
    (node): node is NonNullable<typeof node> & { id: string } =>
      node != null && node.id != null
  );

  if (repositories.length === 0) {
    return (
      <div className="no-results">
        <p>No repositories found for "{query}"</p>
      </div>
    );
  }

  return (
    <div className="search-results">
      <div className="results-header">
        <p className="results-count">
          Found {data.search.repositoryCount.toLocaleString()} repositories
        </p>
      </div>
      <div className="repositories-grid">
        {repositories.map((repo) => (
          <RepositoryCard key={repo.id} repository={repo} />
        ))}
      </div>
    </div>
  );
}

export default function SearchResults({
  query,
  resultsPerPage,
}: SearchResultsProps) {
  if (!query) {
    return (
      <div className="search-placeholder">
        <p>Enter a search term to find GitHub repositories</p>
      </div>
    );
  }

  return (
    <Suspense
      fallback={<div className="loading">Searching repositories...</div>}
    >
      <SearchResultsContent query={query} resultsPerPage={resultsPerPage} />
    </Suspense>
  );
}
