import { useEffect, useState } from 'react'
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
  }

  return (
    <div>
      {token ? (
        <>
          <button onClick={logout}>logout</button>
          <button onClick={() => setView('books')}>Books</button>
          <button onClick={() => setView('authors')}>Authors</button>
          <button onClick={() => setView('newbook')}>Add New Book</button>
          
          {view === 'books' && <Books />}
          {view === 'authors' && <Authors />}
          {view === 'newbook' && <NewBook />}
        </>
      ) : (
        <LoginForm setToken={setToken} />
      )}
    </div>
  )
}

export default App
