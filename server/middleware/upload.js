const util = require("util");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");

var storage = new GridFsStorage({
  url: "mongodb://localhost:27017/appetizeDB",
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    const match = ["image/png", "image/jpeg"]; // /\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/

    if (match.indexOf(file.mimetype) === -1) {
      const filename = `${req.params.id}`; // id of user is filename
      return filename;
    }

    return {
      bucketName: "fs",
      filename: `${req.params.id}` // id of user is filename
    };
  }
});



// var uploadFiles = multer({ storage: storage }).array("multi-files", 10);
var uploadFiles = multer({ storage: storage }).single("file");
var uploadFilesMiddleware = util.promisify(uploadFiles);
module.exports = uploadFilesMiddleware;
