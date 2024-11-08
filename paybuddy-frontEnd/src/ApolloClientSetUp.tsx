import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink  } from '@apollo/client';
import Cookies from 'js-cookie';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: 'http://localhost:3000/graphql', // Adjust the URI to your GraphQL endpoint
 credentials: 'include',
});

const authLink = setContext((_, { headers }) => {
  const token = Cookies.get('PayBuddy-Auth');
  console.log('Token:', token);
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

const ApolloClientSetup: React.FC<React.PropsWithChildren<object>> = ({ children }) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default ApolloClientSetup;