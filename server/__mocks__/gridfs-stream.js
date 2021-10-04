/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const filenameObject = { filename: 'filename' };
const { Readable } = require('stream');

const mockReadStream = jest.fn().mockImplementation(() => {
  const readable = new Readable();
  readable.pipe = jest.fn();
  readable.unpipe = jest.fn();
  readable.push('hello');
  readable.push('world');
  readable.push(null);

  readable.on('data', (chunk) => {
    // console.log('MOCK', chunk);
    readable.destroy();
  })
    .on('end', (err) => {
      // console.log('MOCK: END');
    })
    .on('close', (err) => {
      // console.log('MOCK: CLOSE');
    });

  return readable;
});

const mockGridFsObject = {
  files: {
    findOne: (filenameObject) => jest.fn(),
  },
  createReadStream: () => mockReadStream,
};

module.exports = () => mockGridFsObject;
