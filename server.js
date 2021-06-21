const path = require('path');
const fs = require('fs');
const { ApolloServer } = require('apollo-server');
const { resolvers } = require('./graphql/resolvers.js');
const { sequelize } = require('./models/index.js');
const { ctxMiddleware } = require('./utils/middlewares.js');

const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join('./graphql/schema.graphql'), 'utf8'),
  resolvers,
  context: ctxMiddleware,
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
  sequelize.authenticate().then(() => {
    console.log('DB connected!');
  });
});
