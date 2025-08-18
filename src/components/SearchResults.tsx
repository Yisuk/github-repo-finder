import { Suspense, useEffect, useCallback, useRef } from "react";
import { useLazyLoadQuery, usePaginationFragment } from "react-relay";
import { graphql } from "react-relay";
import { useVirtualizer } from '@tanstack/react-virtual';
import RepositoryCard from "./RepositoryCard";

import type { SearchResultsQuery } from "../__generated__/SearchResultsQuery.graphql";
import type { SearchResultsPaginationFragment$key } from "../__generated__/SearchResultsPaginationFragment.graphql";

const SearchRepositoriesQuery = graphql`
  query SearchResultsQuery($query: String!, $first: Int!, $after: String) {
    ...SearchResultsPaginationFragment
  }
`;

const SearchResultsPaginationFragment = graphql`
  fragment SearchResultsPaginationFragment on Query
  @refetchable(queryName: "SearchResultsPaginationQuery") {
    search(query: $query, type: REPOSITORY, first: $first, after: $after)
    @connection(key: "SearchResults_search") {
      repositoryCount
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          ... on Repository {
            id
            ...RepositoryCardFragment
          }
        }
      }
    }
  }
`;

interface SearchResultsProps {
  query: string;
}

type Repository = {
  id: string;
  readonly " $fragmentSpreads": any;
};

function SearchResultsContent({
  query,
}: SearchResultsProps) {
  const queryData = useLazyLoadQuery<SearchResultsQuery>(SearchRepositoriesQuery, {
    query,
    first: 30,
    after: null,
  });

  const { data, loadNext, hasNext, isLoadingNext } = usePaginationFragment<
    SearchResultsQuery,
    SearchResultsPaginationFragment$key
  >(SearchResultsPaginationFragment, queryData);

  const parentRef = useRef<HTMLDivElement>(null);

  const repositories = (data.search.edges || [])
    .map(edge => edge?.node)
    .filter((node): node is Repository => node != null && node.id != null);

  const loadMore = useCallback(() => {
    if (hasNext && !isLoadingNext) {
      loadNext(30);
    }
  }, [hasNext, isLoadingNext, loadNext]);

  const rowVirtualizer = useVirtualizer({
    count: repositories.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 200,
    overscan: 5,
  });

  useEffect(() => {
    const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse();
    
    if (!lastItem) return;
    
    if (
      lastItem.index >= repositories.length - 1 &&
      hasNext &&
      !isLoadingNext
    ) {
      loadMore();
    }
  }, [rowVirtualizer.getVirtualItems(), repositories.length, hasNext, isLoadingNext, loadMore]);

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
      <div 
        ref={parentRef}
        className="virtual-list-container"
        style={{
          height: '600px',
          overflow: 'auto',
        }}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualItem) => (
            <div
              key={virtualItem.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
                padding: '8px',
                boxSizing: 'border-box',
              }}
            >
              <RepositoryCard repository={repositories[virtualItem.index]} />
            </div>
          ))}
        </div>
        {isLoadingNext && (
          <div className="loading-more">
            <p>Loading more repositories...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchResults({
  query,
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
      <SearchResultsContent query={query} />
    </Suspense>
  );
}
