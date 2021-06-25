const { MessageResolvers } = require('./messages');
const { ReactionResolvers } = require('./reactions');
const { UserResolvers } = require('./users');

const resolvers = {
  Query: {
    ...UserResolvers.Query,
    ...MessageResolvers.Query,
    ...ReactionResolvers.Query,
  },
  Mutation: {
    ...UserResolvers.Mutation,
    ...MessageResolvers.Mutation,
    ...ReactionResolvers.Mutation,
  },
  Subscription: {
    ...MessageResolvers.Subscription,
  },
};

module.exports = { resolvers };
