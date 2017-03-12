var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: path.join(process.cwd(), './src/app-client.js'),
  output: {
    path: path.join(__dirname, 'src', 'static', 'scripts'),
    filename: 'bundle.js'
 },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['react', 'es2015']
        }
      }]
  },
  plugins: [
    // new webpack.DefinePlugin({
    //   'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    // }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('development'),
        'BABEL_ENV': JSON.stringify('dev')
    }
  }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false },
      mangle: false,
      sourcemap: true,
      beautify: true,
      dead_code: true
    })
  ]
};
