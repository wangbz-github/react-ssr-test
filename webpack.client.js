const path = require('path');
const baseConfig = require("./config/webpack.base.js");
const merge = require("webpack-merge");

module.exports = merge(baseConfig, {
  entry: './client/index.js',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'public')
  }
});