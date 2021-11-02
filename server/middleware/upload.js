const util = require('util');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const helper = require('../helpers/db.helpers');
require('dotenv').config();

const url = helper.initDBUrl();
const storage = new GridFsStorage({
  url,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: async (req, file) => {
    const { id } = req.params;
    const { imageURL, created } = req.query;
    if (imageURL) {
      const excludeDeletePattern = new RegExp(`^${id}/[0-9]*_avatar$`);
      await helper.removeImageData(excludeDeletePattern, 'deleteOne');
    }
    const match = ['image/png', 'image/jpeg']; // /\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/

    if (match.indexOf(file.mimetype) === -1) {
      const filename = `${req.params.id}/${created}`;
      return filename;
    }
    return {
      bucketName: 'fs',
      filename: `${req.params.id}/${created}`,
    };
  },
});

const uploadFiles = multer({ storage }).single('file');
const uploadFilesMiddleware = util.promisify(uploadFiles);
module.exports = uploadFilesMiddleware;
