// src/App.jsx
import { useQuery } from '@apollo/client'
import { ALL_BOOKS, ALL_AUTHORS } from './queries'

function App() {
  const booksResult = useQuery(ALL_BOOKS)
  const authorsResult = useQuery(ALL_AUTHORS)

  if (booksResult.loading || authorsResult.loading) return <p>Loading...</p>
  if (booksResult.error) return <p>Error en libros: {booksResult.error.message}</p>
  if (authorsResult.error) return <p>Error en autores: {authorsResult.error.message}</p>

  return (
    <div>
      <h1>📚 Libros</h1>
      <ul>
        {booksResult.data.allBooks.map((book, index) => (
          <li key={index}>
            <strong>{book.title}</strong> — {book.author} ({book.published})
          </li>
        ))}
      </ul>

      <h2>👩‍🏫 Autores</h2>
      <ul>
        {authorsResult.data.allAuthors.map((author, index) => (
          <li key={index}>
            <strong>{author.name}</strong> — {author.bookCount} libros {author.born && `(nacido en ${author.born})`}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
