/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
const axios = require('axios');
const _ = require('lodash');

const User = require('../../models/User');
const DailyTreat = require('../../models/DailyTreat');

const publishController = require('../Publish.controller');

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
    const { req, res } = setup();
    req.params = { id: 123 };
    await User.findOne.mockResolvedValue(null);
    await publishController.publishDish(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.send).toHaveBeenCalledTimes(1);
  });
  test('publishDish throws 500, because of internal server error', async () => {
    const { req, res } = setup();
    req.params = { id: 123 };
    const mockErr = new Error('ERROR');
    await User.findOne.mockRejectedValue(mockErr);
    await publishController.publishDish(req, res);
    expect(res.status).toHaveBeenCalledWith(500);

    const {
      firstName, lastName, email, password,
    } = User;
    const mockUser = {
      firstName, lastName, email, password,
    };
    await User.findOne.mockResolvedValue(mockUser);
    req.body = {
      title: 'title',
      description: 'description',
      recipe: 'recipe',
      firstName: 'firstName',
      cookedNotOrdered: true,
      chosenImageDate: new Date().getTime(),
      userZipCode: '12345',
    };
    await DailyTreat.create.mockRejectedValue(mockErr);
    await publishController.publishDish(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.status).toHaveBeenCalledTimes(2);
    expect(res.send).toHaveBeenCalledTimes(2);
  });
});
