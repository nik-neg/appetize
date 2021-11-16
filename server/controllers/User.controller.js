/* eslint-disable no-underscore-dangle */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

const SECRET_KEY = process.env.SECRET_KEY || 'loading';

const saltRounds = 10;

const User = require('../models/User');

module.exports.createUser = async (req, res) => {
  const {
    firstName, lastName, email, password,
  } = req.body;
  let user = await User.findOne({
    email,
  });
  if (user) {
    return res
      .status(409)
      .send({ error: '409', message: 'User already exists' });
  }
  try {
    const invalidInput = !firstName || !lastName || !email || !password;
    if (invalidInput) throw new Error();
  } catch (error) {
    return res
      .status(400)
      .send({ error: '400', message: 'Please provide credentials' });
  }
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hash,
      created: new Date(),
    });
    user = await newUser.save();
  } catch (err) {
    return res
      .status(500)
      .send({ error: '500', message: 'Could not create user - Internal server error' });
  }
  const { _id } = user;
  const accessToken = jwt.sign({ _id }, SECRET_KEY);
  return res
    .status(201)
    .send({ user: _.omit(user._doc, ['password']), accessToken });
};

module.exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const invalidInput = !email || !password;
    if (invalidInput) throw new Error();
  } catch (error) {
    return res
      .status(400)
      .send({ error: '400', message: 'Please provide login credentials' });
  }
  let user;
  try {
    user = await User.findOne({
      email,
    });
  } catch (err) {
    return res
      .status(500)
      .send({ error: '500', message: 'Could not find user - Internal server error' });
  }
  try {
    const checkedPassword = await bcrypt.compare(password, user.password);
    if (!checkedPassword) throw new Error();
    const { _id } = user;
    const accessToken = jwt.sign({ _id }, SECRET_KEY);
    return res
      .status(200)
      .send({ user: _.omit(user._doc, ['password']), accessToken });
  } catch (error) {
    return res
      .status(401)
      .send({ error: '401', message: 'email or password is incorrect' });
  }
};

module.exports.logoutUser = async (req, res) => {
  if (req.user) {
    res.status(200).send({});
  } else {
    res.status(400).send({ error: '400', message: 'user not in request' });
  }
};

module.exports.showProfile = async (req, res) => {
  if (req.user) {
    const userInfo = ({ ...req.user })._doc;
    res.status(200).send(userInfo);
  } else {
    res.status(400).send({ error: '400', message: 'user not in request' });
  }
};

module.exports.setCity = async (req, res) => {
  const { id } = req.params;
  const { city } = req.body;
  let user;
  try {
    user = await User.findOne({ _id: id });
  } catch (err) {
    return res.status(500).send({ error: '500', message: 'could not find user - Internal server error' });
  }

  try {
    user.city = city;
    await user.save();
    return res.status(201).send(_.omit(user._doc, ['password']));
  } catch (err) {
    return res.status(400).send({ error: '400', message: 'could not find user in database' });
  }
};
