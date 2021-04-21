const db = require('./db');

const Dish = require('./Dish').schema;

const DailyTreatSchema = new db.mongoose.Schema({
  userID: [{ type: db.mongoose.Schema.Types.ObjectId, ref: 'User' }],
  zipCode: Number, // String
  breakFast: Dish,
  lunch: Dish,
  dinner: Dish,
  created: Date,
  updated: Date,
});

const DailyTreatModel = db.mongoose.model('DailyTreat', DailyTreatSchema);

module.exports = DailyTreatModel;
