const mongoose = require('mongoose');

require('dotenv').config();

const mongoConnStr = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PW}@${process.env.DB_URL}/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const connect = async () => {
  await mongoose.connect(mongoConnStr, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });
};

module.exports = { mongoose, connect };
