const mongoose = require('mongoose');

const DailyTreat = require('../models/DailyTreat');

module.exports.removeImageData = async (regex, deleteOptionForFiles) => {
  if (!(regex && deleteOptionForFiles)) return false;
  const { connection } = mongoose;
  const filesCollection = connection.db.collection('fs.files');
  const chunksCollection = connection.db.collection('fs.chunks');
  let data = filesCollection.find({ filename: { $regex: regex } });
  data = await data.toArray();
  const filesIDArray = data.map((entry) => entry._id);
  filesIDArray.forEach((fileId) => {
    chunksCollection.deleteOne({ files_id: fileId });
  });
  const result = await filesCollection[deleteOptionForFiles]({ filename: { $regex: regex } });
  return result.deletedCount > 0;
};

module.exports.findDishesInDB = async (zipCodesInRadius, cookedOrdered, pageNumber) => {
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
  return dailyTreats;
};
