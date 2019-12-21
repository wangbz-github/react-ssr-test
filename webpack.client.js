const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const baseConfig = require("./config/webpack.base.js");
const merge = require("webpack-merge");

module.exports = merge(baseConfig, {
  entry: './client/index.js',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'public')
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        loader: ['style-loader', {
          loader: 'css-loader',
          options: {
            modules: true
          }
        }]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.csr.html',
      template: './src/index.csr.html',
      inject: true
    }),
  ],
});