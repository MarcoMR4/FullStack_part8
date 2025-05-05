import { useState, useEffect } from 'react'
import LoginForm from './components/LoginForm'
import NewBook from './components/NewBook'
import Books from './components/Books'
import Authors from './components/Authors'

const App = () => {
  const [token, setToken] = useState(null)
  const [view, setView] = useState('books')

  useEffect(() => {
    const token = localStorage.getItem('library-user-token')
    if (token) {
      setToken(token)
    }
  }, [])

  const logout = () => {
    setToken(null)
    localStorage.clear()
    setView('books')
  }

  return (
    <div>
      {token ? (
        <>
          <div>
            <button onClick={() => setView('books')}>Books</button>
            <button onClick={() => setView('authors')}>Authors</button>
            <button onClick={() => setView('add')}>New Book</button>
            <button onClick={logout}>Logout</button>
          </div>

          {view === 'books' && <Books />}
          {view === 'authors' && <Authors />}
          {view === 'add' && <NewBook />}
        </>
      ) : (
        <LoginForm setToken={setToken} />
      )}
    </div>
  )
}

export default App
