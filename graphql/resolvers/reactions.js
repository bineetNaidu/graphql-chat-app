const { User, Message, Reaction } = require('../../models');
const { UserInputError, AuthenticationError } = require('apollo-server-errors');

const ReactionResolvers = {
  Query: {},
  Mutation: {
    reactToMessage: async (_, { uuid, content }, { user, pubsub }) => {
      try {
        const reactions = ['❤️', '😆', '😯', '😢', '😡', '👍', '👎'];
        // Validate reaction content
        if (!reactions.includes(content)) {
          throw new UserInputError('Invalid reaction');
        }
        console.log('1');

        // Get user
        const username = user ? user.username : '';
        user = await User.findOne({ where: { username } });
        if (!user) throw new AuthenticationError('Unauthenticated');
        const message = await Message.findOne({ where: { uuid } });
        // Get message
        if (!message) throw new UserInputError('message not found');

        if (message.from !== user.username && message.to !== user.username) {
          throw new ForbiddenError('Unauthorized');
        }

        let reaction = await Reaction.findOne({
          where: { messageId: message.id, userId: user.id },
        });

        if (reaction) {
          // Reaction exists, update it
          reaction.content = content;
          await reaction.save();
        } else {
          // Reaction doesnt exists, create it
          reaction = await Reaction.create({
            messageId: message.id,
            userId: user.id,
            content,
          });
        }

        // pubsub.publish('NEW_REACTION', { newReaction: reaction });

        return reaction;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  },
  Subscription: {},
};

module.exports = { ReactionResolvers };
