/* eslint-disable no-undef */
module.exports = { hash: jest.fn((password) => Array.from(password).reverse().join('')) }; // simulate hash with diff string
