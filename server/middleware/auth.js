const jwt = require('jsonwebtoken');
const _ = require('lodash');
const User = require('../models/User');

const SECRET_KEY = process.env.SECRET_KEY || 'loading'; // TODO: check key

const authMiddleware = async (req, res, next) => {
  const authHeaders = req.headers.authorization;
  if (!authHeaders) return res.status(403).send();
  const token = authHeaders.split(' ')[1];
  let userId;
  try {
    const { _id } = jwt.verify(token, SECRET_KEY);
    userId = _id;
  } catch (err) {
    return res.status(401).send({ error: '401', message: 'Could not verify token - jwt malformed' });
  }
  let user;
  try {
    user = await User.findOne({ _id: userId });
    if (!user) return res.status(401).send({ error: '401', message: 'Could not find user - unauthorized' });
  } catch (err) {
    return res.status(500).send({ error: '500', message: 'Could not find user - Internal server error' });
  }
  user = _.omit(user, ['password']);
  req.user = user;
  next();
};

module.exports = authMiddleware;
