var webpack = require('webpack');
var path = require('path');
module.exports = {
  entry: path.join(process.cwd(), 'client-render.js'),
  output: {
    path: __dirname + '/public/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['react', 'es2015', 'react-hmre']
        }
      }
    ]
  }
};
