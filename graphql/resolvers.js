const { User } = require('../models');
const bcrypt = require('bcryptjs');
const { UserInputError } = require('apollo-server-errors');

const resolvers = {
  Query: {
    getUsers: async () => {
      const users = await User.findAll();
      return users;
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
  },
};

module.exports = { resolvers };
