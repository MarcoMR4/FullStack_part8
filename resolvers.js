const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('./models/user')
const { GraphQLError } = require('graphql')
const Book = require('./models/book')
const Author = require('./models/author')


const resolvers = {
  Query: {
    me: (root, args, context) => context.currentUser,
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
        if (args.genre) {
          return Book.find({ genres: { $in: [args.genre] } }).populate('author')
        }
        return Book.find({}).populate('author')
    },
    allAuthors: async () => Author.find({}),
    findAuthor: async (root, args) => {
        return Author.findOne({ name: args.name })
    }
  },
  Mutation: {
    createUser: async (root, args) => {
      const saltRounds = 10
      const passwordHash = await bcrypt.hash(args.password, saltRounds)

      const user = new User({ ...args, passwordHash })

      try {
        await user.save()
        return user
      }
       catch (error) {
        if (error.code === 11000) {
          throw new GraphQLError('User already in use', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.username,
              error
            }
          })
        }
        throw new GraphQLError('Error creating user', {
          extensions: {
            code: 'INTERNAL_SERVER_ERROR',
            error
          }
        })
      }
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })
      const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(args.password, user.passwordHash)

      if (!user || !passwordCorrect) {
        throw new Error('Wrong credentials')
      }

      const userForToken = {
        username: user.username,
        id: user._id
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    },

    addBook: async (root, args) => {
        let author = await Author.findOne({ name: args.author })
        if (!author) {
          author = new Author({ name: args.author })
          await author.save()
        }
  
        const book = new Book({
          title: args.title,
          published: args.published,
          author: author._id,
          genres: args.genres
        })
  
        await book.save()
        return book.populate('author')
    },
    addAuthor: async (root, args) => {
    const author = new Author({
        name: args.name,
        born: args.born
    })
    return author.save()
    },
    editAuthor: async (root, args) => {
        const author = await Author.findOneAndUpdate(
          { name: args.name },
          { name: args.newName },
          { new: true }
        )
        return author
    }
  }
}

module.exports = resolvers
