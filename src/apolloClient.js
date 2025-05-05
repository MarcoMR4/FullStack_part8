import {
    ApolloClient, InMemoryCache, HttpLink, ApolloProvider, concat
  } from '@apollo/client'
  
  const authLink = (token) => ({
    setContext: (_, { headers }) => ({
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : null,
      }
    })
  })
  
  const createApolloClient = (token) =>
    new ApolloClient({
      cache: new InMemoryCache(),
      link: authLink(token).concat(
        new HttpLink({ uri: 'http://localhost:4000' })
      )
    })
  
  export default createApolloClient
  