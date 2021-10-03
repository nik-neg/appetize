const mongoose = require('mongoose');

const gridfs = require('gridfs-stream');

const _ = require('lodash');

const User = require('../models/User');

const DailyTreat = require('../models/DailyTreat');

const helper = require('../helpers/db.helpers');

module.exports.saveImage = async (req, res) => {
  const { id } = req.params;
  const { imageURL } = req.query;
  try {
    if (imageURL) {
      let userData = await User.findOne({ _id: id });
      userData.avatarImageUrl = imageURL;
      userData = await userData.save();
      userData = _.omit(userData, ['password']);
      return res.status(201).send({ userData });
    }
    return res.status(201).send();
  } catch (err) {
    return res.status(500).send({ error: '500', message: 'Could not set the image url for the user - Internal server error' });
  }
};

module.exports.retrieveImage = async (req, res) => {
  gridfs.mongo = mongoose.mongo;
  const { connection } = mongoose;
  const gfs = gridfs(connection.db);
  const { created } = req.query;
  const filename = `${req.params.id}/${created}`;
  gfs.files.findOne({
    filename,
  }, (err, file) => {
    if (err || !file) {
      res.send('File Not Found');
    } else {
      const readstream = gfs.createReadStream({
        filename,
      });
      readstream.pipe(res);
    }
  });
};

module.exports.removeImages = async (req, res) => {
  const { id } = req.params;
  const dailyTreats = await DailyTreat.find({ userID: id });
  const createdDateArray = dailyTreats.map((dailyTreat) => {
    let createdTime = Array.from(dailyTreat.imageUrl).reverse();
    const cutIndex = createdTime.indexOf('=');
    createdTime = createdTime.slice(0, cutIndex).reverse().join('');
    return createdTime;
  });

  let notMatchingDatesString = '';
  createdDateArray.forEach((date) => {
    notMatchingDatesString += `${date}|`;
  });
  notMatchingDatesString = notMatchingDatesString.substring(0, notMatchingDatesString.length - 1);

  const excludeDeletePattern = new RegExp(`^(?!.+(${notMatchingDatesString}|avatar)$)${id}.*`);
  const result = helper.removeImageData(excludeDeletePattern, 'deleteMany');
  // TODO: return res with result
};
