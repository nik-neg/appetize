// /* eslint-disable no-underscore-dangle */
// /* eslint-disable no-await-in-loop */
// /* eslint-disable no-restricted-syntax */
// /* eslint-disable no-undef */
// const supertest = require('supertest');
// const _ = require('lodash');
// const sinon = require('sinon');
// const User = require('../../models/User');
// const DailyTreat = require('../../models/DailyTreat');
// const db = require('../../models/db');
// const helper = require('../../helpers/db.helpers');
// const startServer = require('../integrationServer');

// jest.unmock('mongoose');
// jest.unmock('jsonwebtoken');
// jest.unmock('lodash');
// jest.unmock('../../models/User');

// let resolvedServer;
// let request;

// async function removeAllCollections() {
//   const collections = Object.keys(db.mongoose.connection.collections);
//   for (const collectionName of collections) {
//     const collection = db.mongoose.connection.collections[collectionName];
//     await collection.deleteMany();
//   }
// }

// let sandbox;
// beforeEach(() => startServer()
//   .then(({ server, app }) => {
//     resolvedServer = server;
//     request = supertest(app);
//     sandbox = sinon.createSandbox();
//   }));

// afterEach(async () => {
//   if (resolvedServer) resolvedServer.close();
//   if (sandbox) sandbox.restore();
//   await removeAllCollections();
//   await db.mongoose.disconnect();
// });

