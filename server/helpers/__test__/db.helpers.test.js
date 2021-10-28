/* eslint-disable no-underscore-dangle */
/* eslint-disable max-len */
/* eslint-disable no-undef */
const mongoose = require('mongoose');
const DailyTreat = require('../../models/DailyTreat');
const helper = require('../db.helpers');

jest.mock('mongoose');
jest.mock('../../models/DailyTreat');

beforeEach(() => {
  mongoose.connection.db.collection.find = jest.fn();
  mongoose.connection.db.collection.find.toArray = jest.fn();
  mongoose.connection.db.collection.find.toArray.map = jest.fn();
  mongoose.connection.db.collection.deleteOne = jest.fn();
  mongoose.connection.db.collection.deleteMany = jest.fn();
  DailyTreat.limit = jest.fn();
});

describe('helpers methods', () => {
  test('removeImageData method returns false if one or both of the parameter are not specified, else true', async () => {
    const excludeDeletePattern = new RegExp(`${123456789}/${new Date().getTime()}`);
    const deleteOptionForFiles = 'deleteOne';
    let res = await helper.removeImageData('', deleteOptionForFiles);
    expect(res).toBe(false);
    res = await helper.removeImageData(excludeDeletePattern, '');
    expect(res).toBe(false);
    res = await helper.removeImageData('', '');
    expect(res).toBe(false);
    res = await helper.removeImageData(excludeDeletePattern, deleteOptionForFiles);
    expect(res).toBe(true);
  });
  test('removeImageData method returns true after deletion a not specified amount of items', async () => {
    const excludeDeletePattern = new RegExp(`${123456789}/${new Date().getTime()}`);
    let deleteOptionForFiles = 'deleteOne';
    const mockFileData = [{ _id: 123, info: 'some info' }, { _id: 456, info: 'some info' }, { _id: 789, info: 'some info' }];
    const { connection } = mongoose;
    let data = await connection.db.collection.find.mockResolvedValue({});
    data = await data();
    data.toArray = jest.fn();
    data = data.toArray.mockResolvedValue(mockFileData);
    data = await data();
    const filesIDArray = mockFileData.map((entry) => entry._id);
    filesIDArray.forEach = jest.fn();
    filesIDArray.forEach.mockResolvedValue({});
    let deletedItems = 1; // mocked
    let result = await connection.db.collection[deleteOptionForFiles].mockResolvedValue({ deletedCount: deletedItems });
    result = await result();
    expect(result.deletedCount).toBe(deletedItems);
    let res = await helper.removeImageData(excludeDeletePattern, deleteOptionForFiles);
    expect(res).toBe(true);

    deleteOptionForFiles = 'deleteMany';
    deletedItems = 3; // mocked
    result = await connection.db.collection[deleteOptionForFiles].mockResolvedValue({ deletedCount: deletedItems });
    result = await result();
    expect(result.deletedCount).toBe(deletedItems);
    res = await helper.removeImageData(excludeDeletePattern, deleteOptionForFiles);
    expect(res).toBe(true);
  });
  test('findDishesInDB method return empty array due to invalid parameters', async () => {
    let res = await helper.findDishesInDB({}, {});
    expect(res).toEqual([]);
    res = await helper.findDishesInDB({});
    expect(res).toEqual([]);
    res = await helper.findDishesInDB();
    expect(res).toEqual([]);
  });
  test('findDishesInDB method return an array with daily treat info and city names', async () => {
    const zipCodesInRadius = [
      { zipCode: 12345, city: 'Amsterdam' },
      { zipCode: 23456, city: 'Berlin' },
      { zipCode: 34567, city: 'Chigago' },
    ];
    let cookedOrdered = {
      cooked: true,
      ordered: true,
    };
    const ALL_DISHES = 'ALL_DISHES';
    let cookedOrderedParam = cookedOrdered.cooked === cookedOrdered.ordered
      ? ALL_DISHES : cookedOrdered.cooked;
    let queryObject = {};
    if (cookedOrderedParam !== ALL_DISHES) {
      queryObject.cookedNotOrdered = cookedOrderedParam;
    }
    expect(queryObject).toEqual({});

    cookedOrdered = {
      cooked: false,
      ordered: false,
    };
    cookedOrderedParam = cookedOrdered.cooked === cookedOrdered.ordered
      ? ALL_DISHES : cookedOrdered.cooked;
    queryObject = {};
    if (cookedOrderedParam !== ALL_DISHES) {
      queryObject.cookedNotOrdered = cookedOrderedParam;
    }
    expect(queryObject).toEqual({});
    cookedOrdered = {
      cooked: true,
      ordered: false,
    };
    cookedOrderedParam = cookedOrdered.cooked === cookedOrdered.ordered
      ? ALL_DISHES : cookedOrdered.cooked;
    queryObject = {};
    if (cookedOrderedParam !== ALL_DISHES) {
      queryObject.cookedNotOrdered = cookedOrderedParam;
    }
    expect(queryObject.cookedNotOrdered).toEqual(true);
    cookedOrdered = {
      cooked: false,
      ordered: true,
    };
    cookedOrderedParam = cookedOrdered.cooked === cookedOrdered.ordered
      ? ALL_DISHES : cookedOrdered.cooked;
    queryObject = {};
    if (cookedOrderedParam !== ALL_DISHES) {
      queryObject.cookedNotOrdered = cookedOrderedParam;
    }
    expect(queryObject.cookedNotOrdered).toEqual(false);

    const pageNumber = 1;
    const mockedDailyTreats = [
      {
        _doc: {
          _id: 123, title: 'Pasta', userID: 1,
        },
        zipCode: '12345',
      },
      {
        _doc: {
          _id: 456, title: 'Pizza', userID: 2,
        },
        zipCode: '23456',
      },
    ];
    let dailyTreats = await DailyTreat.find();
    dailyTreats = dailyTreats.skip();
    dailyTreats = dailyTreats.limit.mockResolvedValue(mockedDailyTreats);
    dailyTreats = await dailyTreats();
    const zipCodeCityObject = {};
    zipCodesInRadius.forEach((zipCodeCity) => {
      zipCodeCityObject[zipCodeCity.zipCode] = zipCodeCity.city;
    });
    dailyTreats = dailyTreats.map((dailyTreat) => {
      const dailyTreatWithCity = { ...dailyTreat._doc, city: zipCodeCityObject[dailyTreat.zipCode] };
      return dailyTreatWithCity;
    });
    res = await helper.findDishesInDB(zipCodesInRadius, cookedOrdered, pageNumber);
    expect(res).toEqual(dailyTreats);
  });
});
