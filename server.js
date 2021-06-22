const path = require('path');
const fs = require('fs');
const { ApolloServer } = require('apollo-server');
const { resolvers } = require('./graphql/resolvers');
const { sequelize } = require('./models/index');
const { ctxMiddleware } = require('./utils/middlewares');

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
