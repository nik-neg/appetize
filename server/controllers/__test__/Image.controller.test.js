/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */

const _ = require('lodash');
const imageController = require('../Image.controller');

const User = require('../../models/User');
const DailyTreat = require('../../models/DailyTreat');

jest.mock('../../models/User');
jest.mock('../../models/DailyTreat');
jest.mock('lodash');

beforeEach(() => {
  User.findOne = jest.fn();
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

describe('saveImage method', () => {
  test('saveImage throws 500, because of internal server error, while updating the avatar image url', async () => {
    const { req, res } = setup();
    req.params = { id: 123456799 };
    req.query = { imageURL: 'https://dummyUrl' };
    const mockErr = new Error('ERROR');
    await User.findOne.mockRejectedValue(mockErr);
    await imageController.saveImage(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.send).toHaveBeenCalledTimes(1);
  });
  test('saveImage returns 201, because the avatar image url is not present in request, and the daily treat image has been saved by middleware', async () => {
    const { req, res } = setup();
    req.params = { id: 123456799 };
    req.query = {};
    await imageController.saveImage(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.send).toHaveBeenCalledTimes(1);
  });
  test('saveImage returns 201 and the user data', async () => {
    const { req, res } = setup();
    req.params = { id: 123456799 };
    req.query = { imageURL: 'https://dummyUrl' };
    const {
      firstName, lastName, email, password,
    } = User;
    const mockUser = {
      firstName, lastName, email, password,
    };
    let foundUser = await User.findOne.mockResolvedValue(mockUser);
    foundUser = await foundUser();
    foundUser.save = jest.fn();
    let savedUser = await foundUser.save.mockResolvedValue(foundUser);
    savedUser = await savedUser();
    const userData = _.omit(savedUser, ['password']);
    await imageController.saveImage(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.send).toHaveBeenCalledWith({ userData });
    expect(res.send).toHaveBeenCalledTimes(1);
  });
});
