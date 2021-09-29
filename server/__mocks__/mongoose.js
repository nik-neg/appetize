/* eslint-disable no-undef */
module.exports = {
  connection: {
    db: {
      collection: {
        'fs.files': {
          deleteOne: async () => {},
          find: async () => {},
        },
        'fs.chunks': {
          deleteOne: async () => {},
          deleteMany: async () => {},
        },
      },
    },
  },
};
