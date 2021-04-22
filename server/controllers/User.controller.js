const bcrypt = require('bcrypt');

const User = require('../models/User');
const Dish = require('../models/Dish')

const upload = require("../middleware/upload");

const saltRounds = 10;

module.exports.createUser = async (req, res) => {
  console.log(req.body)
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
  console.log("LOGIN SERVER")
  console.log(req.body)
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      email,
    });
    const checkedPassword = await bcrypt.compare(password, user.password);
    if (!checkedPassword) throw new Error();
    console.log("REDIRECT")
    res.status(200).send(user);
    // res.redirect('/profile/'+user._id)
  } catch (error) {
    res
      .status(401)
      .send({ error: '401', message: 'Username or password is incorrect' });
  }
};

module.exports.showProfile = async (req, res) => {
  console.log(req)
  console.log('PROFILE');
  console.log(req.params)
  let user = await User.findOne({
    _id: req.params.id
  });
  console.log(user)
  res.status(200).send(user);
}

module.exports.saveImage = async (req, res) => {
  console.log(req, req.data, req.body)
  console.log('SAVE IMAGE');

  const title ="TestImage"
  const image = { data: Buffer, contentType: String };
  const description = "Saving Testimage"
  const isSelfCoocked = false;

  try {
    await upload(req, res);
    console.log(req.files);

    if (!req.files || req.files.length <= 0) {
      return res.send(`You must select at least 1 file.`);
    }

    return res.send(`Files have been uploaded.`);

    // console.log(req.file);

    // if (req.file == undefined) {
    //   return res.send(`You must select a file.`);
    // }

    // return res.send(`File has been uploaded.`);
  } catch (error) {
    console.log(error);

    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.send("Too many files to upload.");
    }
    return res.send(`Error when trying upload many files: ${error}`);

    // return res.send(`Error when trying upload image: ${error}`);
  }

}

