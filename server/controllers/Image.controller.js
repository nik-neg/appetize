const mongoose = require('mongoose');

const gridfs = require('gridfs-stream');

const User = require('../models/User');

const DailyTreat = require('../models/DailyTreat');

const helper = require('../helpers/db.helpers');

module.exports.saveImage = async (req, res) => { // TODO: return date information
  try {
    if (!req.file || req.file.length <= 0) {
      return res.send('You must select at least 1 file.');
    }
    const { id } = req.params;
    const { imageURL } = req.query;
    if (imageURL) {
      const userData = await User.findOne({ _id: id });
      userData.avatarImageUrl = imageURL;
      await userData.save();
      userData.password = null;
      res.status(201).send({ userData });
    }
    res.status(201).send();
  } catch (error) {
    console.log(error);
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.send('Too many files to upload.');
    }
    return res.send(`Error when trying upload many files: ${error}`);
  }
};

module.exports.retrieveImage = async (req, res) => {
  gridfs.mongo = mongoose.mongo;
  const { connection } = mongoose;
  const gfs = gridfs(connection.db);
  const { created } = req.query;
  gfs.files.findOne({
    filename: `${req.params.id}/${created}`,
  }, (err, file) => {
    if (err || !file) {
      res.send('File Not Found');
    } else {
      const readstream = gfs.createReadStream({
        filename: `${req.params.id}/${created}`,
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

  const deletePattern = new RegExp(`^(?!.+(${notMatchingDatesString}|avatar)$)${id}.*`);
  helper.removeImageData(deletePattern, 'deleteMany', res);
};
