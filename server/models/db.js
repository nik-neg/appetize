const mongoose = require('mongoose');
require('dotenv').config();

const connect = async (dbURL) => {
  await mongoose.connect(dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });
};

module.exports = { mongoose, connect };
