const util = require('util');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');

const storage = new GridFsStorage({
  url: 'mongodb://localhost:27017/appetizeDB',
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    const match = ['image/png', 'image/jpeg']; // /\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/

    if (match.indexOf(file.mimetype) === -1) {
      const filename = `${req.params.id}/${req.query.created}`; // id of user is filename
      return filename;
    }

    return {
      bucketName: 'fs',
      filename: `${req.params.id}/${req.query.created}`, // id of user is filename, TODO: use req.query.param of date to create a id: user_id/date
    };
  },
});

// var uploadFiles = multer({ storage: storage }).array('multi-files', 10);
const uploadFiles = multer({ storage }).single('file');
const uploadFilesMiddleware = util.promisify(uploadFiles);
module.exports = uploadFilesMiddleware;
