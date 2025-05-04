require('dotenv').config()
const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
// const typeDefs = require('./schema')
const resolvers = require('./resolvers')
const User = require('./models/user')
const fs = require('fs')
const path = require('path')

const typeDefs = fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf8')

console.log('Conectando a MongoDB...')
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error de conexión:', err.message))

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    console.log('Entra');
    const auth = req.headers.authorization;
    console.log("Authorization Header:", auth);  
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      try {
        const token = auth.substring(7);  
        console.log("Extracted Token:", token);  
  
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token:", decodedToken); 
  
        const currentUser = await User.findById(decodedToken.id);
        console.log("Current User:", currentUser); 
  
        return { currentUser };
      } catch (err) {
        console.error("Error al verificar el token:", err);
        return { currentUser: null };
      }
    }
    return {}; 
  }
  
})

startStandaloneServer(server, {
  listen: { port: 4000 }
}).then(({ url }) => {
  console.log(`Servidor listo en ${url}`)
})
