/* eslint-disable no-undef */
__webpack_base_uri__ = 'http://localhost:8080';
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: './dist',
  },
  entry: path.resolve(__dirname, 'src') + '/index.jsx',
});