const path = require('path');
const baseConfig = require("./config/webpack.base.js");
const merge = require("webpack-merge");
const nodeExternals = require('webpack-node-externals');

module.exports = merge(baseConfig, {
  target: 'node',
  entry: './server/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build')
  },
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.css$/,
        loader: ['isomorphic-style-loader', {
          loader: 'css-loader',
          options: {
            modules: true
          }
        }]
      }
    ]
  }
});