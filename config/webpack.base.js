const path = require('path');

module.exports = {
  mode: 'development',
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      '@components': path.join(__dirname, '../src/components'),
      '@pages': path.join(__dirname, '../src/pages'),
      '@store': path.join(__dirname, '../src/store'),
      '@utils': path.join(__dirname, '../src/utils'),
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: ['@babel/preset-react', '@babel/preset-env']
        }
      }
    ]
  }
};