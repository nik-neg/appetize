/* eslint-disable no-undef */
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const User = require("../../models/User");
const authMiddleware = require("../auth");

jest.mock("jsonwebtoken");
jest.mock("lodash");
jest.mock("../../models/User");

beforeEach(() => {
  User.findOne = jest.fn();
  jwt.verify = jest.fn();
});

const setup = () => {
  // test object factory
  const req = {
    body: {},
  };
  const res = {
    status: jest.fn(function status() {
      return this;
    }),
    json: jest.fn(function json() {
      return this;
    }),
    send: jest.fn(function send() {
      return this;
    }),
  };
  return { req, res };
};

describe("authMiddleware method", () => {
  test("authMiddleware returns 403, because the headers object does not contain authorization", async () => {
    const { req, res } = setup();
    req.headers = {};
    await authMiddleware(req, res, () => {});
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.send).toHaveBeenCalledTimes(1);
  });
  // test("authMiddleware returns 401, because of malformed jwt token", async () => {
  //   const { req, res } = setup();
  //   req.headers = { authorization: "first token" };
  //   jwt.verify.mockRejectedValue("some token");
  //   await authMiddleware(req, res, () => {});
  //   expect(res.status).toHaveBeenCalledWith(401);
  //   expect(res.status).toHaveBeenCalledTimes(1);
  //   expect(res.send).toHaveBeenCalledTimes(1);
  // });
  // test("authMiddleware returns 401, because user could not be found", async () => {
  //   const { req, res } = setup();
  //   req.headers = { authorization: "first token" };
  //   jwt.verify.mockResolvedValue("some token");
  //   await User.findOne.mockResolvedValue(null);
  //   await authMiddleware(req, res, () => {});
  //   expect(res.status).toHaveBeenCalledWith(401);
  //   expect(res.status).toHaveBeenCalledTimes(1);
  //   expect(res.send).toHaveBeenCalledTimes(1);
  // });
  // test('authMiddleware returns 500, because of internal server error', async () => {
  //   const { req, res } = setup();
  //   req.headers = { authorization: 'first token' };
  //   jwt.verify.mockResolvedValue('some token');
  //   const mockErr = new Error('ERROR');
  //   await User.findOne.mockRejectedValue(mockErr);
  //   await authMiddleware(req, res, () => {});
  //   expect(res.status).toHaveBeenCalledWith(500);
  //   expect(res.status).toHaveBeenCalledTimes(1);
  //   expect(res.send).toHaveBeenCalledTimes(1);
  // });
  // test('authMiddleware set the user attribute in the request and calls the next function', async () => {
  //   const { req, res } = setup();
  //   req.headers = { authorization: 'first token' };
  //   jwt.verify.mockResolvedValue('some token');
  //   const {
  //     firstName, lastName, email, password,
  //   } = User;
  //   const mockUser = {
  //     firstName, lastName, email, password,
  //   };
  //   let user = await User.findOne.mockResolvedValue(mockUser);
  //   user = await user();
  //   user = _.omit(user, ['password']);
  //   const next = jest.fn();
  //   await authMiddleware(req, res, next);
  //   expect(req.user).toEqual(user);
  //   expect(next).toHaveBeenCalledTimes(1);
  // });
});
