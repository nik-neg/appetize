/* eslint-disable prefer-template */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-undef */
const supertest = require('supertest');
const _ = require('lodash');
const FormData = require('form-data');
const sinon = require('sinon');
const mongoose = require('mongoose');
const gridfs = require('gridfs-stream');
const User = require('../../models/User');
const DailyTreat = require('../../models/DailyTreat');
const db = require('../../models/db');
const helper = require('../../helpers/db.helpers');
// const upload = require('../../middleware/upload');
const startServer = require('../integrationServer');

// jest.mock('./../../middleware/upload', () => jest.fn((req, res, next) => next()));

jest.unmock('mongoose');
jest.unmock('gridfs-stream');
jest.unmock('../../helpers/db.helpers');
jest.unmock('jsonwebtoken');
jest.unmock('lodash');
jest.unmock('../../models/User');

let resolvedServer;
let request;

async function removeAllCollections() {
  const collections = Object.keys(db.mongoose.connection.collections);
  for (const collectionName of collections) {
    const collection = db.mongoose.connection.collections[collectionName];
    await collection.deleteMany();
  }
}

let sandbox;
beforeEach(() => startServer()
  .then(({ server, app }) => {
    resolvedServer = server;
    request = supertest(app);
    sandbox = sinon.createSandbox();
  }));

afterEach(async () => {
  if (resolvedServer) resolvedServer.close();
  if (sandbox) sandbox.restore();
  await removeAllCollections();
  await db.mongoose.disconnect();
});

describe('integration test of image controller - saveImage', () => {
  test('should return 500, because of internal server error', async () => {
    const createResult = await request.post('/register')
      .send({
        firstName: 'firstName',
        lastName: 'lastName',
        email: 'testing@test.com',
        password: 'password',
      })
      .expect(201);
    const { body: { user } } = createResult;
    const { _id } = user;

    sandbox.stub(User, 'findOne').throws(Error('User.findOne'));
    const imageURL = 'http://some url';
    await request.post(`/profile/${_id}/upload`)
      .send()
      .query({ imageURL })
      .expect(500);
  });
  test('should return 201, because no error occured and the middleware saved the image', async () => {
    const createResult = await request.post('/register')
      .send({
        firstName: 'firstName',
        lastName: 'lastName',
        email: 'testing@test.com',
        password: 'password',
      })
      .expect(201);
    const { body: { user } } = createResult;
    const { _id } = user;
    await request.post(`/profile/${_id}/upload`)
      .send()
      .query({ imageURL: undefined, created: new Date().getTime() })
      .expect(201);
  });
  test('should return 201 and update the avatar url, because no error occured and the middleware saved the image', async () => {
    const createResult = await request.post('/register')
      .send({
        firstName: 'firstName',
        lastName: 'lastName',
        email: 'testing@test.com',
        password: 'password',
      })
      .expect(201);
    const { body: { user } } = createResult;
    const { _id } = user;
    const baseUrl = 'http://localhost:3001';
    const chosenImageDate = new Date().getTime();
    let imageURL = `${baseUrl}/profile/${_id}/download?created=`;
    imageURL += chosenImageDate.toString() + '_avatar';
    await request.post(`/profile/${_id}/upload`)
      .send()
      .query({ imageURL })
      .expect(201);
    const updatedUser = await User.findOne({ _id });
    expect(updatedUser.avatarImageUrl).toBe(imageURL);
  });
});
describe('integration test of image controller - retrieveImage', () => {
  test('should return 500, because of internal server error', async () => {
    const createResult = await request.post('/register')
      .send({
        firstName: 'firstName',
        lastName: 'lastName',
        email: 'testing@test.com',
        password: 'password',
      })
      .expect(201);
    const { body: { user } } = createResult;
    const { _id } = user;

    sandbox.stub(helper, 'findImageFile').throws(Error('helper.findImageFile'));
    await request.get(`/profile/${_id}/download`)
      .send()
      .query()
      .expect(500);
  });
  test('should return 404, because image could not be found', async () => {
    const createResult = await request.post('/register')
      .send({
        firstName: 'firstName',
        lastName: 'lastName',
        email: 'testing@test.com',
        password: 'password',
      })
      .expect(201);
    const { body: { user } } = createResult;
    const { _id } = user;

    sandbox.stub(helper, 'findImageFile').returns(null);
    await request.get(`/profile/${_id}/download`)
      .send()
      .query()
      .expect(404);
  });
});
describe('integration test of image controller - removeImages', () => {
  test('should return 500, because of internal server error', async () => {
    const createResult = await request.post('/register')
      .send({
        firstName: 'firstName',
        lastName: 'lastName',
        email: 'testing@test.com',
        password: 'password',
      })
      .expect(201);
    const { body: { user } } = createResult;
    const { _id } = user;
    sandbox.stub(DailyTreat, 'find').throws(Error('DailyTreat.find'));
    await request.delete(`/profile/${_id}/remove-images`)
      .expect(500);
  });
  test('should return 500, because of internal server error in the helper method', async () => {
    const createResult = await request.post('/register')
      .send({
        firstName: 'firstName',
        lastName: 'lastName',
        email: 'testing@test.com',
        password: 'password',
      })
      .expect(201);
    const { body: { user } } = createResult;
    const { _id } = user;
    sandbox.stub(helper, 'removeImageData').throws(Error('helper.removeImageData'));
    await request.delete(`/profile/${_id}/remove-images`)
      .expect(500);
  });
  test('should return 200, because request succeeded', async () => {
    const createResult = await request.post('/register')
      .send({
        firstName: 'firstName',
        lastName: 'lastName',
        email: 'testing@test.com',
        password: 'password',
      })
      .expect(201);
    const { body: { user } } = createResult;
    const { _id } = user;
    sandbox.stub(helper, 'removeImageData').returns({ deletedCount: 1 });
    await request.delete(`/profile/${_id}/remove-images`)
      .expect(200);
  });
});
