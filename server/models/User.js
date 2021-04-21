const db = require('./db');
const DailyTreat = require('./DailyTreat').schema;

const UserSchema = new db.mongoose.Schema({
  avatarImage: { data: Buffer, contentType: String },
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  dailyFood: [DailyTreat],
  age: Number, // Date ? -> calend
  zipCode: Number, // String ?
  voted: Boolean, // {up: bool, down: bool} ?
  liked: [DailyTreat],
  isSelfCoocked: Boolean,
  created: Date, // new Date(),
  updated: Date,

});

const User = db.mongoose.model('User', UserSchema);

module.exports = User;
