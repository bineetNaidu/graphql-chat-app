const { MessageResolvers } = require('./messages');
const { ReactionResolvers } = require('./reactions');
const { UserResolvers } = require('./users');

const { User, Message } = require('../../models');

const resolvers = {
  Message: {
    createdAt: (parent) => parent.createdAt.toISOString(),
  },
  Reaction: {
    createdAt: (parent) => parent.createdAt.toISOString(),
    message: async (parent) => await Message.findByPk(parent.messageId),
    user: async (parent) =>
      await User.findByPk(parent.userId, {
        attributes: ['username', 'imageUrl', 'createdAt'],
      }),
  },
  User: {
    createdAt: (parent) => parent.createdAt.toISOString(),
  },
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
