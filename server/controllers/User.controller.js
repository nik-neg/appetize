const bcrypt = require('bcrypt');

const saltRounds = 10;

const User = require('../models/User');

// const http = require('../index');
// const io = require('socket.io')(http);

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
    // res.redirect('/login')
  } catch (error) {
    res.status(400).send({ error, message: 'Could not create user' });
  }
};

module.exports.loginUser = async (req, res) => {
  // console.log('LOGIN SERVER');
  // console.log(req.body)
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      email,
    });
    const checkedPassword = await bcrypt.compare(password, user.password);
    if (!checkedPassword) throw new Error();
    res.status(200).send(user);
    // res.redirect('/profile/'+user._id)
  } catch (error) {
    res
      .status(401)
      .send({ error: '401', message: 'Username or password is incorrect' });
  }
};

module.exports.showProfile = async (req, res) => { // connect to socket of zip code
  // console.log(req)
  // console.log(req.params)
  // console.log('SHOW PROFILE');
  const user = await User.findOne({
    _id: req.params.id,
  });

  // subscribe user for zip code room to voting updates
  // if(user.zipCode !== '10000') { // not the default zip code
  //   console.log('SOCKET ON JOIN ')
  //   io.on('connection',function(socket){ // connects to the room (zip code area for live voting)
  //     console.log(`add user: ${req.params.id} to ${user.zipCode} room.`)
  //     socket.join(`${user.zipCode}`);
  //   });
  // }

  res.status(200).send(user);
};

module.exports.setZipCode = async (req, res) => {
  // console.log('SET ZIP CODE')
  // console.log(req.params.id)
  const { id } = req.params;
  const { zipCode } = req.body;

  try {
    const user = await User.findOneAndUpdate({ _id: id }, { zipCode }, function (err, result) {
      if (err) {
        res.send(err);
      }
    });
    // update dish ?

    res.status(201).send(user);
  } catch (e) {
    console.log(e);
  }
};
