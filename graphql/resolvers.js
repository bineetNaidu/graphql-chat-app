const resolvers = {
  Query: {
    getUsers: () => {
      const users = [
        {
          email: 'john@email.com',
          username: 'john',
        },
        {
          email: 'jane@email.com',
          username: 'jane',
        },
      ];

      return users;
    },
  },
};

module.exports = { resolvers };
