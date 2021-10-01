/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const deleteOne = { deletedCount: 1 };
const deleteMany = { deletedCount: 3 };
module.exports = {
  connection: {
    db: {
      collection: (bucketPath) => ({
        find: () => ({ toArray: () => ({ map: () => [123, 456, 789] }) }),
        deleteOne: async () => deleteOne,
        deleteMany: async () => deleteMany,
      }),
    },
  },
};
