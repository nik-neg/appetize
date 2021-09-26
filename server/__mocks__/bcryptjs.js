/* eslint-disable no-undef */
module.exports = {
  hash: jest.fn((password) => Array.from(password).reverse().join('')), // simulate hash with diff string
  compare: jest.fn((pw1, pw2) => Array.from(pw1).reverse().join('') === pw2), // simulate password check
};
