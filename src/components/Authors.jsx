import { useQuery } from '@apollo/client'
import { ALL_AUTHORS } from '../queries'

const Authors = () => {
  const { loading, error, data } = useQuery(ALL_AUTHORS)

  if (loading) return <p>Loading authors...</p>
  if (error) return <p>Error loading authors: {error.message}</p>

  return (
    <div>
      <h2>Authors</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Born</th>
            {/* <th>Books</th> */}
          </tr>
        </thead>
        <tbody>
          {data.allAuthors.map((author) => (
            <tr key={author.name}>
              <td>{author.name}</td>
              <td>{author.born}</td>
              {/* <td>{author.bookCount}</td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Authors
