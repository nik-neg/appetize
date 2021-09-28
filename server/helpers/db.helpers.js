const mongoose = require('mongoose');

const DailyTreat = require('../models/DailyTreat');

module.exports.removeImageData = (regex, deleteOptionForFiles, res) => {
  const { connection } = mongoose;
  try {
    connection.db.collection('fs.files', (err, collection) => {
      collection.find({ filename: { $regex: regex } }).toArray((err, data) => {
        if (err) console.log(err);
        const filesIDArray = data.map((entry) => entry._id);
        filesIDArray.forEach((fileId) => {
          connection.db.collection('fs.chunks').deleteOne({ files_id: fileId });
        });
        connection.db.collection('fs.files')[deleteOptionForFiles]({ filename: { $regex: regex } });
      });
    });
    if (res) res.status(200).send({});
  } catch (err) {
    console.log(err);
    if (res) res.status(500).send();
  }
};

module.exports.findDishesInDB = async (
  req, res, zipCodesInRadius, cookedOrdered, pageNumber,
) => {
  // eslint-disable-next-line no-plusplus
  const ALL_DISHES = 'ALL_DISHES';
  const cookedOrderedParam = cookedOrdered.cooked === cookedOrdered.ordered
    ? ALL_DISHES : cookedOrdered.cooked;
    // TODO: how to handle imbalanced data ?
  const queryObject = {};
  if (cookedOrderedParam !== ALL_DISHES) {
    queryObject.cookedNotOrdered = cookedOrderedParam;
  }

  const zipCodesInRadiusWithOutCity = zipCodesInRadius.map((zipCodeData) => zipCodeData.zipCode);
  queryObject.zipCode = zipCodesInRadiusWithOutCity;
  // pagination
  const PAGE_SIZE = 4;
  const skip = (pageNumber - 1) * PAGE_SIZE;
  let dailyTreats = [];
  try {
    dailyTreats = await DailyTreat.find(queryObject)
      .skip(skip)
      .limit(PAGE_SIZE);

    const zipCodeCityObject = {};
    zipCodesInRadius.forEach((zipCodeCity) => {
      zipCodeCityObject[zipCodeCity.zipCode] = zipCodeCity.city;
    });
    // get existing zip codes from db
    dailyTreats = dailyTreats.map((dailyTreat) => {
      // eslint-disable-next-line max-len
      const dailyTreatWithCity = { ...dailyTreat._doc, city: zipCodeCityObject[dailyTreat.zipCode]};
      return dailyTreatWithCity;
    });
  } catch (e) {
    console.log(e);
  }
  res.send(dailyTreats);
};
