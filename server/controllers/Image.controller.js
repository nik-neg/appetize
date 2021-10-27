const mongoose = require('mongoose');

const gridfs = require('gridfs-stream');

const _ = require('lodash');

const User = require('../models/User');

const DailyTreat = require('../models/DailyTreat');

const helper = require('../helpers/db.helpers');

module.exports.saveImage = async (req, res) => {
  const { id } = req.params;
  const { imageURL } = req.query; // for avatar image
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
  const { created } = req.query;
  const filename = `${req.params.id}/${created}`;
  try {
    gridfs.mongo = mongoose.mongo;
    const { connection } = mongoose;
    const gfs = gridfs(connection.db);
    const result = await helper.findImageFile(gfs, filename);
    if (!result) {
      return res.status(404).send({ error: '404', message: 'Could not find the file' });
    }
    const readStream = gfs.createReadStream({
      filename,
    });
    readStream.pipe(res);
    // additional explicit setting of status for test of successful stream
    const end = new Promise((resolve, reject) => {
      readStream.on('end', () => resolve(res.status(200)));
      readStream.on('error', reject);
    });
    (async () => {
      await end;
    })();
  } catch (err) {
    return res.status(500).send({ error: '500', message: 'Could not find the file - Internal server error' });
  }
};

module.exports.removeImages = async (req, res) => {
  const { id } = req.params;
  let dailyTreats;
  try {
    dailyTreats = await DailyTreat.find({ userID: id });
  } catch (err) {
    return res.status(500).send({ error: '500', message: 'Could not find the daily treat - Internal server error' });
  }
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
  const result = await helper.removeImageData(excludeDeletePattern, 'deleteMany');
  if (result.deletedCount) {
    return res.status(200).send();
  }
  return res.status(500).send({ error: '500', message: 'Could not delete the daily treats - Internal server error' });
};
