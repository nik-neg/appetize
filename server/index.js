const express = require('express');

const app = express();
const cors = require('cors');

const bodyParser = require('body-parser');

const router = require('./router');

const db = require('./models/db');

app.use(cors())
  // .use("/", express.static(__dirname + '/index.html'))
  .use(bodyParser())
  .use(express.urlencoded({ extended: true }))
  .use(express.json())
  .use(router);

(async () => {
  try {
    db.connect();
    const PORT = 3001;
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
})();

// module.exports = app;
