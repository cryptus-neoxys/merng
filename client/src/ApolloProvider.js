import {
  InMemoryCache,
  createHttpLink,
  ApolloProvider,
  ApolloClient,
} from "@apollo/client";
import { setContext } from "apollo-link-context";

import App from "./App";

const authLink = setContext(() => {
  const token = localStorage.getItem("jwtToken");
  return {
    headers: {
      authorization: token ? `Bearer ${token}` : ``,
    },
  };
});

const httpLink = createHttpLink({
  uri: "http://localhost:5000",
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  connectToDevTools: true,
});

export const AppoPro = () => (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
