const express = require('express');

const app = express();
const cors = require('cors');

const router = require('./router');

const db = require('./models/db');

app.use(cors())
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
