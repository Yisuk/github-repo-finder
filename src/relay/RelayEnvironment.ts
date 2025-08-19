import {
  Environment,
  Network,
  RecordSource,
  Store,
  type FetchFunction,
} from "relay-runtime";

const HTTP_ENDPOINT = "https://api.github.com/graphql";

const fetchGraphQL: FetchFunction = async (request, variables) => {
  const token = import.meta.env.VITE_GITHUB_TOKEN;

  if (!token) {
    throw new Error(
      "GitHub token is required. Please add VITE_GITHUB_TOKEN to your .env file."
    );
  }

  const resp = await fetch(HTTP_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "X-Github-Next-Global-ID": "1",
    },
    body: JSON.stringify({ query: request.text, variables }),
  });

  if (!resp.ok) {
    throw new Error(
      `GraphQL request failed: ${resp.status} ${resp.statusText}`
    );
  }

  const result = await resp.json();

  if (result.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
  }

  return result;
};

const environment = new Environment({
  network: Network.create(fetchGraphQL),
  store: new Store(new RecordSource()),
});

export default environment;
