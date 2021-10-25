const express = require('express');
const bodyParser = require('body-parser');
const db = require('../models/db');
const router = require('../router');
require('dotenv').config();

async function startServer() {
  const app = express();

  app.use(bodyParser.json())
    .use(bodyParser())
    .use(express.urlencoded({ extended: true }))
    .use(express.json())
    .use(router);

  // start db before listen
  (async () => {
    const testURL = process.env.TEST_DB_URL;
    try {
      await db.connect(testURL);
    } catch (err) {
      console.log(err);
    }
  })();

  let PORT = process.env.SERVER_PORT;
  // PORT = +PORT + Math.ceil(Math.random() * 30000);
  return new Promise((resolve) => {
    const server = app.listen(PORT, () => {
      resolve({ server, app });
    });
  });
}

module.exports = startServer;
