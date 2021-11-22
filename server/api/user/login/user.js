'use strict';

const db = require('../../models/db');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

const SECRET_KEY = process.env.SECRET_KEY || 'loading';

const saltRounds = 10;

const User = require('../../models/User');

const createConn = async () => {
		await db.connect();
};

module.exports.login = async (event) => {
	const response = {};
	if (!db.mongoose.connection.readyState) {
		// Cold start or connection timed out. Create new connection.
		try {
				await createConn();
		} catch (e) {
			response.error = e.message;
			return response;
		}
	}
  const { email, password } = JSON.parse(event.body);
  try {
    const invalidInput = !email || !password;
    if (invalidInput) throw new Error();
  } catch (error) {
		response.statusCode = 400;
		response.body = { error: '400', message: 'Please provide login credentials' };
		return response;
  }

  let user;
  try {
    user = await User.findOne({
      email,
    });
  } catch (err) {
		response.statusCode = 500;
		response.body = { error: '500', message: 'Could not find user - Internal server error'};
		return response;
  }
  try {
    // const checkedPassword = await bcrypt.compare(password, user.password);
    // if (!checkedPassword) throw new Error();
    const { _id } = user;
    const accessToken = jwt.sign({ _id }, SECRET_KEY);
		response.statusCode = 200;
		response.body = JSON.stringify({ user: _.omit(user._doc, ['password']), accessToken });
		return response;
  } catch (error) {
		response.statusCode = 401;
		response.body = { error: '401', message: 'email or password is incorrect' };
		return response;
  }

};
