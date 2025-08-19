/**
 * @generated SignedSource<<d8f06f8d1a52edb54fd819ace622f0ba>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type RepositoryCardRemoveStarMutation$variables = {
  repositoryId: string;
};
export type RepositoryCardRemoveStarMutation$data = {
  readonly removeStar: {
    readonly starrable: {
      readonly id: string;
      readonly stargazerCount: number;
      readonly viewerHasStarred: boolean;
    } | null | undefined;
  } | null | undefined;
};
export type RepositoryCardRemoveStarMutation = {
  response: RepositoryCardRemoveStarMutation$data;
  variables: RepositoryCardRemoveStarMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "repositoryId"
  }
],
v1 = [
  {
    "fields": [
      {
        "kind": "Variable",
        "name": "starrableId",
        "variableName": "repositoryId"
      }
    ],
    "kind": "ObjectValue",
    "name": "input"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "viewerHasStarred",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "stargazerCount",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "RepositoryCardRemoveStarMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "RemoveStarPayload",
        "kind": "LinkedField",
        "name": "removeStar",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": null,
            "kind": "LinkedField",
            "name": "starrable",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              (v4/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "RepositoryCardRemoveStarMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "RemoveStarPayload",
        "kind": "LinkedField",
        "name": "removeStar",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": null,
            "kind": "LinkedField",
            "name": "starrable",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "__typename",
                "storageKey": null
              },
              (v2/*: any*/),
              (v3/*: any*/),
              (v4/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "d9635f1bd18d02039daa7021e92e264e",
    "id": null,
    "metadata": {},
    "name": "RepositoryCardRemoveStarMutation",
    "operationKind": "mutation",
    "text": "mutation RepositoryCardRemoveStarMutation(\n  $repositoryId: ID!\n) {\n  removeStar(input: {starrableId: $repositoryId}) {\n    starrable {\n      __typename\n      id\n      viewerHasStarred\n      stargazerCount\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "9fa894b0624f145ee9059680f6f79e4a";

export default node;
