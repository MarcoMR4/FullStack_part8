import { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'

const Books = () => {
  const [selectedGenre, setSelectedGenre] = useState('All')
  const [favoriteGenre, setFavoriteGenre] = useState(null)
  const { loading, data, error } = useQuery(ALL_BOOKS)

  useEffect(() => {
    const genre = localStorage.getItem('favorite-genre') 
    if (genre) {
      setFavoriteGenre(genre)
    }
  }, [])

  if (loading) return <p>Loading books...</p>
  if (error) return <p>Error fetching books</p>

  const filteredBooks = selectedGenre === 'All' && !favoriteGenre
  ? data.allBooks
  : data.allBooks.filter(book => 
      (selectedGenre !== 'All' ? book.genres.includes(selectedGenre) : true) && 
      (favoriteGenre ? book.genres.includes(favoriteGenre) : true)
    )

  const handleGenreChange = (event) => {
    setSelectedGenre(event.target.value)
  }

  const handleFavoriteGenreChange = (event) => {
    const genre = event.target.value
    setFavoriteGenre(genre)
    localStorage.setItem('favorite-genre', genre) // Guardar en localStorage (o en una base de datos)
  }

  return (
    <div>
      <h2>Books</h2>

      <select value={selectedGenre} onChange={handleGenreChange}>
        <option value="All">All Genres</option>
        <option value="Fiction">Fiction</option>
        <option value="Science">Science</option>
        <option value="Fantasy">Fantasy</option>
      </select>

      {/* Mostrar los libros filtrados */}
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Published</th>
            <th>Genres</th>
          </tr>
        </thead>
        <tbody>
          {filteredBooks.map((book) => (
            <tr key={book.title}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
              <td>{book.genres.join(', ')}</td> 
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Books
