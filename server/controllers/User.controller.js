const bcrypt = require('bcrypt');

const User = require('../models/User');
const DailyTreat = require('../models/DailyTreat');


// const upload = require("../middleware/upload");

const db = require('../models/db');

const saltRounds = 10;

const mongoose = require('mongoose');

var gridfs = require('gridfs-stream');

const axios = require('axios');

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

module.exports.showProfile = async (req, res) => { // connect to socket of zip code

  // console.log(req)
  // console.log(req.params)
  console.log('SHOW PROFILE')
  let user = await User.findOne({
    _id: req.params.id
  });

  // subscribe user for zip code room to voting updates
  // if(user.zipCode !== '10000') { // not the default zip code
  //   console.log("SOCKET ON JOIN ")
  //   io.on('connection',function(socket){ // connects to the room (zip code area for live voting)
  //     console.log(`add user: ${req.params.id} to ${user.zipCode} room.`)
  //     socket.join(`${user.zipCode}`);
  //   });
  // }

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
    // await upload(req, res);

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

  // loop through all fs.files and retrieve all images - in progress

  // posssible to loop n times with counter from dailyTreats

  gfs.exist({ filename: req.params.id }, function (err, file) {
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
    // update dish ?

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
  dailyTreat.likedByUserID = [];

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
  dailyTreat.votes = 0;
  dailyTreat.created = new Date().toISOString();

  // save to db
  try {
    const dailyTreatSaveResponse = await dailyTreat.save();
    console.log(dailyTreatSaveResponse);
    res.status(201).send(dailyTreatSaveResponse);
  } catch(e) {
    console.log(e)
  }
}

module.exports.checkDishesInRadius = async (req, res) => {
  console.log('SERVER - CHECK DISHES')
  console.log(req.params.id, req.params.radius)

  const { id, radius } = req.params;
  let user;
  try {
    // get zip code of user
    user = await User.findOne({
      _id:id
    });
  } catch(e) {
    console.log(e);
  }

  let zipCode;
  if (user) {
    zipCode = user.zipCode;
  } else {
    return res
      .status(409)
      .send({ error: '409', message: 'User doesn\'t exist' });
  }

  if(zipCode) {
    console.log(zipCode) // hash of api key ?
    const url = `https://app.zipcodebase.com/api/v1/radius?apikey=${process.env.API_KEY}&code=${zipCode}&radius=${radius}&country=de`
    axios.get(url)
      .then(function (response) {

        const zipCodesInRadius = response.data.results.map((element) => {
          return {zipCode: element.code, city: element.city}
        });
        console.log(zipCodesInRadius)
        helperFindDishesInDB(res, res, zipCodesInRadius);

        // res.send(response.data.results)
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      });
  }

  const helperFindDishesInDB = async (req, res, zipCodesInRadius) => {
    let dishesForClient = [];
    for(let i=0; i < zipCodesInRadius.length; i++) {
      try {
        let dailyTreatsFromDB = [];
        await DailyTreat.find({"zipCode": zipCodesInRadius[i].zipCode}, (err, dailyTreats) => {
          console.log("found in: "+zipCodesInRadius[i].zipCode)
          console.log(dailyTreats)
          dailyTreats.forEach((dailyTreat) => {
            const copyDailyTreat = Object.assign({}, {...dailyTreat._doc, city:zipCodesInRadius[i].city});
            console.log("copy");
            console.log(copyDailyTreat)
            dailyTreatsFromDB.push(copyDailyTreat)
          });
        });
        // console.log("dailyTreats")
        // console.log(dailyTreatsFromDB)
        if(dailyTreatsFromDB && dailyTreatsFromDB.length > 0) {
          dishesForClient.push(...dailyTreatsFromDB) // not only one elements
        }
      } catch(e) {
        console.log(e);
      }
    }

    console.log(dishesForClient)
    res.send(dishesForClient);
  }
}

module.exports.upDownVote = async (req, res) => {
  const { id, dailyTreatsID, upDown } = req.params;
  console.log("VOTE ")
  console.log(id, dailyTreatsID, upDown)

  try {
    if(upDown === "up") {
      console.log("like", upDown)
      // like dish
      await DailyTreat.updateOne(
        {_id: dailyTreatsID,
          userID: {$ne: id} },
        { $inc: { votes:  1} ,  $push: {likedByUserID: id}},
        { new: true }
      );
    } else {
      // unlike dish
      console.log("unlike", upDown)
      await DailyTreat.updateOne(
        {_id: dailyTreatsID,
          userID: {$ne: id} },
        { $inc: { votes:  -1}, $pull: {likedByUserID: id}},
        { new: true }
      );
    }
      // broadcast votes for zipCode
      // let user;
      // try {
      //   user = await User.findOne({_id: id}); /// ?
      //   if(user) {
      //     const updatedDailyTreat = await DailyTreat.findOne({_id: dailyTreatsID});
      //     console.log(updatedDailyTreat)
      //     io.on('connection', function(socket) {
      //       console.log(`Broadcast to ${user.zipCode} room.`)
      //       io.emit(`${user.zipCode}`, updatedDailyTreat.votes);
      //     });
      //   }
      // } catch(e) {
      //   console.log(e)
      // }


      // get updated votes for the realted user
      let dailyTreat;
      try {
        dailyTreat = await DailyTreat.findOne({_id: dailyTreatsID});
        // console.log(dailyTreat)
        res.send({votes: dailyTreat.votes});
      } catch(e) {
        console.log(e);
      }

    } catch(e) {
      console.log(e);
    }
  }
