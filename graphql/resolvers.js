const { User } = require('../models');

const resolvers = {
  Query: {
    getUsers: async () => {
      const users = await User.findAll();
      return users;
    },
  },
};

module.exports = { resolvers };
