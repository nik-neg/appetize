const mongoose = require('mongoose');

const gridfs = require('gridfs-stream');

module.exports.saveImage = async (req, res) => { // TODO: return date information
  try {
    if (!req.file || req.file.length <= 0) {
      return res.send('You must select at least 1 file.');
    }
    res.status(201).end();
  } catch (error) {
    console.log(error);
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.send('Too many files to upload.');
    }
    return res.send(`Error when trying upload many files: ${error}`);
  }
};

module.exports.retrieveImage = async (req, res) => {
  gridfs.mongo = mongoose.mongo;
  const { connection } = mongoose;
  const gfs = gridfs(connection.db);
  const { created } = req.query;
  // loop through all fs.files and retrieve all images - in progress
  // posssible to loop n times with counter from dailyTreats

  // TODO: get only the daily published image with: today - uploadDate < 24 h
  // https://docs.mongodb.com/manual/core/gridfs/
  // https://www.npmjs.com/package/gridfs-stream
  gfs.files.findOne({
    filename: `${req.params.id}/${created}`, // TODO: pass date info user_id/date
    // uploadDate: { $gt: new Date(new Date().getTime() - time).toISOString() },
  }, (err, file) => {
    if (err || !file) {
      res.send('File Not Found');
    } else {
      const readstream = gfs.createReadStream({ // TODO: refactor ?
        filename: `${req.params.id}/${created}`,
      });
      readstream.pipe(res);
    }
  });
};

module.exports.removeImages = async (req, res) => { // TODO: add logic per day
  const { id } = req.params;
  const { date } = req.query;
  const deletePattern = new RegExp(`^(?!.+${date}$)${id}.*`);
  const { connection } = mongoose;
  let filesIDArray = [];
  connection.db.collection('fs.files', (err, collection) => {
    collection.find({ filename: { $regex: deletePattern } }).toArray((err, data) => {
      if (err) {
        console.log(err);
        res.status(500).end();
      }
      filesIDArray = data.map((entry) => entry._id);
      filesIDArray.forEach((fileId) => {
        connection.db.collection('fs.chunks').deleteOne({ files_id: fileId });
      });
      connection.db.collection('fs.files').deleteMany({ filename: { $regex: deletePattern } });
    });
  });
  res.end();
};
