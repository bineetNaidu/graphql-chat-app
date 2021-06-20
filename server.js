import path from 'path';
import fs from 'fs';
import { ApolloServer } from 'apollo-server';
import { resolvers } from './graphql/resolvers.js';

const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join('./graphql/schema.graphql'), 'utf8'),
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
