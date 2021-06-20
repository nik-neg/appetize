const bcrypt = require('bcrypt');

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
    if (password === '') throw new Error();
    const hash = await bcrypt.hash(password, saltRounds);
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hash,
      created: new Date(),
    });
    user = await newUser.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send({ error, message: 'Could not create user' });
  }
};

module.exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      email,
    });
    const checkedPassword = await bcrypt.compare(password, user.password);
    if (!checkedPassword) throw new Error();
    res.status(200).send(user);
  } catch (error) {
    res
      .status(401)
      .send({ error: '401', message: 'Username or password is incorrect' });
  }
};

module.exports.showProfile = async (req, res) => { // connect to socket of zip code
  const user = await User.findOne({
    _id: req.params.id,
  });

  res.status(200).send(user);
};

module.exports.setZipCode = async (req, res) => {
  const { id } = req.params;
  const { zipCode } = req.body;

  try {
    const user = await User.findOneAndUpdate({ _id: id }, { zipCode }, (err, result) => {
      if (err) {
        res.send(err);
      }
    });
    res.status(201).send(user);
  } catch (e) {
    console.log(e);
  }
};
