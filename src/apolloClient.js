import { ApolloClient, InMemoryCache, gql, WebSocketLink } from '@apollo/client';
import { createClient } from 'graphql-ws';

const wsClient = createClient({
  url: 'ws://localhost:4001',
});

const client = new ApolloClient({
  link: new WebSocketLink(wsClient),
  cache: new InMemoryCache(),
});

const BOOK_ADDED_SUBSCRIPTION = gql`
  subscription {
    bookAdded {
      title
      author
      published
    }
  }
`;

client.subscribe({
  query: BOOK_ADDED_SUBSCRIPTION
}).subscribe({
  next({ data }) {
    const { bookAdded } = data;
    alert(`Nuevo libro añadido: ${bookAdded.title} de ${bookAdded.author}`);
  },
  error(err) {
    console.error('Error de suscripción:', err);
  }
});
