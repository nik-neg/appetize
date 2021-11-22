'use strict';

const db = require('../../models/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

const SECRET_KEY = process.env.SECRET_KEY || 'loading';

const saltRounds = 10;

const User = require('../../models/User');

const createConn = async () => {
		await db.connect();
};

module.exports.register = async (event) => {
	// console.log('Event: ', event);
  // let responseMessage = 'Hello, World!';

  //  if (event.queryStringParameters && event.queryStringParameters['Name']) {
  //     responseMessage = 'Hello, ' + event.queryStringParameters['Name'] + '!';
  //   }

  // return {
  //   statusCode: 200,
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     message: responseMessage,
  //   }),
  // }

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

	const {
		firstName, lastName, email, password,
	} = JSON.parse(event.body);

	let user = await User.findOne({
		email,
	});

	if (user) {
		response.statusCode = 409;
		response.body = JSON.stringify({ error: '409', message: 'User already exists' });
		return response;
	}
	try {
		const invalidInput = !firstName || !lastName || !email || !password;
		if (invalidInput) throw new Error();
	} catch (error) {
		response.statusCode = 400;
		response.body = JSON.stringify({ error: '400', message: 'Please provide credentials' });
		return response;
	}

	try {
		const hash = password;
		const newUser = await User.create({
			firstName,
			lastName,
			email,
			password: hash,
			created: new Date(),
		});
		user = await newUser.save();
		db.mongoose.connection.close(); // TODO: useful?
	} catch (err) {
			response.statusCode = 500;
			response.body = JSON.stringify({ error: '500', message: 'Could not create user - Internal server error' });
			return response;
	}
	const { _id } = user;
	const accessToken = jwt.sign({ _id }, SECRET_KEY);
	response.statusCode = 201;
	response.body = JSON.stringify({ user: _.omit(user._doc, ['password']), accessToken });
	return response;
};