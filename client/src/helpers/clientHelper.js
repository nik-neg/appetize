const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

const error = (err) => {
  console.warn(`ERROR(${err.code}): ${err.message}`);
};
const getGeoLocation = (success) => {
  navigator.geolocation.getCurrentPosition(success, error, options);
};

const calculatePolygon = ({ latitude, longitude, radius }) => {
  const earthRadius = 6371e3;
  const polygon = [];
  const kmTometers = 1000;
  const dLat = (radius*kmTometers) / earthRadius;
  const dLon = (radius*kmTometers) / (earthRadius * Math.cos((Math.PI * latitude) / 180));
  // right up
  let newLatitude = latitude + (dLat * 180) / Math.PI;
  let newLongitude = longitude + (dLon * 180) / Math.PI;
  polygon.push([newLatitude, newLongitude]);
  // left up
  newLatitude = latitude + (dLat * 180) / Math.PI;
  newLongitude = longitude - (dLon * 180) / Math.PI;
  polygon.push([newLatitude, newLongitude]);
  // left down
  newLatitude = latitude - (dLat * 180) / Math.PI;
  newLongitude = longitude - (dLon * 180) / Math.PI;
  polygon.push([newLatitude, newLongitude]);
  // right down
  newLatitude = latitude - (dLat * 180) / Math.PI;
  newLongitude = longitude + (dLon * 180) / Math.PI;
  polygon.push([newLatitude, newLongitude]);
  polygon.push(polygon[0]); // close square polygon loop
  return polygon;
};

export default {
  getGeoLocation,
  calculatePolygon,
 }
