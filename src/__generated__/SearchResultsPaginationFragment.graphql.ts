/**
 * @generated SignedSource<<b74eee32a7adaf02eb9c7da9cc5cc9e2>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type SearchResultsPaginationFragment$data = {
  readonly search: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly id?: string;
        readonly " $fragmentSpreads": FragmentRefs<"RepositoryCardFragment">;
      } | null | undefined;
    } | null | undefined> | null | undefined;
    readonly pageInfo: {
      readonly endCursor: string | null | undefined;
      readonly hasNextPage: boolean;
    };
    readonly repositoryCount: number;
  };
  readonly " $fragmentType": "SearchResultsPaginationFragment";
};
export type SearchResultsPaginationFragment$key = {
  readonly " $data"?: SearchResultsPaginationFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"SearchResultsPaginationFragment">;
};

import SearchResultsPaginationQuery_graphql from './SearchResultsPaginationQuery.graphql';

const node: ReaderFragment = (function(){
var v0 = [
  "search"
];
return {
  "argumentDefinitions": [
    {
      "kind": "RootArgument",
      "name": "after"
    },
    {
      "kind": "RootArgument",
      "name": "first"
    },
    {
      "kind": "RootArgument",
      "name": "query"
    }
  ],
  "kind": "Fragment",
  "metadata": {
    "connection": [
      {
        "count": "first",
        "cursor": "after",
        "direction": "forward",
        "path": (v0/*: any*/)
      }
    ],
    "refetch": {
      "connection": {
        "forward": {
          "count": "first",
          "cursor": "after"
        },
        "backward": null,
        "path": (v0/*: any*/)
      },
      "fragmentPathInResult": [],
      "operation": SearchResultsPaginationQuery_graphql
    }
  },
  "name": "SearchResultsPaginationFragment",
  "selections": [
    {
      "alias": "search",
      "args": [
        {
          "kind": "Variable",
          "name": "query",
          "variableName": "query"
        },
        {
          "kind": "Literal",
          "name": "type",
          "value": "REPOSITORY"
        }
      ],
      "concreteType": "SearchResultItemConnection",
      "kind": "LinkedField",
      "name": "__SearchResults_search_connection",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "repositoryCount",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "PageInfo",
          "kind": "LinkedField",
          "name": "pageInfo",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "hasNextPage",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "endCursor",
              "storageKey": null
            }
          ],
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "SearchResultItemEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": null,
              "kind": "LinkedField",
              "name": "node",
              "plural": false,
              "selections": [
                {
                  "kind": "InlineFragment",
                  "selections": [
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "id",
                      "storageKey": null
                    },
                    {
                      "args": null,
                      "kind": "FragmentSpread",
                      "name": "RepositoryCardFragment"
                    }
                  ],
                  "type": "Repository",
                  "abstractKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "__typename",
                  "storageKey": null
                }
              ],
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "cursor",
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Query",
  "abstractKey": null
};
})();

(node as any).hash = "d64d350bc51feb7329aaf5d7ef3e971b";

export default node;
