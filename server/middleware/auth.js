const jwt = require('jsonwebtoken');
const _ = require('lodash');
const User = require('../models/User');

const SECRET_KEY = process.env.SECRET_KEY || 'loading'; // TODO: check key

const authMiddleware = async (req, res, next) => {
  const authHeaders = req.headers.authorization;
  if (!authHeaders) return res.status(403).send();
  const token = authHeaders.split(' ')[1];
  try {
    const { _id } = jwt.verify(token, SECRET_KEY);
    let user;
    try {
      user = await User.findOne({ _id });
    } catch (err) {
      return res.status(500).send({ error: '500', message: 'Could not find user - Internal server error' });
    }
    if (!user) return res.status(401).send();
    user = _.omit(user, ['password']);
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).send();
  }
};

module.exports = authMiddleware;
