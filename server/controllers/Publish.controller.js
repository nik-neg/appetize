/* eslint-disable no-plusplus */
const axios = require('axios');

const User = require('../models/User');

const DailyTreat = require('../models/DailyTreat');

const helper = require('../helpers/db.helpers');

module.exports.publishDish = async (req, res) => {
  const { id } = req.params;
  const {
    title, description, recipe, firstName, cookedNotOrdered, chosenImageDate,
  } = req.body;
  const imageUrl = `http://localhost:3001/profile/${id}/download?created=${chosenImageDate}`;
  // create dish to publish
  const dailyTreat = new DailyTreat();
  dailyTreat.userID = id;
  dailyTreat.creatorName = firstName;
  dailyTreat.likedByUserID = [];
  dailyTreat.cookedNotOrdered = cookedNotOrdered;
  // get user for zip code
  let user;
  try {
    user = await User.findOne({
      _id: id,
    });
  } catch (e) {
    console.log(e);
  }
  dailyTreat.zipCode = user.zipCode ? user.zipCode : '10000'; // default zip code, change ?

  dailyTreat.title = title;
  dailyTreat.description = description;
  dailyTreat.recipe = recipe;
  dailyTreat.votes = 0;
  dailyTreat.created = new Date().getTime();
  // save to db
  try {
    const dailyTreatSaveResponse = await dailyTreat.save();
    // eslint-disable-next-line no-underscore-dangle
    dailyTreat.imageUrl = imageUrl;
    await dailyTreat.save();
    if (dailyTreatSaveResponse) {
      // eslint-disable-next-line no-underscore-dangle
      user.dailyFood.push(dailyTreatSaveResponse._id);
      await user.save();
    }
    res.status(201).send(dailyTreatSaveResponse);
  } catch (e) {
    console.log(e);
  }
};

module.exports.removeDish = async (req, res) => {
  const { id, dailyTreatID } = req.params;
  // get created time of dailytreat from image url
  try {
    const dailyTreat = await DailyTreat.findOne({ _id: dailyTreatID });
    let createdTime = Array.from(dailyTreat.imageUrl).reverse();
    const cutIndex = createdTime.indexOf('=');
    createdTime = createdTime.slice(0, cutIndex).reverse().join('');
    // remove from dailytreats
    await DailyTreat.deleteOne({ _id: dailyTreatID });
    // remove from dailyFood list in user
    const user = await User.findOne({ _id: id });
    // eslint-disable-next-line
    user.dailyFood = user.dailyFood.filter((dailyTreat) => dailyTreat != dailyTreatID);
    await user.save();
    // remove from files and chunks
    const excludeDeletePattern = new RegExp(`${id}/${createdTime}`);
    helper.removeImageData(excludeDeletePattern, 'deleteOne', res);
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
};

module.exports.checkDishesInRadius = async (req, res) => {
  const {
    id, radius, cookedOrdered, pageNumber,
  } = req.query;
  const parsedCookedOrdered = JSON.parse(cookedOrdered);
  let user;
  try {
    // get zip code of user
    user = await User.findOne({
      _id: id,
    });
  } catch (e) {
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
  if (zipCode) {
    const url = `https://app.zipcodebase.com/api/v1/radius?apikey=${process.env.API_KEY}&code=${zipCode}&radius=${radius}&country=de`;
    axios
      .get(url)
      .then((response) => {
        if (!response.data.results.error) {
          const zipCodesInRadius = response.data.results.map((element) => (
            { zipCode: element.code, city: element.city }));
          helper.findDishesInDB(req, res, zipCodesInRadius, parsedCookedOrdered, pageNumber);
        }
      })
      .catch((error) => {
        // handle error
        console.log(error);
      })
      .then(() => {
        // always executed
      });
  }
};

module.exports.upDownVote = async (req, res) => {
  const { id, dailyTreatID, upDown } = req.params;
  try {
    if (upDown === 'up') {
      // like dish
      await DailyTreat.updateOne(
        {
          _id: dailyTreatID,
          userID: { $ne: id },
        },
        { $inc: { votes: 1 }, $push: { likedByUserID: id } },
        { new: true },
      );
      await User.updateOne(
        { _id: id },
        { $push: { liked: dailyTreatID } },
        { new: true },
      );
    } else {
      // unlike dish
      await DailyTreat.updateOne(
        {
          _id: dailyTreatID,
          userID: { $ne: id },
        },
        { $inc: { votes: -1 }, $pull: { likedByUserID: id } },
        { new: true },
      );
      await User.updateOne(
        { _id: id },
        { $pull: { liked: dailyTreatID } },
        { new: true },
      );
    }
    // get updated votes for the related user
    let dailyTreat;
    let user;
    try {
      dailyTreat = await DailyTreat.findOne({ _id: dailyTreatID });
      user = await User.findOne({ _id: id });
      user.password = null; // TODO: lodash omit
      res.send({ user, dailyTreat });
    } catch (e) {
      console.log(e);
    }
  } catch (e) {
    console.log(e);
  }
};
