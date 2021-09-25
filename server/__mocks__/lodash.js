/* eslint-disable no-undef */
const defaultResponse = {
  firstName: 'firstName',
  lastName: 'lastName',
  email: 'email',
};
module.exports = { omit: jest.fn((obj, keyArray) => defaultResponse) }; // omit pw
