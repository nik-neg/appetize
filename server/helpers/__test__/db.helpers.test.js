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
  test('findDishesInDB method', async () => {

  });
});
