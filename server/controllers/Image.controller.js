const mongoose = require('mongoose');

var gridfs = require('gridfs-stream');

module.exports.saveImage = async (req, res) => {
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
  // console.log('RETRIEVE IMAGE')
  gridfs.mongo = mongoose.mongo;
  var connection = mongoose.connection;
  var gfs = gridfs(connection.db);
  // loop through all fs.files and retrieve all images - in progress
  // posssible to loop n times with counter from dailyTreats
  gfs.exist({ filename: req.params.id }, function (err, file) {
    if (err || !file) {
      res.send('File Not Found');
    } else {
      var readstream = gfs.createReadStream({ filename: req.params.id });
      readstream.pipe(res);
    }
  });
};
