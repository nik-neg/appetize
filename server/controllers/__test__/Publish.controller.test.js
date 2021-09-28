/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
const axios = require('axios');
const _ = require('lodash');

const User = require('../../models/User');
const DailyTreat = require('../../models/DailyTreat');

const userController = require('../Publish.controller');

jest.mock('../../models/User');
jest.mock('../../models/DailyTreat');
jest.mock('axios');
jest.mock('lodash');

beforeEach(() => {
  User.findOne = jest.fn();
  DailyTreat.create = jest.fn();
});

const setup = () => { // test object factory
  const req = {
    body: {},
  };
  const res = {
    status: jest.fn(
      function status() {
        return this;
      },
    ),
    json: jest.fn(
      function json() {
        return this;
      },
    ),
    send: jest.fn(
      function send() {
        return this;
      },
    ),
  };
  return { req, res };
};

describe('publishDish method', () => {
  test('publishDish throws 400, because user not found', async () => {

  });
  test('createUser throws 500, because of internal server error', async () => {

  });

});
