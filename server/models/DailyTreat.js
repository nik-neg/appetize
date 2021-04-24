const db = require('./db');

// const Dish = require('./Dish').schema;

const DailyTreatSchema = new db.mongoose.Schema({
  userID: { type: db.mongoose.Schema.Types.ObjectId, ref: 'User' },
  creatorName: String,
  zipCode: String,
  title: String,
  description: String,
  recipe: String,
  imageUrl: String,
  votes: Number,
  likedByUserID: [{ type: db.mongoose.Schema.Types.ObjectId, ref: 'User' }],
  created: Date,
  updated: Date,
});

const DailyTreatModel = db.mongoose.model('DailyTreat', DailyTreatSchema);

module.exports = DailyTreatModel;
