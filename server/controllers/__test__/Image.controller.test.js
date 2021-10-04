/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
const mongoose = require('mongoose');
const _ = require('lodash');
const gridfs = require('gridfs-stream');
const imageController = require('../Image.controller');

const User = require('../../models/User');
const DailyTreat = require('../../models/DailyTreat');

jest.mock('../../models/User');
jest.mock('../../models/DailyTreat');
jest.mock('lodash');
jest.mock('gridfs-stream');
jest.mock('mongoose');

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

describe('retrieveImage method', () => {
  test('retrieveImage returns 500, because of interal server error', async () => {
    const { req, res } = setup();
    req.query = { created: new Date().getTime() };
    req.params = { id: 123456789 };
    const mockErr = new Error('ERROR');
    gridfs.mongo = mongoose.mongo;
    const { connection } = mongoose;
    const gfs = gridfs(connection.db);
    gfs.files.findOne = jest.fn();
    await gfs.files.findOne.mockRejectedValue(mockErr);
    await imageController.retrieveImage(req, res);
    expect(res.status).toHaveBeenCalledWith(500);

    await gfs.files.findOne.mockResolvedValue(null);
    await imageController.retrieveImage(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.status).toHaveBeenCalledTimes(2);
    expect(res.send).toHaveBeenCalledTimes(2);
  });
  test('retrieveImage returns the buffered data, because of successful stream', async () => {
    const { req, res } = setup();
    req.query = { created: new Date().getTime() };
    req.params = { id: 123456789 };
    gridfs.mongo = mongoose.mongo;
    const { connection } = mongoose;
    const gfs = gridfs(connection.db);
    gfs.files.findOne = jest.fn();
    await gfs.files.findOne.mockResolvedValue('somefile');
    let mockedStream = gfs.createReadStream();
    mockedStream = await mockedStream();
    mockedStream.pipe(res);

    const helloWorld = 'helloworld';
    const end = new Promise((resolve, reject) => {
      // additional explicit setting of status for test of successful stream
      mockedStream.on('end', () => resolve([mockedStream.read(helloWorld.length), res.status(200)]));
      mockedStream.on('error', reject);
    });
    let streamDataOnEnd;
    (async () => {
      streamDataOnEnd = await end;
    })();

    mockedStream.emit('close');
    mockedStream.emit('end');

    await imageController.retrieveImage(req, res);
    expect(streamDataOnEnd[0].toString()).toEqual(helloWorld);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.status).toHaveBeenCalledTimes(2);
  });
});

describe('removeImages method', () => {
  test('removeImages returns 500, because of interal server error', async () => {
    const { req, res } = setup();
    req.params = { id: 123456789 };
    const mockErr = new Error('ERROR');
    DailyTreat.find = jest.fn();
    await DailyTreat.find.mockRejectedValue(mockErr);
    await imageController.removeImages(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.send).toHaveBeenCalledTimes(1);
  });
});
