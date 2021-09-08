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
  dailyFood: [{ type: db.mongoose.Schema.Types.ObjectId, ref: 'DailyTreat' }],
  age: Number,
  zipCode: Number,
  voted: Boolean,
  liked: [DailyTreat],
  created: Date,
  updated: Date,

});

const User = db.mongoose.model('User', UserSchema);

module.exports = User;
