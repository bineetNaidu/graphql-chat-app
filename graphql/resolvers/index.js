const { MessageResolvers } = require('./messages');
const { UserResolvers } = require('./users');

const resolvers = {
  Query: {
    ...UserResolvers.Query,
    ...MessageResolvers.Query,
  },
  Mutation: {
    ...UserResolvers.Mutation,
    ...MessageResolvers.Mutation,
  },
};

module.exports = { resolvers };
