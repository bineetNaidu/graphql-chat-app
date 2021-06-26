const { User, Message, Reaction } = require('../../models');
const { UserInputError, AuthenticationError } = require('apollo-server-errors');
const { withFilter } = require('apollo-server');
const { Op } = require('sequelize');

const MessageResolvers = {
  Query: {
    getMessages: async (_, { from }, { user: authUser }) => {
      try {
        if (!authUser) {
          throw new AuthenticationError('Not Authenticated');
        }
        const user = await User.findOne({
          where: { username: from },
        });
        if (!user) {
          throw new UserInputError('User Not found!');
        }

        const usernames = [authUser.username, user.username];
        const msg = await Message.findAll({
          where: {
            from: { [Op.in]: usernames },
            to: { [Op.in]: usernames },
          },
          order: [['createdAt', 'DESC']],
          include: [
            {
              model: Reaction,
              as: 'reactions',
            },
          ],
        });

        return msg;
      } catch (err) {
        throw err;
      }
    },
  },
  Mutation: {
    sendMessage: async (_, args, { user, pubsub }) => {
      const { content, to } = args;
      try {
        if (!user) {
          throw new AuthenticationError('Not Authenticated');
        }
        if (content.trim() === '')
          throw new UserInputError('Content cant be empty');
        const recipient = await User.findOne({ where: { username: to } });
        if (!recipient) {
          throw new UserInputError('Recipient was not found!');
        } else if (recipient.username === user.username) {
          throw new UserInputError('You cant send message to yourself!');
        }

        const msg = await Message.create({
          from: user.username,
          to,
          content,
        });

        pubsub.publish('NEW_MESSAGE', { newMessage: msg });

        return msg;
      } catch (err) {
        throw err;
      }
    },
  },
  Subscription: {
    newMessage: {
      subscribe: withFilter(
        (_, __, { pubsub, user }) => {
          if (!user) {
            throw new AuthenticationError('Not Authenticated');
          }
          return pubsub.asyncIterator(['NEW_MESSAGE']);
        },
        ({ newMessage }, args, { user }) => {
          if (
            newMessage.from === user.username ||
            newMessage.to === user.username
          ) {
            return true;
          } else {
            return false;
          }
        }
      ),
    },
  },
};

module.exports = { MessageResolvers };
