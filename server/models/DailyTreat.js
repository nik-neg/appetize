const db = require('./db');
const PointSchema = require('./Point');

const DailyTreatSchema = new db.mongoose.Schema({
  userID: { type: db.mongoose.Schema.Types.ObjectId, ref: 'User' },
  creatorName: String,
  zipCode: String,
  title: String,
  description: String,
  recipe: String,
  imageUrl: String,
  geoPoint: {
    type: PointSchema,
    // index: '2dsphere',
    required: true,
  },
  votes: Number,
  cookedNotOrdered: Boolean,
  likedByUserID: [{ type: db.mongoose.Schema.Types.ObjectId, ref: 'User' }],
  created: String,
  updated: String,
});

const DailyTreatModel = db.mongoose.model('DailyTreat', DailyTreatSchema);

module.exports = DailyTreatModel;
