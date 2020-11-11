import {
  InMemoryCache,
  createHttpLink,
  ApolloProvider,
  ApolloClient,
} from "@apollo/client";

import App from "./App";

const httpLink = createHttpLink({
  uri: "http://localhost:5000",
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export const AppoPro = () => (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
