const jwt = require('jsonwebtoken');
const _ = require('lodash');
const User = require('../models/User');

const SECRET_KEY = process.env.SECRET_KEY || 'loading'; // TODO: check key

const authMiddleware = async (req, res, next) => {
  const authHeaders = req.headers.authorization;
  if (!authHeaders) return res.sendStatus(403);
  const token = authHeaders.split(' ')[1];
  try {
    const { _id } = jwt.verify(token, SECRET_KEY);
    let user = await User.findOne({ _id });
    user = _.omit(user, ['password']);
    if (!user) return res.sendStatus(401);
    req.user = user;
    next();
  } catch (error) {
    res.sendStatus(401);
  }
};

module.exports = authMiddleware;
