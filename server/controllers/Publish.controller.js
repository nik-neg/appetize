/* eslint-disable max-len */
/* eslint-disable no-shadow */
/* eslint-disable eqeqeq */
/* eslint-disable no-plusplus */
const axios = require('axios');

const _ = require('lodash');

const User = require('../models/User');

const DailyTreat = require('../models/DailyTreat');

const helper = require('../helpers/db.helpers');

module.exports.publishDish = async (req, res) => {
  const { id } = req.params;
  let user;
  try {
    user = await User.findOne({
      _id: id,
    });
    if (!user) {
      return res.status(400).send({ error: '400', message: 'Could not find user' });
    }
  } catch (e) {
    return res.status(500).send({ error: '500', message: 'Could not find user - Internal server error' });
  }
  const {
    title, description, recipe, firstName, userZipCode, cookedNotOrdered, chosenImageDate, geoPoint,
  } = req.body;
  const { latitude, longitude, accuracy } = geoPoint;
  const imageUrl = `http://localhost:3001/profile/${id}/download?created=${chosenImageDate}`;
  // create dish to publish
  try {
    const dailyTreat = await DailyTreat.create({
      userID: id,
      creatorName: firstName,
      likedByUserID: [],
      zipCode: userZipCode,
      cookedNotOrdered,
      geoPoint: { type: 'Point', coordinates: [parseFloat(latitude), parseFloat(longitude)] },
    });
    dailyTreat.title = title;
    dailyTreat.description = description;
    dailyTreat.recipe = recipe;
    dailyTreat.votes = 0;
    dailyTreat.created = new Date().getTime();
    dailyTreat.imageUrl = imageUrl;

    const dailyTreatSaveResponse = await dailyTreat.save();
    const { _id } = dailyTreatSaveResponse;
    user.dailyFood.push(_id);
    await user.save();
    res.status(201).send(dailyTreatSaveResponse);
  } catch (e) {
    res.status(500).send({ error: '500', message: 'Could not save daily treat - Internal server error' });
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
    user.dailyFood = user.dailyFood.filter((dailyTreat) => dailyTreat != dailyTreatID);
    await user.save();
    // remove from files and chunks
    const excludeDeletePattern = new RegExp(`${id}/${createdTime}`);
    const result = await helper.removeImageData(excludeDeletePattern, 'deleteOne');
    if (result) {
      res.status(200).send({ message: 'Image removed' });
    } else {
      res.status(409).send({ message: 'Image could not be removed' });
    }
  } catch (e) {
    res.status(500).send({ error: '500', message: 'Could not remove daily treat and image - Internal server error' });
  }
};

module.exports.checkDishesInRadius = async (req, res) => {
  const {
    id, filter, pageNumber, geoLocationPolygon,
  } = req.query;
  const parsedFilter = JSON.parse(filter);
  let parsedGeoLocation = JSON.parse(geoLocationPolygon);
  parsedGeoLocation = parsedGeoLocation.map((arr) => arr.map((el) => +el));
  const polygon = {
    type: 'Polygon',
    coordinates: [parsedGeoLocation],
  };
  try {
    const cookedOrderedFilter = parsedFilter.cooked === parsedFilter.ordered;
    const queryObject = {};
    if (!cookedOrderedFilter) {
      queryObject.cookedNotOrdered = parsedFilter.cooked;
    }
    if (parsedFilter.own === true) {
      queryObject.userID = id;
    }
    const PAGE_SIZE = 4;
    const skip = (pageNumber - 1) * PAGE_SIZE;
    const dailyTreats = await DailyTreat.find(queryObject)
      .where('geoPoint')
      .within(polygon)
      .skip(skip)
      .limit(PAGE_SIZE);
    return res.status(200).send(dailyTreats);
  } catch (e) {
    return res.status(500).send({ error: '500', message: 'checkDishesInRadius - Internal server error' });
  }
};

module.exports.upDownVote = async (req, res) => {
  const { id, dailyTreatID } = req.params;
  const { upDownVote } = req.query;
  const upVoteStatement = {
    dailyTreat: { $inc: { votes: 1 }, $push: { likedByUserID: id } },
    user: { $push: { liked: dailyTreatID } },
  };
  const downVoteStatement = {
    dailyTreat: { $inc: { votes: -1 }, $pull: { likedByUserID: id } },
    user: { $pull: { liked: dailyTreatID } },
  };
  let dailyTreat;
  let user;

  try {
    const dailyTreatToCheck = await DailyTreat.findOne({ _id: dailyTreatID });
    if (dailyTreatToCheck && ((dailyTreatToCheck.userID == id) || (dailyTreatToCheck.votes === 0 && upDownVote !== 'up'))) {
      return res.status(409).send({ error: '409', message: 'User cannot vote for this dish!' });
    }
  } catch (e) {
    return res.status(500).send({ error: '500', message: 'Could not find daily treat - Internal server error' });
  }

  try {
    if (upDownVote === 'up') {
      // like dish
      dailyTreat = await DailyTreat.findOneAndUpdate(
        {
          _id: dailyTreatID,
          userID: { $ne: id },
        },
        upVoteStatement.dailyTreat,
        { new: true },
      );
      user = await User.findOneAndUpdate(
        { _id: id },
        upVoteStatement.user,
        { new: true },
      );
    } else {
      // unlike dish
      dailyTreat = await DailyTreat.findOneAndUpdate(
        {
          _id: dailyTreatID,
          userID: { $ne: id },
        },
        downVoteStatement.dailyTreat,
        { new: true },
      );
      user = await User.findOneAndUpdate(
        { _id: id },
        downVoteStatement.user,
        { new: true },
      );
    }
    user = _.omit(user, ['password']);
    return res.status(200).send({ user, dailyTreat });
  } catch (e) {
    return res.status(500).send({ error: '500', message: 'Could not up/down vote daily treat - Internal server error' });
  }
};

module.exports.updateDish = async (req, res) => {
  const { dishText, cookedOrdered } = req.body;
  const { dailyTreatsID } = req.query;
  let updatedDailyTreat;
  try {
    updatedDailyTreat = await DailyTreat.findOneAndUpdate(
      {
        _id: dailyTreatsID,
      },
      { ...dishText, cookedNotOrdered: cookedOrdered.cooked },
      { new: true },
    );
  } catch (e) {
    return res.status(500).send({ error: '500', message: 'Could not update daily treat - Internal server error' });
  }

  return res.status(200).send(updatedDailyTreat);
};
