const bcrypt = require('bcrypt');

const User = require('../models/User');
const DailyTreat = require('../models/DailyTreat');


const upload = require("../middleware/upload");

const db = require('../models/db');

const saltRounds = 10;

const mongodb = require('mongodb');
const mongoose = require('mongoose');

var gridfs = require('gridfs-stream');

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
  console.log("LOGIN SERVER")
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

module.exports.showProfile = async (req, res) => {
  // console.log(req)
  // console.log(req.params)
  let user = await User.findOne({
    _id: req.params.id
  });
  // console.log(user)
  res.status(200).send(user);
}

module.exports.saveImage = async (req, res) => {
  // console.log(req, req.body, req.params.id, req.params.imageName, req.url)
  console.log('SAVE IMAGE');

  // const title ="TestImage"
  // const image = { data: Buffer, contentType: String };
  // const description = "Saving Testimage"
  // const isSelfCoocked = false;

  try {
    await upload(req, res);



    console.log(req.file);

    if (!req.file || req.file.length <= 0) {
      return res.send(`You must select at least 1 file.`);
    } else {
      res.end(); // status 201 ?
    }
    // await retrieveImage(req, res);
    // return res.send(`Files have been uploaded.`);

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


module.exports.retrieveImage = async (req, res) => {
  console.log("RETRIEVE IMAGE")
  gridfs.mongo = mongoose.mongo;
  var connection = mongoose.connection;
  var gfs = gridfs(connection.db);

  gfs.exist({ filename: req.params.id }, function (err, file) { // req.params.id
    if (err || !file) {
        res.send('File Not Found');
    } else {
        var readstream = gfs.createReadStream({ filename: req.params.id });
        readstream.pipe(res);

    }
  });
}

module.exports.setZipCode = async (req, res) => {
  console.log("SET ZIP CODE")
  console.log(req.params.id)
  const { id } = req.params;
  const { zipCode } = req.body;

  try {
    const user = await User.findOneAndUpdate({ _id: id}, {zipCode: zipCode}, function(err, result) {
      if (err) {
        res.send(err);
      }
    });
    res.status(201).send(user);
  } catch(e) {
    console.log(e)
  }
}

module.exports.publishDish = async (req, res) => {
  console.log("PUBLISH DISH")
  console.log(req.params.id, req.body)
  const { id } = req.params;
  const { title, description, recipe, firstName } = req.body;
  const imageUrl = `http://localhost:3001/profile/${id}/download`;

  let alreadyPublished = await DailyTreat.findOne({
    userID: id,
  });
  if (alreadyPublished) {
    return res
      .status(409)
      .send({ error: '409', message: 'DailyTreat already published!' });
  }

  // create dish to publish
  const dailyTreat = new DailyTreat();
  dailyTreat.userID = id;
  dailyTreat.creatorName = firstName;

  // get user for zip code
  let user
  try {
    user = await User.findOne({
      _id: id,
    });
  } catch(e) {
    console.log(e);
  }
  dailyTreat.zipCode = user.zipCode ? user.zipCode : "10000"; // default zip code


  dailyTreat.title = title;
  dailyTreat.description = description;
  dailyTreat.recipe = recipe;
  dailyTreat.imageUrl = imageUrl;

  // save to db
  try {
    const dailyTreatSaveResponse = await dailyTreat.save();
    console.log(dailyTreatSaveResponse);
    res.status(201).send(dailyTreatSaveResponse);
  } catch(e) {
    console.log(e)
  }


}