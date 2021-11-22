/* eslint-disable no-underscore-dangle */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-undef */
const supertest = require('supertest');
const _ = require('lodash');
const sinon = require('sinon');
const User = require('../../models/User');
const db = require('../../models/db');
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

describe('integration test of user controller - createUser', () => {
  test('should return 409, because user already exists', async () => {
    await request.post('/register')
      .send({
        firstName: 'firstName',
        lastName: 'lastName',
        email: 'testing@test.com',
        password: 'password',
      })
      .expect(201);

    await request.post('/register')
      .send({
        firstName: 'firstName',
        lastName: 'lastName',
        email: 'testing@test.com',
        password: 'password',
      })
      .expect(409);
  });
  test('should return 400, because of invalid input', async () => {
    await request.post('/register')
      .send({
        firstName: '',
        lastName: 'lastName',
        email: 'testing@test.com',
        password: 'password',
      })
      .expect(400);
  });
  test('should return 400, because of invalid input', async () => {
    await request.post('/register')
      .send({
        firstName: 'firstName',
        lastName: '',
        email: 'testing@test.com',
        password: 'password',
      })
      .expect(400);
  });
  test('should return 400, because of invalid input', async () => {
    await request.post('/register')
      .send({
        firstName: 'firstName',
        lastName: 'lastName',
        email: '',
        password: 'password',
      })
      .expect(400);
  });
  test('should return 400, because of invalid input', async () => {
    await request.post('/register')
      .send({
        firstName: 'firstName',
        lastName: 'lastName',
        email: 'testing@test.com',
        password: '',
      })
      .expect(400);
  });
  test('should return 500, because of internal server error, when creating the user', async () => {
    sandbox.stub(User, 'create').throws(Error('User.create'));
    await request.post('/register')
      .send({
        firstName: 'firstName',
        lastName: 'lastName',
        email: 'testing@test.com',
        password: 'password',
      })
      .expect(500);
  });
  test('should save user to database and return 201', async () => {
    await request.post('/register')
      .send({
        firstName: 'firstName',
        lastName: 'lastName',
        email: 'testing@test.com',
        password: 'password',
      })
      .expect(201);
    const user = await User.findOne({ email: 'testing@test.com' });
    expect(user._id).toBeTruthy();
  });
});
describe('integration test of user controller - loginUser', () => {
  test('should return 400, because email or password is not provided', async () => {
    await request.post('/login')
      .send({
        email: '',
        password: 'password',
      })
      .expect(400);
  });
  test('should return 400, because email or password is not provided', async () => {
    await request.post('/login')
      .send({
        email: 'testing@test.com',
        password: '',
      })
      .expect(400);
  });
  test('should return 500, because of internal server error', async () => {
    sandbox.stub(User, 'findOne').throws(Error('User.findOne'));
    await request.post('/login')
      .send({
        email: 'testing@test.com',
        password: 'password',
      })
      .expect(500);
  });
  test('should return 401, because of wrong password', async () => {
    await request.post('/register') // better to create via register then to create and hash password here
      .send({
        firstName: 'firstName',
        lastName: 'lastName',
        email: 'testing@test.com',
        password: 'password',
      })
      .expect(201);
    await request.post('/login')
      .send({
        email: 'testing@test.com',
        password: 'wrongPassword',
      })
      .expect(401);
  });
  test.skip('should return 200, because email and password are correct', async () => {
    const createResult = await request.post('/register')
      .send({
        firstName: 'firstName',
        lastName: 'lastName',
        email: 'testing@test.com',
        password: 'password',
      })
      .expect(201);

    const { body: { accessToken } } = createResult;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    };
    await request.post('/logout') // then logout
      .set(headers)
      .send()
      .expect(200, {});

    await request.post('/login') // then login
      .send({
        email: 'testing@test.com',
        password: 'password',
      })
      .expect(200);
  });
});
describe('integration test of user controller - logoutUser', () => {
  test('should return 403, because user is not authorized', async () => {
    await request.post('/register')
      .send({
        firstName: 'firstName',
        lastName: 'lastName',
        email: 'testing@test.com',
        password: 'password',
      })
      .expect(201);

    await request.post('/logout')
      .send()
      .expect(403);
  });
  test('should return 401, because of malformed authentication token', async () => {
    await request.post('/register')
      .send({
        firstName: 'firstName',
        lastName: 'lastName',
        email: 'testing@test.com',
        password: 'password',
      })
      .expect(201);

    const accessToken = 'some wrong or malformed token';
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    };
    await request.post('/logout')
      .set(headers)
      .send()
      .expect(401);
  });
  test('should return 401, because user could not be found, e.g. deleted user', async () => {
    await request.post('/register')
      .send({
        firstName: 'firstName',
        lastName: 'lastName',
        email: 'testing@test.com',
        password: 'password',
      })
      .expect(201);

    const accessToken = 'some wrong or malformed token';
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    };
    await User.deleteOne({ email: 'testing@test.com' });
    await request.post('/logout')
      .set(headers)
      .send()
      .expect(401);
  });
  test('should return 500, because of internal server error', async () => {
    const res = await request.post('/register')
      .send({
        firstName: 'firstName',
        lastName: 'lastName',
        email: 'testing@test.com',
        password: 'password',
      })
      .expect(201);

    const { body: { accessToken } } = res;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    };
    sandbox.stub(User, 'findOne').throws(Error('User.findOne'));
    await request.post('/logout')
      .set(headers)
      .send()
      .expect(500);
  });
  test('should return 200 and an empty object due to authenticated logout after register', async () => {
    const createResult = await request.post('/register')
      .send({
        firstName: 'firstName',
        lastName: 'lastName',
        email: 'testing@test.com',
        password: 'password',
      })
      .expect(201);

    const { body: { accessToken } } = createResult;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    };
    await request.post('/logout')
      .set(headers)
      .send()
      .expect(200, {});
  });
  test.skip('should return 200 and an empty object due to authenticated logout after login', async () => {
    const createResult = await request.post('/register')
      .send({
        firstName: 'firstName',
        lastName: 'lastName',
        email: 'testing@test.com',
        password: 'password',
      })
      .expect(201);

    let { body: { accessToken } } = createResult;
    let headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    };
    await request.post('/logout')
      .set(headers)
      .send()
      .expect(200, {});

    const loginResult = await request.post('/login')
      .send({
        email: 'testing@test.com',
        password: 'password',
      })
      .expect(200);

    accessToken = loginResult.body.accessToken;
    headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    };
    await request.post('/logout')
      .set(headers)
      .send()
      .expect(200, {});
  });
});

describe('integration test of user controller - showProfile', () => {
  test('should return 400, because user is not present in request after register', async () => {
    const createResult = await request.post('/register')
      .send({
        firstName: 'firstName',
        lastName: 'lastName',
        email: 'testing@test.com',
        password: 'password',
      })
      .expect(201);

    const { body: { accessToken } } = createResult;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    };

    sandbox.stub(_, 'omit').returns(null); // mocking error with omit or transmission
    await request.get('/profile')
      .set(headers)
      .send()
      .expect(400);
  });
  test('should return 200, because user is present in request after register', async () => {
    const createResult = await request.post('/register')
      .send({
        firstName: 'firstName',
        lastName: 'lastName',
        email: 'testing@test.com',
        password: 'password',
      })
      .expect(201);

    const { body: { accessToken } } = createResult;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    };
    await request.get('/profile')
      .set(headers)
      .send()
      .expect(200);
  });
  test.skip('should return 400, because user is not present in request after login', async () => {
    const createResult = await request.post('/register')
      .send({
        firstName: 'firstName',
        lastName: 'lastName',
        email: 'testing@test.com',
        password: 'password',
      })
      .expect(201);

    let { accessToken } = createResult.body;
    let headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    };
    await request.post('/logout') // then logout
      .set(headers)
      .send()
      .expect(200, {});

    const loginResult = await request.post('/login') // then login
      .send({
        email: 'testing@test.com',
        password: 'password',
      })
      .expect(200);
    accessToken = loginResult.body.accessToken;
    headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    };
    sandbox.stub(_, 'omit').returns(null); // mocking error with omit or transmission
    await request.get('/profile')
      .set(headers)
      .send()
      .expect(400);
  });
  test.skip('should return 200, because user is present in request after login', async () => {
    const createResult = await request.post('/register')
      .send({
        firstName: 'firstName',
        lastName: 'lastName',
        email: 'testing@test.com',
        password: 'password',
      })
      .expect(201);

    let { accessToken } = createResult.body;
    let headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    };
    await request.post('/logout') // then logout
      .set(headers)
      .send()
      .expect(200, {});

    const loginResult = await request.post('/login') // then login
      .send({
        email: 'testing@test.com',
        password: 'password',
      })
      .expect(200);
    accessToken = loginResult.body.accessToken;
    headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    };
    await request.get('/profile')
      .set(headers)
      .send()
      .expect(200);
  });
});

describe('integration test of user controller - setZipCode', () => {
  test('should return 500, because of internal server error', async () => {
    const createResult = await request.post('/register')
      .send({
        firstName: 'firstName',
        lastName: 'lastName',
        email: 'testing@test.com',
        password: 'password',
      })
      .expect(201);
    const { _id } = createResult.body.user;
    sandbox.stub(User, 'findOne').throws(Error('User.findOne'));
    await request.put(`/profile/${_id}`)
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
    const { _id } = createResult.body.user;
    sandbox.stub(User, 'findOne').returns(null);
    await request.put(`/profile/${_id}`)
      .send()
      .expect(400);
  });
  test('should return 201, because user could update the zip code, after register', async () => {
    const createResult = await request.post('/register')
      .send({
        firstName: 'firstName',
        lastName: 'lastName',
        email: 'testing@test.com',
        password: 'password',
      })
      .expect(201);
    const { _id } = createResult.body.user;
    await request.put(`/profile/${_id}`)
      .send({ city: 'Berlin' })
      .expect(201);
  });
  test.skip('should return 201, because user could update the zip code, after login', async () => {
    const createResult = await request.post('/register')
      .send({
        firstName: 'firstName',
        lastName: 'lastName',
        email: 'testing@test.com',
        password: 'password',
      })
      .expect(201);

    const { accessToken } = createResult.body;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    };
    await request.post('/logout') // then logout
      .set(headers)
      .send()
      .expect(200, {});

    await request.post('/login') // then login
      .send({
        email: 'testing@test.com',
        password: 'password',
      })
      .expect(200);
    const { _id } = createResult.body.user;
    await request.put(`/profile/${_id}`)
      .send({ city: 'Berlin' })
      .expect(201);
  });
});
