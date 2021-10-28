/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
module.exports = {
  get: jest.fn(() => {}),
};
// testing suggestions from kent c. dotts
// const realAxios = require.requireActual('axios');

// mock object with reset functionlity
// const defaultResponse = { data: {} };

// const __mock = {
//   reset() {
//     Object.assign(__mock.instance, {
//       get: jest.fn(() => Promise.resolve(defaultResponse)),
//       put: jest.fn(() => Promise.resolve(defaultResponse)),
//       post: jest.fn(() => Promise.resolve(defaultResponse)),
//       delete: jest.fn(() => Promise.resolve(defaultResponse)),
//       defaults: { headers: { common: {} } },
//     });
//   },
//   instance: {},
// };

// __mock.reset();

// module.exports = {
//   __mock,
//   create() {
//     return __mock.instance;
//   },
// };

// ex.: axiosMock.__mock.instance.post.mockImplementation(() => {
//    return Promise.resolve({ data: { user: { token }}})
// })
