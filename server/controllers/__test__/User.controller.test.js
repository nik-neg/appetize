/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */

const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const _ = require('lodash');

const User = require('../../models/User');
const userController = require('../User.controller');

jest.mock('../../models/User');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('lodash');

const SECRET_KEY = process.env.SECRET_KEY || 'loading';

beforeEach(() => {
  User.findOne = jest.fn();
  User.create = jest.fn();
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

describe('createUser suite', () => {
  test('createUser throws 409, because user already exists', async () => {
    const { req, res } = setup();
    const {
      firstName, lastName, email, password,
    } = User;
    const mockUser = {
      firstName, lastName, email, password,
    };
    req.body = {
      ...mockUser,
    };
    User.findOne.mockResolvedValue(req.body);
    await userController.createUser(req, res);
    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.status).toHaveBeenCalledTimes(1);
  });
  test('createUser throws 400, because input is empty', async () => {
    const { req, res } = setup();
    const {
      firstName, lastName, email, password,
    } = User;
    const mockUser = {
      firstName, lastName, email, password,
    };
    const userWithoutFirstname = mockUser;
    userWithoutFirstname.firstName = '';
    req.body = {
      ...userWithoutFirstname,
    };
    User.findOne.mockResolvedValue(undefined);
    await userController.createUser(req, res);
    expect(res.status).toHaveBeenCalledWith(400);

    const userWithoutLastname = mockUser;
    userWithoutLastname.lastName = '';
    req.body = {
      ...userWithoutLastname,
    };
    User.findOne.mockResolvedValue(undefined);
    await userController.createUser(req, res);
    expect(res.status).toHaveBeenCalledWith(400);

    const userWithoutEmail = mockUser;
    userWithoutEmail.email = '';
    req.body = {
      ...userWithoutEmail,
    };
    User.findOne.mockResolvedValue(undefined);
    await userController.createUser(req, res);
    expect(res.status).toHaveBeenCalledWith(400);

    const userWithoutPassword = mockUser;
    userWithoutPassword.password = '';
    req.body = {
      ...userWithoutPassword,
    };
    User.findOne.mockResolvedValue(undefined);
    await userController.createUser(req, res);
    expect(res.status).toHaveBeenCalledWith(400);

    expect(res.status).toHaveBeenCalledTimes(4);
  });
  test('createUser returns 201 and user and jwt token', async () => {
    const { req, res } = setup();
    const {
      firstName, lastName, email, password,
    } = User;
    const mockUser = {
      firstName, lastName, email, password,
    };
    req.body = {
      ...mockUser,
    };
    User.findOne.mockResolvedValue(undefined);
    const hash = await bcryptjs.hash(password);
    expect(password).not.toBe(hash);
    const newUser = { _id: 123456789, _doc: { mockUser } };
    let createdUser = await User.create.mockResolvedValue(newUser);
    createdUser = await createdUser();
    createdUser.save = jest.fn();
    const userId = newUser._id;
    const accessToken = jwt.sign({ id: userId }, SECRET_KEY);
    expect(userId).not.toBe(accessToken);
    await createdUser.save.mockResolvedValue(newUser);
    const userWithoutPassword = _.omit(newUser._doc, ['password']);
    await userController.createUser(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.send).toHaveBeenCalledWith({ user: userWithoutPassword, accessToken });
    expect(res.send).toHaveBeenCalledTimes(1);
  });
});
