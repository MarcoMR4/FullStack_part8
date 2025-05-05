import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { ALL_BOOKS_GENRE, EDIT_BOOK } from '../queries'

const Books = () => {
  const [selectedGenre, setSelectedGenre] = useState('All')
  const [editingBook, setEditingBook] = useState(null)

  const { loading, data, error, refetch } = useQuery(ALL_BOOKS_GENRE, {
    variables: { genre: selectedGenre === 'All' ? null : selectedGenre },
    fetchPolicy: 'cache-and-network'
  })

  const [editBook] = useMutation(EDIT_BOOK, {
    onCompleted: () => {
      setEditingBook(null)
      refetch()
    }
  })

  const handleGenreChange = (event) => {
    const newGenre = event.target.value
    setSelectedGenre(newGenre)
    refetch({ genre: newGenre === 'All' ? null : newGenre })
  }

  const startEdit = (book) => {
    setEditingBook({
      id: book.id,
      title: book.title,
      author: book.author.name,
      published: book.published,
      genres: book.genres
    })
  }

  const handleEditChange = (field, value) => {
    setEditingBook({ ...editingBook, [field]: value })
  }

  const saveEdit = (e) => {
    e.preventDefault()
    editBook({
      variables: {
        id: editingBook.id,
        title: editingBook.title,
        author: editingBook.author,
        published: Number(editingBook.published),
        genres: editingBook.genres
      }
    })
  }

  if (loading) return <p>Loading books...</p>
  if (error) return <p>Error fetching books</p>

  return (
    <div>
      <h2>Books</h2>

      <select value={selectedGenre} onChange={handleGenreChange}>
        <option value="All">All Genres</option>
        <option value="Fiction">Fiction</option>
        <option value="Science">Science</option>
        <option value="Fantasy">Fantasy</option>
        <option value="Drama">Drama</option>
      </select>

      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Published</th>
            <th>Genres</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.allBooks.map((book) => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
              <td>{book.genres.join(', ')}</td>
              <td>
                <button onClick={() => startEdit(book)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingBook && (
        <div>
          <h3>Edit Book</h3>
          <form onSubmit={saveEdit}>
            <div>
              Title: <input value={editingBook.title} onChange={(e) => handleEditChange('title', e.target.value)} />
            </div>
            <div>
              Author: <input value={editingBook.author} onChange={(e) => handleEditChange('author', e.target.value)} />
            </div>
            <div>
              Published: <input value={editingBook.published} onChange={(e) => handleEditChange('published', e.target.value)} />
            </div>
            <div>
              Genres: <input
                value={editingBook.genres.join(', ')}
                onChange={(e) => handleEditChange('genres', e.target.value.split(',').map(g => g.trim()))}
              />
            </div>
            <button type="submit">Save</button>
            <button type="button" onClick={() => setEditingBook(null)}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  )
}

export default Books
