const db = require('./db');

const UserSchema = new db.mongoose.Schema({
  avatarImageUrl: String,
  firstName: String,
  lastName: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: String,
  dailyFood: [{ type: db.mongoose.Schema.Types.ObjectId, ref: 'DailyTreat' }],
  city: String,
  liked: [{ type: db.mongoose.Schema.Types.ObjectId, ref: 'DailyTreat' }],
  created: Date,
  updated: Date,

});

const User = db.mongoose.model('User', UserSchema);

module.exports = User;
