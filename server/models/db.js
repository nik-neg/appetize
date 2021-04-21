const mongoose = require('mongoose');

const connect = async () => {
  await mongoose.connect('mongodb://localhost/appetizeDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });
};

module.exports = { mongoose, connect };
