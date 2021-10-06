const mongoose = require('mongoose');
require('dotenv').config();

const url = process.env.USE_DOCKER === '1' ? process.env.DOCKER_DB_URL : process.env.DB_URL;
const connect = async (dbURL = url) => {
  await mongoose.connect(dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });
};

module.exports = { mongoose, connect };
