const util = require('util');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const helper = require('../helpers/db.helpers');

const storage = new GridFsStorage({
  url: 'mongodb://localhost:27017/appetizeDB',
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    const { id } = req.params;
    const { imageURL } = req.query;
    if (imageURL) {
      const excludeDeletePattern = new RegExp(`^${id}/[0-9]*_avatar$`);
      helper.removeImageData(excludeDeletePattern, 'deleteOne');
    }
    const match = ['image/png', 'image/jpeg']; // /\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/

    if (match.indexOf(file.mimetype) === -1) {
      const filename = `${req.params.id}/${req.query.created}`;
      return filename;
    }

    return {
      bucketName: 'fs',
      filename: `${req.params.id}/${req.query.created}`,
    };
  },
});

// var uploadFiles = multer({ storage: storage }).array('multi-files', 10);
const uploadFiles = multer({ storage }).single('file');
const uploadFilesMiddleware = util.promisify(uploadFiles);
module.exports = uploadFilesMiddleware;
