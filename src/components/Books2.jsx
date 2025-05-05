import React, { useEffect, useState } from 'react';
import { ApolloClient, InMemoryCache, gql, WebSocketLink } from '@apollo/client';
import { createClient } from 'graphql-ws';

const client = new ApolloClient({
  link: new WebSocketLink(createClient({
    url: 'ws://localhost:4001',
  })),
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

const Books = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    client.subscribe({
      query: BOOK_ADDED_SUBSCRIPTION
    }).subscribe({
      next({ data }) {
        setBooks(prevBooks => [...prevBooks, data.bookAdded]);
      },
      error(err) {
        console.error('Error de suscripción:', err);
      }
    });
  }, []);

  return (
    <div>
      <h2>Libros</h2>
      <ul>
        {books.map((book, index) => (
          <li key={index}>
            {book.title} de {book.author}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Books;
