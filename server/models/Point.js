const db = require('./db');

const PointSchema = new db.mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  },
});
// const PointModel = db.mongoose.model('Point', PointSchema);

module.exports = PointSchema;
