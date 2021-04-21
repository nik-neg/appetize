const User = require('../models/User');

module.exports.createUser = async (req, res) => {
  console.log('REGISTER');
  console.log(req.body);
};

module.exports.loginUser = async (req, res) => {
  console.log('LOGIN');
  console.log(req.body);
};
