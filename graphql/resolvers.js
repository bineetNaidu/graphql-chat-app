const { User, Message } = require('../models');
const bcrypt = require('bcryptjs');
const { UserInputError, AuthenticationError } = require('apollo-server-errors');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../constants');
const { Op } = require('sequelize');

const resolvers = {
  Query: {
    getUsers: async (_, __, { user }) => {
      try {
        if (!user) {
          throw new AuthenticationError('Not Authenticated');
        }
        const users = await User.findAll({
          where: {
            username: { [Op.ne]: user.username },
          },
        });
        return users;
      } catch (err) {
        console.log(err.message);
        throw err;
      }
    },
  },
  Mutation: {
    register: async (_, args) => {
      const { email, username, password, confirmPassword } = args;
      let errors = {};
      try {
        if (email.trim() === '') errors.email = 'email must not be empty';
        if (username.trim() === '')
          errors.username = 'username must not be empty';
        if (password.trim() === '')
          errors.password = 'password must not be empty';
        if (confirmPassword.trim() === '')
          errors.confirmPassword = 'confirmPassword must not be empty';
        if (confirmPassword !== password)
          errors.confirmPassword = "confirmPassword and password doesn't match";

        const userByUsername = await User.findOne({ where: { username } });
        const userByEmail = await User.findOne({ where: { email } });

        if (userByEmail) errors.email = 'email already exists!';
        if (userByUsername) errors.username = 'username already exists!';

        if (Object.keys(errors).length > 0) {
          throw errors;
        }

        const hashPass = await bcrypt.hash(password, 12);
        const user = await User.create({ email, username, password: hashPass });
        return user;
      } catch (err) {
        console.log(err.message);
        throw new UserInputError('Bad Input!', { errors: err });
      }
    },

    login: async (_, args) => {
      const { username, password } = args;
      const errors = {};

      try {
        if (username.trim() === '')
          errors.username = 'username must not be empty';
        if (password.trim() === '')
          errors.password = 'password must not be empty';

        if (Object.keys(errors).length > 0) {
          throw new UserInputError('Bad Input', { errors });
        }
        const user = await User.findOne({ where: { username } });

        if (!user) {
          errors.username = 'user with this username was not found!';
          throw new UserInputError('user not found', { errors });
        }

        const verified = await bcrypt.compare(password, user.password);

        if (!verified) {
          errors.password = 'Incorrect Password';
          throw new UserInputError('Incorrect Password', { errors });
        }

        const token = jwt.sign({ username: user.username }, JWT_SECRET, {
          expiresIn: '1h',
        });

        return { user, token };
      } catch (err) {
        console.log(err.message);
        throw err;
      }
    },

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

module.exports = { resolvers };
