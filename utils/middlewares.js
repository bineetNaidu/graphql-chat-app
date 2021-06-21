const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('apollo-server');
const { JWT_SECRET } = require('../constants');

const ctxMiddleware = (ctx) => {
  if (ctx.req.headers && ctx.req.headers.authorization) {
    const token = ctx.req.headers.authorization.split('Bearer ')[1];
    jwt.verify(token, JWT_SECRET, (err, decode) => {
      // if (err) throw new AuthenticationError('Unauthenticated');
      ctx.user = decode;
    });
  }

  return ctx;
};

module.exports = { ctxMiddleware };
