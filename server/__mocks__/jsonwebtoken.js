/* eslint-disable no-undef */
module.exports = { sign: jest.fn(({ id }, key) => Array.from(+id).reverse().join('')) }; // simulate sign with diff string
