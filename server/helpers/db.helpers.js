const mongoose = require('mongoose');

module.exports.removeImageData = (regex, deleteOptionForFiles, res) => {
  const { connection } = mongoose;
  try {
    connection.db.collection('fs.files', (err, collection) => {
      collection.find({ filename: { $regex: regex } }).toArray((err, data) => {
        if (err) console.log(err);
        const filesIDArray = data.map((entry) => entry._id);
        filesIDArray.forEach((fileId) => {
          connection.db.collection('fs.chunks').deleteOne({ files_id: fileId });
        });
        connection.db.collection('fs.files')[deleteOptionForFiles]({ filename: { $regex: regex } });
      });
    });
    if (res) res.status(200).send({});
  } catch (err) {
    console.log(err);
    if (res) res.status(500).send();
  }
};
