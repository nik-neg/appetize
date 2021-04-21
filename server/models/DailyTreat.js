const db = require('./db');
// const User = require('./DailyTreat');

const DailyTreatSchema = new db.mongoose.Schema({
  userID: [{ type: db.mongoose.Schema.Types.ObjectId, ref: 'User' }],
  zipCode: Number, // String
  breakFast: {
    title: String,
    image: { data: Buffer, contentType: String },
    description: String, // limitation to x char ?
  },
  lunch: {
    title: String,
    image: { data: Buffer, contentType: String },
    description: String, // limitation to x char ?
  },
  dinner: {
    title: String,
    image: { data: Buffer, contentType: String },
    description: String, // limitation to x char ?
  },
  created: Date, // new Date(),
  updated: Date,
});

const DailyTreatModel = db.mongoose.model('DailyTreat', DailyTreatSchema);

module.exports = DailyTreatModel;
