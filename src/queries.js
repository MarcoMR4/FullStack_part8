import { gql } from '@apollo/client'

export const ALL_BOOKS = gql`
  query {
    allBooks {
        id
      title
      published
      genres
      author {
        name
      }
    }
  }
`


export const ALL_BOOKS_GENRE = gql`
  query allBooks($genre: String) {
    allBooks(genre: $genre) {
      id
      title
      author {
        name
      }
      published
      genres
    }
  }
`


export const ADD_BOOK = gql`
  mutation addBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
    addBook(
      title: $title,
      author: $author,
      published: $published,
      genres: $genres
    ) {
      title
      author {
        name
      }
      published
      genres
    }
  }
`

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
    }
  }
`

export const EDIT_BOOK = gql`
  mutation EditBook($id: ID!, $title: String, $author: String, $published: Int, $genres: [String!]) {
    editBook(id: $id, title: $title, author: $author, published: $published, genres: $genres) {
      id
      title
      author {
        name
      }
      published
      genres
    }
  }
`
export const BOOK_ADDED_SUBSCRIPTION = gql`
  subscription {
    bookAdded {
      title
      author {
        name
      }
      published
      genres
    }
  }
`
