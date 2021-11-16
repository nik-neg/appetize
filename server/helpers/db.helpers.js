/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
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

module.exports.findDishesInDB = async (queryObject, polygon, skip, PAGE_SIZE) => {
  const dailyTreats = await DailyTreat.find(queryObject)
    .where('geoPoint')
    .within(polygon)
    .skip(skip)
    .limit(PAGE_SIZE);
  return dailyTreats;
};

module.exports.initDBUrl = () => {
  let url;
  if (process.env.TEST_E2E === '1') {
    url = process.env.E2E_DB;
  } else if (process.env.TEST_DB === '1') {
    url = process.env.TEST_DB_URL;
  } else if (process.env.USE_DOCKER === '1') {
    url = process.env.TEST_DB_URL;
  } else {
    url = process.env.DB_URL;
  }
  return url;
};

module.exports.findImageFile = async (gfs, filename) => {
  const result = await gfs.files.findOne({ filename });
  return result;
};

module.exports.calculateDistance = async (lat1, lon1, lat2, lon2) => {
  const earthRadius = 6371e3; // metres
  const phi1 = (lat1 * Math.PI) / 180; // φ, λ in radians
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2)
            + Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = earthRadius * c; // in metres
  return distance;
};

module.exports.calculatePolygon = (latitude, longitude, accuracy) => {
  const earthRadius = 6371e3;
  const polygon = [];

  const dLat = accuracy / earthRadius;
  const dLon = accuracy / (earthRadius * Math.cos((Math.PI * latitude) / 180));
  // right up
  let newLatitude = latitude + (dLat * 180) / Math.PI;
  let newLongitude = longitude + (dLon * 180) / Math.PI;
  polygon.push([newLatitude, newLongitude]);
  // left up
  newLatitude = latitude + (dLat * 180) / Math.PI;
  newLongitude = longitude - (dLon * 180) / Math.PI;
  polygon.push([newLatitude, newLongitude]);
  // right down
  newLatitude = latitude - (dLat * 180) / Math.PI;
  newLongitude = longitude + (dLon * 180) / Math.PI;
  polygon.push([newLatitude, newLongitude]);
  // left down
  newLatitude = latitude - (dLat * 180) / Math.PI;
  newLongitude = longitude - (dLon * 180) / Math.PI;
  polygon.push([newLatitude, newLongitude]);
  return polygon;
};
