require('dotenv').config()
const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const { PubSub } = require('graphql-subscriptions')
const WebSocket = require('ws')
const http = require('http')
const fs = require('fs')
const path = require('path')

// Configurar PubSub para manejar las suscripciones
const pubsub = new PubSub()

// Define tu schema (Asegúrate de que contenga la suscripción bookAdded)
const typeDefs = fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf8')
const resolvers = require('./resolvers')
const User = require('./models/user')

// Conexión a MongoDB
console.log('Conectando a MongoDB...')
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error de conexión:', err.message))

// Crear servidor HTTP para manejar WebSocket
const serverHttp = http.createServer()

// Crear instancia de ApolloServer
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req.headers.authorization;
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      try {
        const token = auth.substring(7);
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const currentUser = await User.findById(decodedToken.id);
        return { currentUser };
      } catch (err) {
        return { currentUser: null };
      }
    }
    return {};
  },
  plugins: [
    {
      async serverWillStart() {
        return {
          async drainServer() {
            // El servidor está listo para manejar conexiones WebSocket
          },
        }
      },
    },
  ],
})

// Iniciar WebSocket para suscripciones
const startServer = async () => {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 }
  })
  console.log(`Servidor listo en ${url}`)

  // Configurar WebSocket para manejar las suscripciones
  const wsServer = new WebSocket.Server({
    server: serverHttp,
    path: '/graphql',
  })

  wsServer.on('connection', (socket) => {
    console.log('WebSocket conectado')
    socket.on('message', (message) => {
      console.log('Mensaje recibido:', message)
    })
  })

  // Iniciar el servidor HTTP
  serverHttp.listen(4001, () => {
    console.log('Servidor WebSocket escuchando en el puerto 4001')
  })
}

startServer()
