import { useState } from 'react'
import { useMutation, useSubscription } from '@apollo/client'
import { ADD_BOOK, ALL_BOOKS_GENRE, BOOK_ADDED_SUBSCRIPTION } from '../queries'

const NewBook = () => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const [addBook] = useMutation(ADD_BOOK, {
    update: (cache, { data: { addBook } }) => {
      const allGenres = [...addBook.genres, null]
      allGenres.forEach(g => {
        try {
          const dataInCache = cache.readQuery({
            query: ALL_BOOKS_GENRE,
            variables: { genre: g }
          })

          if (!dataInCache.allBooks.find(b => b.id === addBook.id)) {
            cache.writeQuery({
              query: ALL_BOOKS_GENRE,
              variables: { genre: g },
              data: {
                allBooks: dataInCache.allBooks.concat(addBook)
              }
            })
          }
        } catch (error) {
          console.error('Error ', error)
        }
      })
    }
  })

  // Suscripción a bookAdded
  useSubscription(BOOK_ADDED_SUBSCRIPTION, {
    onData: ({ data }) => {
      const newBook = data.data.bookAdded
      alert(`Nuevo libro agregado: ${newBook.title}`)
    }
  })

  const submit = async (event) => {
    event.preventDefault()
    addBook({ variables: { title, author, published: Number(published), genres } })

    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <h2>Add Book</h2>
      <form onSubmit={submit}>
        <div>
          Title <input value={title} onChange={({ target }) => setTitle(target.value)} />
        </div>
        <div>
          Author <input value={author} onChange={({ target }) => setAuthor(target.value)} />
        </div>
        <div>
          Published <input value={published} onChange={({ target }) => setPublished(target.value)} />
        </div>
        <div>
          <input value={genre} onChange={({ target }) => setGenre(target.value)} />
          <button type="button" onClick={addGenre}>add genre</button>
        </div>
        <div>
          Genres: {genres.join(', ')}
        </div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook
