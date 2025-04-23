import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from './queries'
import { useState } from 'react'

const Books = () => {
  const [genre, setGenre] = useState(null)
  const { loading, data } = useQuery(ALL_BOOKS, {
    variables: { genre },
  })

  if (loading) return <p>Cargando libros...</p>

  const books = data.allBooks

  // Extraer todos los géneros únicos
  const allGenres = [...new Set(books.flatMap(b => b.genres))]

  return (
    <div>
      <h2>📚 Libros</h2>
      {genre && <p>Filtrado por género: <b>{genre}</b></p>}

      <table>
        <thead>
          <tr>
            <th>Título</th>
            <th>Autor</th>
            <th>Publicado</th>
          </tr>
        </thead>
        <tbody>
          {books.map(b => (
            <tr key={b.title}>
              <td>{b.title}</td>
              <td>{b.author}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: '1rem' }}>
        <button onClick={() => setGenre(null)}>Todos los géneros</button>
        {allGenres.map(g => (
          <button key={g} onClick={() => setGenre(g)}>
            {g}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Books;