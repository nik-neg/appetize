const axios = require('axios');

const User = require('../models/User');

const DailyTreat = require('../models/DailyTreat');

module.exports.publishDish = async (req, res) => {
  const { id } = req.params;
  const {
    title, description, recipe, firstName, cookedNotOrdered, chosenImageDate,
  } = req.body;
  const imageUrl = `http://localhost:3001/profile/${id}/download?created=${chosenImageDate}`;

  // const oneDay = 1000 * 60 * 60 * 24;

  const alreadyPublished = await DailyTreat.findOne({ // TODO: think about removing limitation
    userID: id, // TODO: check for actual date ?
    // created: { $gt: new Date().getTime() - oneDay },
    // 1000*60*60*24 == 1 day
  });
  if (alreadyPublished) {
    res
      .status(409)
      .send({ error: '409', message: 'DailyTreat already published!' });
  }
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
    // const imageId = dailyTreatSaveResponse._id;
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

const helperFindDishesInDB = async (req, res, zipCodesInRadius, cookedOrdered) => {
  const dishesForClient = [];
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < zipCodesInRadius.length; i++) {
    try {
      const dailyTreatsFromDB = [];
      const ALL_DISHES = 'ALL_DISHES';
      const cookedOrderedParam = cookedOrdered.cooked === cookedOrdered.ordered
        ? ALL_DISHES : cookedOrdered.cooked;

      const queryObject = {
        zipCode: zipCodesInRadius[i].zipCode,
      };
      if (cookedOrderedParam !== ALL_DISHES) {
        queryObject.cookedNotOrdered = cookedOrderedParam;
      }
      // eslint-disable-next-line no-await-in-loop
      await DailyTreat.find(
        queryObject,
        (err, dailyTreats) => {
          dailyTreats.forEach((dailyTreat) => {
            const copyDailyTreat = {
              // eslint-disable-next-line no-underscore-dangle
              ...dailyTreat._doc, city: zipCodesInRadius[i].city,
            };
            dailyTreatsFromDB.push(copyDailyTreat);
          });
        },
      );
      if (dailyTreatsFromDB && dailyTreatsFromDB.length > 0) {
        dishesForClient.push(...dailyTreatsFromDB); // not only one elements
      }
    } catch (e) {
      console.log(e);
    }
  }
  res.send(dishesForClient);
};

module.exports.checkDishesInRadius = async (req, res) => {
  const { id, radius, cookedOrdered } = req.query;
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
          helperFindDishesInDB(res, res, zipCodesInRadius, parsedCookedOrdered);
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
  const { id, dailyTreatsID, upDown } = req.params;
  try {
    if (upDown === 'up') {
      // like dish
      await DailyTreat.updateOne(
        {
          _id: dailyTreatsID,
          userID: { $ne: id },
        },
        { $inc: { votes: 1 }, $push: { likedByUserID: id } },
        { new: true },
      );
    } else {
      // unlike dish
      await DailyTreat.updateOne(
        {
          _id: dailyTreatsID,
          userID: { $ne: id },
        },
        { $inc: { votes: -1 }, $pull: { likedByUserID: id } },
        { new: true },
      );
    }

    // get updated votes for the realted user
    let dailyTreat;
    try {
      dailyTreat = await DailyTreat.findOne({ _id: dailyTreatsID });
      res.send({ votes: dailyTreat.votes });
    } catch (e) {
      console.log(e);
    }
  } catch (e) {
    console.log(e);
  }
};
