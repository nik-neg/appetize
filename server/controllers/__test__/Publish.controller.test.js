/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
const axios = require('axios');
const _ = require('lodash');

const User = require('../../models/User');
const DailyTreat = require('../../models/DailyTreat');

const publishController = require('../Publish.controller');
const helper = require('../../helpers/db.helpers');

jest.mock('../../models/User');
jest.mock('../../models/DailyTreat');
jest.mock('../../helpers/db.helpers');
jest.mock('axios');
jest.mock('lodash');

beforeEach(() => {
  User.findOne = jest.fn();
  User.findOneAndUpdate = jest.fn();
  DailyTreat.create = jest.fn();
  DailyTreat.findOne = jest.fn();
  DailyTreat.deleteOne = jest.fn();
  DailyTreat.findOneAndUpdate = jest.fn();
  helper.removeImageData = jest.fn();
  helper.findDishesInDB = jest.fn();
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
    await DailyTreat.create.mockRejectedValue(mockErr);
    await publishController.publishDish(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.status).toHaveBeenCalledTimes(2);
    expect(res.send).toHaveBeenCalledTimes(2);
  });
  test('publishDish creates daily treat, updates user dailytreat relation, returns 201 and the saved daily treat', async () => {
    const { req, res } = setup();
    req.params = { id: 123 };
    const {
      firstName, lastName, email, password,
    } = User;
    const mockUser = {
      firstName, lastName, email, password, dailyFood: [],
    };
    let foundUser = await User.findOne.mockResolvedValue(mockUser);
    foundUser = await foundUser();
    req.body = {
      title: 'title',
      description: 'description',
      recipe: 'recipe',
      firstName: 'firstName',
      cookedNotOrdered: true,
      chosenImageDate: new Date().getTime(),
      userZipCode: '12345',
    };
    const {
      title, description, recipe, cookedNotOrdered, chosenImageDate, userZipCode,
    } = req.body;
    const { id } = req.params;
    const imageUrl = `http://localhost:3001/profile/${id}/download?created=${chosenImageDate}`;
    const mockedDailyTreat = {
      _id: 123456789,
      userID: req.params.id,
      creatorName: req.body.firstName,
      likedByUserID: [],
      zipCode: userZipCode,
      cookedNotOrdered,
    };
    let createdDailyTreat = await DailyTreat.create.mockResolvedValue(mockedDailyTreat);
    createdDailyTreat = await createdDailyTreat();
    createdDailyTreat.save = jest.fn();
    createdDailyTreat.title = title;
    createdDailyTreat.description = description;
    createdDailyTreat.recipe = recipe;
    createdDailyTreat.votes = 0;
    createdDailyTreat.created = new Date().getTime();
    createdDailyTreat.imageUrl = imageUrl;

    let savedDailyTreat = await createdDailyTreat.save.mockResolvedValue(createdDailyTreat);
    savedDailyTreat = await savedDailyTreat();
    const { _id } = savedDailyTreat;

    foundUser.save = jest.fn();
    let savedFoundUser = await foundUser.save.mockResolvedValue(foundUser);
    savedFoundUser = await savedFoundUser();
    await publishController.publishDish(req, res);
    expect(savedFoundUser.dailyFood).toContain(_id);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.send).toHaveBeenCalledWith(savedDailyTreat);
    expect(res.send).toHaveBeenCalledTimes(1);
  });
  describe('removeDish method', () => {
    test('removeDish throws 500, because of internal server error, before removing buffered images', async () => {
      const { req, res } = setup();
      req.params = { id: 123, dailyTreatID: 789 };
      const mockErr = new Error('ERROR');
      await DailyTreat.findOne.mockRejectedValue(mockErr);
      await publishController.removeDish(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.send).toHaveBeenCalledTimes(1);
    });
    test('removeDish, helper.removeImageData throws 500, because of internal server error, while removing buffered images', async () => {
      const { req, res } = setup();
      req.params = { id: 123, dailyTreatID: 123456789 };
      const { id, dailyTreatID } = req.params;
      const mockedDailyTreat = {
        _id: 123456789,
        userID: req.params.id,
        imageUrl: `http://localhost:3001/profile/${id}/download?created=${new Date().getTime()}`,
      };
      let createdDailyTreat = await DailyTreat.findOne.mockResolvedValue(mockedDailyTreat);
      createdDailyTreat = await createdDailyTreat();
      let createdTime = Array.from(createdDailyTreat.imageUrl).reverse();
      const cutIndex = createdTime.indexOf('=');
      createdTime = createdTime.slice(0, cutIndex).reverse().join('');
      await DailyTreat.deleteOne({ _id: dailyTreatID });
      const mockUser = {
        _id: id, dailyFood: [id, id + 1, id + 2, id + 3],
      };
      let foundUser = await User.findOne.mockResolvedValue(mockUser);
      foundUser = await foundUser();
      foundUser.dailyFood = foundUser.dailyFood.filter((dailyTreat) => dailyTreat != dailyTreatID);
      foundUser.save = jest.fn();
      const savedFoundUser = foundUser.save.mockResolvedValue(mockUser);
      const excludeDeletePattern = new RegExp(`${id}/${createdTime}`);
      const mockErr = new Error('ERROR');
      await helper.removeImageData.mockRejectedValue(mockErr);
      await publishController.removeDish(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.send).toHaveBeenCalledTimes(1);
    });
  });
  test('removeDish returns 409, because buffered images could not be removed', async () => {
    const { req, res } = setup();
    req.params = { id: 123, dailyTreatID: 123456789 };
    const { id, dailyTreatID } = req.params;
    const mockedDailyTreat = {
      _id: 123456789,
      userID: req.params.id,
      imageUrl: `http://localhost:3001/profile/${id}/download?created=${new Date().getTime()}`,
    };
    let createdDailyTreat = await DailyTreat.findOne.mockResolvedValue(mockedDailyTreat);
    createdDailyTreat = await createdDailyTreat();
    let createdTime = Array.from(createdDailyTreat.imageUrl).reverse();
    const cutIndex = createdTime.indexOf('=');
    createdTime = createdTime.slice(0, cutIndex).reverse().join('');
    await DailyTreat.deleteOne({ _id: dailyTreatID });
    const mockUser = {
      _id: id, dailyFood: [id, id + 1, id + 2, id + 3],
    };
    let foundUser = await User.findOne.mockResolvedValue(mockUser);
    foundUser = await foundUser();
    foundUser.dailyFood = foundUser.dailyFood.filter((dailyTreat) => dailyTreat != dailyTreatID);
    expect(foundUser.dailyFood).not.toContain(dailyTreatID);
    foundUser.save = jest.fn();
    await foundUser.save.mockResolvedValue(mockUser);
    const excludeDeletePattern = new RegExp(`${id}/${createdTime}`); // regex statement left for the flow
    await helper.removeImageData.mockResolvedValue(false);
    await publishController.removeDish(req, res);
    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.send).toHaveBeenCalledTimes(1);
  });
  test('removeDish returns 200, removes daily treat, updates the user relation, and clean up buffered images', async () => {
    const { req, res } = setup();
    req.params = { id: 123, dailyTreatID: 123456789 };
    const { id, dailyTreatID } = req.params;
    const mockedDailyTreat = {
      _id: 123456789,
      userID: req.params.id,
      imageUrl: `http://localhost:3001/profile/${id}/download?created=${new Date().getTime()}`,
    };
    let createdDailyTreat = await DailyTreat.findOne.mockResolvedValue(mockedDailyTreat);
    createdDailyTreat = await createdDailyTreat();
    let createdTime = Array.from(createdDailyTreat.imageUrl).reverse();
    const cutIndex = createdTime.indexOf('=');
    createdTime = createdTime.slice(0, cutIndex).reverse().join('');
    await DailyTreat.deleteOne({ _id: dailyTreatID });
    const mockUser = {
      _id: id, dailyFood: [id, id + 1, id + 2, id + 3],
    };
    let foundUser = await User.findOne.mockResolvedValue(mockUser);
    foundUser = await foundUser();
    foundUser.dailyFood = foundUser.dailyFood.filter((dailyTreat) => dailyTreat != dailyTreatID);
    expect(foundUser.dailyFood).not.toContain(dailyTreatID);
    foundUser.save = jest.fn();
    await foundUser.save.mockResolvedValue(mockUser);
    const excludeDeletePattern = new RegExp(`${id}/${createdTime}`); // regex statement left for the flow
    await helper.removeImageData.mockResolvedValue(true);
    await publishController.removeDish(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.send).toHaveBeenCalledTimes(1);
  });

  describe('checkDishesInRadius method', () => {
    test('checkDishesInRadius returns 500, because of interal server error', async () => {
      const { req, res } = setup();
      req.query = {
        id: 123456789, radius: 2, cookedOrdered: '{}', pageNumber: 1,
      };
      const {
        id, radius, cookedOrdered, pageNumber,
      } = req.query;
      const parsedCookedOrdered = JSON.parse(cookedOrdered);
      const mockErr = new Error('ERROR');
      await User.findOne.mockRejectedValue(mockErr);
      await publishController.checkDishesInRadius(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.send).toHaveBeenCalledTimes(1);
    });
    test('checkDishesInRadius returns 500, because axios has errored during the request', async () => {
      const { req, res } = setup();
      req.query = {
        id: 123456789, radius: 2, cookedOrdered: '{}', pageNumber: 1,
      };
      const {
        id, radius, cookedOrdered, pageNumber,
      } = req.query;
      const parsedCookedOrdered = JSON.parse(cookedOrdered);
      const mockUser = {
        _id: id, zipCode: 12345,
      };
      await User.findOne.mockResolvedValue(mockUser);
      const response = {
        data: {
          results: [{
            code: 12345,
            city: 'test city',
          },
          {
            code: 12345,
            city: 'test city 2',
          }],
        },
      };
      const mockErr = new Error('ERROR');
      await axios.get.mockRejectedValue(mockErr);
      await publishController.checkDishesInRadius(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.send).toHaveBeenCalledTimes(1);
    });
    test('checkDishesInRadius returns 409, because user could not be found, or user doest not have a zip code', async () => {
      const { req, res } = setup();
      req.query = {
        id: 123456789, radius: 2, cookedOrdered: '{}', pageNumber: 1,
      };
      const {
        id, radius, cookedOrdered, pageNumber,
      } = req.query;
      const parsedCookedOrdered = JSON.parse(cookedOrdered);
      await User.findOne.mockResolvedValue(null);
      await publishController.checkDishesInRadius(req, res);
      expect(res.status).toHaveBeenCalledWith(409);

      const mockUser = {
        _id: id,
      };
      await User.findOne.mockResolvedValue(mockUser);
      await publishController.checkDishesInRadius(req, res);
      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.status).toHaveBeenCalledTimes(2);
      expect(res.send).toHaveBeenCalledTimes(2);
    });
    test('checkDishesInRadius returns 404, because the api doesnt respond with data', async () => {
      const { req, res } = setup();
      req.query = {
        id: 123456789, radius: 2, cookedOrdered: '{}', pageNumber: 1,
      };
      const {
        id, radius, cookedOrdered, pageNumber,
      } = req.query;
      const parsedCookedOrdered = JSON.parse(cookedOrdered);
      const mockUser = {
        _id: id, zipCode: 12345,
      };
      await User.findOne.mockResolvedValue(mockUser);
      const response = {
        data: {
          results: {
            error: 'ERROR',
          },
        },
      };
      await axios.get.mockResolvedValue(response);
      await publishController.checkDishesInRadius(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.send).toHaveBeenCalledTimes(1);
    });
    test('checkDishesInRadius, findDishesInDB returns 500, daily treats couldn\'t be accessed within the db', async () => {
      const { req, res } = setup();
      req.query = {
        id: 123456789, radius: 2, cookedOrdered: '{}', pageNumber: 1,
      };
      const {
        id, radius, cookedOrdered, pageNumber,
      } = req.query;
      const parsedCookedOrdered = JSON.parse(cookedOrdered);
      const mockUser = {
        _id: id, zipCode: 12345,
      };
      await User.findOne.mockResolvedValue(mockUser);
      const response = {
        data: {
          results: [{
            code: 12345,
            city: 'test city',
          },
          {
            code: 12345,
            city: 'test city 2',
          }],
        },
      };
      await axios.get.mockResolvedValue(response);
      const mockErr = new Error('ERROR');
      await helper.findDishesInDB.mockRejectedValue(mockErr);
      await publishController.checkDishesInRadius(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.send).toHaveBeenCalledTimes(1);
    });
    test('checkDishesInRadius returns 200 and the daily treats in radius', async () => {
      const { req, res } = setup();
      req.query = {
        id: 123456789, radius: 2, cookedOrdered: '{}', pageNumber: 1,
      };
      const {
        id, radius, cookedOrdered, pageNumber,
      } = req.query;
      const parsedCookedOrdered = JSON.parse(cookedOrdered);
      const mockUser = {
        _id: id, zipCode: 12345,
      };
      await User.findOne.mockResolvedValue(mockUser);
      const response = {
        data: {
          results: [{
            code: 12345,
            city: 'test city',
          },
          {
            code: 12345,
            city: 'test city 2',
          }],
        },
      };
      await axios.get.mockResolvedValue(response);
      const dailyTreats = [{ _id: 123 }, { _id: 456 }];
      await helper.findDishesInDB.mockResolvedValue(dailyTreats);
      await publishController.checkDishesInRadius(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.send).toHaveBeenCalledTimes(1);
    });
  });
});

describe('upDownVote method', () => {
  test('upDownVote returns 500, because of interal server error while voting', async () => {
    const { req, res } = setup();
    req.params = { id: 123456789, dailyTreatID: 234567891 };
    req.query = { upDownVote: 'up' };
    const { id, dailyTreatID, upDown } = req.params;
    const mockErr = new Error('ERROR');
    await DailyTreat.findOneAndUpdate.mockRejectedValue(mockErr);
    await publishController.upDownVote(req, res);
    expect(res.status).toHaveBeenCalledWith(500);

    await DailyTreat.findOneAndUpdate.mockResolvedValue({});
    await User.findOneAndUpdate.mockRejectedValue(mockErr);
    await publishController.upDownVote(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.status).toHaveBeenCalledTimes(2);
    expect(res.send).toHaveBeenCalledTimes(2);
  });
  test('upDownVote returns 200, user without password and upvoted / downvoted dailytreat', async () => {
    const { req, res } = setup();
    req.params = { id: 123456789, dailyTreatID: 234567891 };
    req.query = { upDownVote: 'up' };
    const { id, dailyTreatID } = req.params;
    const initialVotes = 0;
    let mockDailyTreat = {
      _id: dailyTreatID, likedByUserID: [id], votes: initialVotes,
    };
    let mockUser = {
      _id: id, liked: [dailyTreatID], password: 'some unhashed pw',
    };
    mockDailyTreat = await DailyTreat.findOneAndUpdate.mockResolvedValue(mockDailyTreat);
    mockDailyTreat = await mockDailyTreat();
    mockUser = await User.findOneAndUpdate.mockResolvedValue(mockUser);
    mockUser = await mockUser();
    const userWithoutPassword = _.omit(mockUser, ['password']);
    await publishController.upDownVote(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({ user: userWithoutPassword, dailyTreat: mockDailyTreat });

    req.params = { id: 123456789, dailyTreatID: 234567891, upDown: 'down' };
    await publishController.upDownVote(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({ user: userWithoutPassword, dailyTreat: mockDailyTreat });
    expect(res.status).toHaveBeenCalledTimes(2);
    expect(res.send).toHaveBeenCalledTimes(2);
  });
});
