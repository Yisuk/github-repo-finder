import { Suspense, useEffect, useRef } from "react";
import { useLazyLoadQuery, usePaginationFragment } from "react-relay";
import { graphql } from "react-relay";
import { useVirtualizer } from "@tanstack/react-virtual";
import RepositoryCard from "./RepositoryCard";

import type { SearchResultsQuery } from "../../__generated__/SearchResultsQuery.graphql";
import type { SearchResultsPaginationFragment$key } from "../../__generated__/SearchResultsPaginationFragment.graphql";

const SearchRepositoriesQuery = graphql`
  query SearchResultsQuery($query: String!, $first: Int!, $after: String) {
    ...SearchResultsPaginationFragment
  }
`;

const SearchResultsPaginationFragment = graphql`
  fragment SearchResultsPaginationFragment on Query
  @refetchable(queryName: "SearchResultsPaginationQuery") {
    search(query: $query, type: REPOSITORY, first: $first, after: $after)
      @connection(key: "SearchResultsPaginationFragment_search") {
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

const PAGE_SIZE = 30;

function SearchResultsContent({ query }: SearchResultsProps) {
  const queryData = useLazyLoadQuery<SearchResultsQuery>(
    SearchRepositoriesQuery,
    {
      query,
      first: PAGE_SIZE,
      after: null,
    }
  );

  const { data, loadNext, hasNext, isLoadingNext } = usePaginationFragment<
    SearchResultsQuery,
    SearchResultsPaginationFragment$key
  >(SearchResultsPaginationFragment, queryData);

  const parentRef = useRef<HTMLDivElement>(null);

  const repositories = (data.search.edges || [])
    .map((edge) => edge?.node)
    .filter((node): node is Repository => node != null && node.id != null);

  const rowVirtualizer = useVirtualizer({
    count: repositories.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 208,
    overscan: 5,
    gap: 16,
  });

  useEffect(() => {
    const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse();

    if (!lastItem) return;

    if (
      lastItem.index >= repositories.length - 1 &&
      hasNext &&
      !isLoadingNext
    ) {
      loadNext(PAGE_SIZE);
    }
  }, [
    rowVirtualizer.getVirtualItems(),
    repositories.length,
    hasNext,
    isLoadingNext,
    loadNext,
  ]);

  return repositories.length === 0 ? (
    <div className="text-center py-8 text-gray-600">
      <p>No repositories found for "{query}"</p>
    </div>
  ) : (
    <div className="w-full">
      <p className="mb-4 text-gray-600">
        Found {data.search.repositoryCount.toLocaleString()} repositories
      </p>
      <div
        ref={parentRef}
        className="border border-gray-300 rounded-lg bg-white overflow-auto h-[500px]"
      >
        <div
          className="w-full relative"
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualItem) => (
            <div
              key={virtualItem.key}
              className="absolute top-0 left-0 w-full p-2 box-border"
              style={{
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <RepositoryCard repository={repositories[virtualItem.index]} />
            </div>
          ))}
        </div>
        {isLoadingNext && (
          <div className="text-center p-4 text-gray-600 text-sm bg-white bg-opacity-80 border-t border-gray-300 sticky bottom-0">
            <p>Loading more repositories</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchResults({ query }: SearchResultsProps) {
  if (!query) {
    return (
      <div className="text-center py-12 text-gray-600">
        <p className="text-lg">
          Enter a search term to find GitHub repositories
        </p>
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="text-center py-8 text-gray-600 text-lg">
          Searching repositories
        </div>
      }
    >
      <SearchResultsContent query={query} />
    </Suspense>
  );
}
