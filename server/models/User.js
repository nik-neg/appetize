const db = require('./db');
const DailyTreat = require('./DailyTreat').schema;

const UserSchema = new db.mongoose.Schema({
  avatarImage: { data: Buffer, contentType: String },
  firstName: String,
  lastName: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: String,
  nikName: String,
  dailyFood: [DailyTreat],
  age: Number,
  zipCode: Number, // String ?
  voted: Boolean, // {up: bool, down: bool} ?
  liked: [DailyTreat],
  created: Date, // new Date(),
  updated: Date,

});

const User = db.mongoose.model('User', UserSchema);

module.exports = User;
