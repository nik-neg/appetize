const express = require('express');

const app = express();

const cors = require('cors');

const bodyParser = require('body-parser');

const router = require('./router');

const db = require('./models/db');

require('dotenv').config();

const corsConfig = {
  origin: 'http://localhost:3000',
  credentials: true,
};

app.use(cors(corsConfig))
  .use(bodyParser())
  .use(express.urlencoded({ extended: true }))
  .use(express.json())
  .use(router);

(async () => {
  try {
    db.connect();
    const PORT = process.env.SERVER_PORT;
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
})();
