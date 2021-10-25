/* eslint-disable no-underscore-dangle */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-undef */
const supertest = require('supertest');
const _ = require('lodash');
const sinon = require('sinon');
const User = require('../../models/User');
const DailyTreat = require('../../models/DailyTreat');
const db = require('../../models/db');
const helper = require('../../helpers/db.helpers');
const startServer = require('../integrationServer');

jest.unmock('mongoose');
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
// hint: --runInBand or --maxWorkers=1 resolves port already in use issue
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
describe('integration test of publish controller - publishDish', () => {
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
    sandbox.stub(User, 'findOne').throws(Error('User.findOne'));

    const { _id } = user;
    await request.post(`/profile/${_id}/dashboard`)
      .send()
      .expect(500);
  });
  test('should return 400, because user could not be found', async () => {
    const createResult = await request.post('/register')
      .send({
        firstName: 'firstName',
        lastName: 'lastName',
        email: 'testing@test.com',
        password: 'password',
      })
      .expect(201);
    const { body: { user } } = createResult;
    sandbox.stub(User, 'findOne').returns(null);
    const { _id } = user;
    await request.post(`/profile/${_id}/dashboard`)
      .send()
      .expect(400);
  });
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
    sandbox.stub(DailyTreat, 'create').throws(Error('DailyTreat.create'));

    const { _id } = user;
    await request.post(`/profile/${_id}/dashboard`)
      .send()
      .expect(500);
  });
  test('should return 201, because no error occured', async () => {
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
    await request.post(`/profile/${_id}/dashboard`)
      .send()
      .expect(201);
  });
});

describe('integration test of publish controller - removeDish', () => {
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
    const dailyTreat = await request.post(`/profile/${_id}/dashboard`)
      .send()
      .expect(201);
    const dailyTreatID = dailyTreat.body._id;

    sandbox.stub(DailyTreat, 'findOne').throws(Error('DailyTreat.findOne'));
    await request.delete(`/profile/${_id}/dashboard/${dailyTreatID}`)
      .send()
      .expect(500);
  });
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
    const dailyTreat = await request.post(`/profile/${_id}/dashboard`)
      .send()
      .expect(201);
    const dailyTreatID = dailyTreat.body._id;

    sandbox.stub(DailyTreat, 'deleteOne').throws(Error('DailyTreat.deleteOne'));
    await request.delete(`/profile/${_id}/dashboard/${dailyTreatID}`)
      .send()
      .expect(500);
  });
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
    const dailyTreat = await request.post(`/profile/${_id}/dashboard`)
      .send()
      .expect(201);
    const dailyTreatID = dailyTreat.body._id;

    sandbox.stub(User, 'findOne').throws(Error('User.findOne'));
    await request.delete(`/profile/${_id}/dashboard/${dailyTreatID}`)
      .send()
      .expect(500);
  });
  test('should return 409, because image could not be remvoved', async () => {
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
    const dailyTreat = await request.post(`/profile/${_id}/dashboard`)
      .send()
      .expect(201);
    const dailyTreatID = dailyTreat.body._id;

    sandbox.stub(helper, 'removeImageData').returns(null);
    await request.delete(`/profile/${_id}/dashboard/${dailyTreatID}`)
      .send()
      .expect(409);
  });
  test('should return 200, because image could be removed', async () => {
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

    // TODO: upload image or test middleware isolated?

    // then publish daily treat
    const dailyTreat = await request.post(`/profile/${_id}/dashboard`)
      .send({ chosenImageDate: new Date().getTime() })
      .expect(201);
    const dailyTreatID = dailyTreat.body._id;

    // then remove daily treat with image
    sandbox.stub(helper, 'removeImageData').returns(true);
    await request.delete(`/profile/${_id}/dashboard/${dailyTreatID}`)
      .send()
      .expect(200);
  });
});
