const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { gql } = require('graphql-tag');
const { GraphQLError } = require('graphql')

const { v1: uuid } = require('uuid')

let persons = [
  {
    name: "Arto Hellas",
    phone: "040-123543",
    street: "Tapiolankatu 5 A",
    city: "Espoo",
    id: "3d594650-3436-11e9-bc57-8b80ba54c431"
  },
  {
    name: "Matti Luukkainen",
    phone: "040-432342",
    street: "Malminkaari 10 A",
    city: "Helsinki",
    id: '3d599470-3436-11e9-bc57-8b80ba54c431'
  },
  {
    name: "Venla Ruuska",
    street: "Nallemäentie 22 C",
    city: "Helsinki",
    id: '3d599471-3436-11e9-bc57-8b80ba54c431'
  },
]

const books = [
    {
        title: 'El señor de los anillos',
        published: 1954,
        author: 'J.R.R. Tolkien',
        id: 'book-1'
    },
    {
        title: 'Fundación',
        published: 1951,
        author: 'Isaac Asimov',
        id: 'book-2'
    },
]
  
const authors = [
    {
        name: 'J.R.R. Tolkien',
        id: 'author-1'
    },
    {
        name: 'Isaac Asimov',
        id: 'author-2'
    },
]
  

const typeDefs = gql`

    type Person {
        name: String!
        phone: String
        address: Address!
        id: ID!
    }

    type Address {
        street: String!
        city: String! 
    }

    type Book {
        title: String!
        published: Int!
        author: String!
        id: ID!
    }

    type Author {
        name: String!
        id: ID!
        born: Int
        bookCount: Int!
    }

    enum YesNo {
        YES
        NO
    }

    type Query {
        personCount: Int!
        allPersons(phone: YesNo): [Person!]!
        findPerson(name: String!): Person
    }

    type Mutation {
        addPerson(
            name: String!
            phone: String
            street: String!
            city: String!
        ): Person
        editNumber(
            name: String!
            phone: String!
        ): Person
    }

    type Query {
        bookCount: Int!
        allBooks(author: String): [Book!]!
        allAuthors: [Author!]!
    }

    type Mutation {
        addBook(
            title: String!
            published: Int!
            author: String!
        ): Book

        editAuthor(
            name: String!
            setBornTo: Int!
        ): Author
    }

`

const resolvers = {
    Query: {
        personCount: () => persons.length,
        allPersons: (root, args) => {
          if (!args.phone) {
            return persons
          }
          const byPhone = (person) =>
            args.phone === 'YES' ? person.phone : !person.phone
          return persons.filter(byPhone)
        },
        findPerson: (root, args) =>
          persons.find(p => p.name === args.name),
        // bookCount: () => books.length,
        allBooks: (parent, args) => {
            if (!args.author) {
              return books
            }
          
            return books.filter(book => book.author === args.author)
        },
        allAuthors: () => authors,
    
    },

  Person: {
    address: (root) => {
      return { 
        street: root.street,
        city: root.city
      }
    }
  },

  Author: {
    bookCount: (parent) => {
      return books.filter(book => book.author === parent.name).length
    },
  },

  Mutation: {
    addPerson: (root, args) => {
        if (persons.find(p => p.name === args.name)) {
            throw new GraphQLError('Name must be unique', {
              extensions: {
                code: 'BAD_USER_INPUT',
                invalidArgs: args.name
              }
            })
          }

        const person = { ...args, id: uuid() }
        persons = persons.concat(person)
        return person
    },
    editNumber: (root, args) => {
        const person = persons.find(p => p.name === args.name)
        if (!person) {
          return null
        }
    
        const updatedPerson = { ...person, phone: args.phone }
        persons = persons.map(p => p.name === args.name ? updatedPerson : p)
        return updatedPerson
    },

    addBook: (parent, args) => {
        if (args.title.length < 5) {
          throw new GraphQLError('El título debe tener al menos 5 caracteres.', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.title,
            },
          })
        }
  
        if (args.author.length < 5) {
          throw new GraphQLError('El nombre del autor debe tener al menos 5 caracteres.', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.author,
            },
          })
        }
  
        const newBook = { ...args, id: uuid() }
        books.push(newBook)
  
        if (!authors.find(author => author.name === args.author)) {
          authors.push({ name: args.author, id: uuid() })
        }
  
        return newBook
    },

    editAuthor: (parent, args) => {
        const author = authors.find(a => a.name === args.name)
        if (!author) return null
      
        author.born = args.setBornTo
        return author
    }
      
    
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})