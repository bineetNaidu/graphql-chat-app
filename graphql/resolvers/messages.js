const { User, Message } = require('../../models');
const { UserInputError, AuthenticationError } = require('apollo-server-errors');
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
        });

        return msg;
      } catch (err) {
        throw err;
      }
    },
  },
  Mutation: {
    sendMessage: async (_, args, { user }) => {
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
        return msg;
      } catch (err) {
        throw err;
      }
    },
  },
};

module.exports = { MessageResolvers };
