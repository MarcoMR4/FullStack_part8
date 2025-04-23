// src/App.jsx
import { useQuery } from '@apollo/client'
import { ALL_BOOKS, ALL_AUTHORS } from './queries'
import { useMutation } from '@apollo/client'
import { useState } from 'react'
import { EDIT_AUTHOR, ADD_BOOK } from './queries'

function App() {
  const booksResult = useQuery(ALL_BOOKS)
  const authorsResult = useQuery(ALL_AUTHORS)

  const [name, setName] = useState('')
  const [born, setBorn] = useState('')
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  
  const [addBook] = useMutation(ADD_BOOK, {
    refetchQueries: [{ query: ALL_BOOKS }],
  })
  

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  })

  if (booksResult.loading || authorsResult.loading) return <p>Loading...</p>
  if (booksResult.error) return <p>Error en libros: {booksResult.error.message}</p>
  if (authorsResult.error) return <p>Error en autores: {authorsResult.error.message}</p>

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name || !born) return

    editAuthor({
      variables: {
        name,
        setBornTo: parseInt(born),
      },
    })

    setName('')
    setBorn('')
  }

 

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  const submitBook = (e) => {
    e.preventDefault()

    addBook({
      variables: {
        title,
        author,
        published: parseInt(published),
        genres,
      },
    })

    setTitle('')
    setAuthor('')
    setPublished('')
    setGenres([])
    setGenre('')
  }

  return (
    <div>
      <h1>📚 Libros</h1>
      <ul>
        {booksResult.data.allBooks.map((book, index) => (
          <li key={index}>
            <strong>{book.title}</strong> — {book.author.name} ({book.published}) — Géneros: {book.genres.join(', ')}
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

      <h3>✏️ Editar año de nacimiento</h3>
      <form onSubmit={handleSubmit}>
        <div>
          Nombre:{' '}
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            list="author-names"
          />
          <datalist id="author-names">
            {authorsResult.data.allAuthors.map((a) => (
              <option key={a.name} value={a.name} />
            ))}
          </datalist>
        </div>
        <div>
          Año de nacimiento:{' '}
          <input
            type="number"
            value={born}
            onChange={(e) => setBorn(e.target.value)}
          />
        </div>
        <button type="submit">Actualizar</button>
      </form>

      <h3>📘 Agregar libro</h3>
      <form onSubmit={submitBook}>
        <div>
          Título:{' '}
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          Autor:{' '}
          <input value={author} onChange={(e) => setAuthor(e.target.value)} />
        </div>
        <div>
          Publicado:{' '}
          <input
            type="number"
            value={published}
            onChange={(e) => setPublished(e.target.value)}
          />
        </div>
        <div>
          Género:{' '}
          <input value={genre} onChange={(e) => setGenre(e.target.value)} />
          <button onClick={addGenre} type="button">
            Agregar género
          </button>
        </div>
        <div>Géneros: {genres.join(', ')}</div>
        <button type="submit">Crear libro</button>
      </form>

    </div>
  )
}

export default App
