const { User, Message } = require('../../models');
const { UserInputError, AuthenticationError } = require('apollo-server-errors');

const MessageResolvers = {
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
