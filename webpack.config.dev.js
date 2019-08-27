var path = require('path');
var webpack = require('webpack');
require('dotenv').config();

//removed this entry
// 'webpack-hot-middleware/client',
module.exports = {
  devtool: 'source-map',
  entry: [
    './app/js/main',
    'webpack-hot-middleware/client'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  resolve: {
    alias: {
      images: path.join(__dirname, '/app/assets/images')
    }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('development'),
        'REACT_PARSE_APP_ID' : JSON.stringify(process.env.REACT_PARSE_APP_ID),
        'REACT_PARSE_JS_KEY' : JSON.stringify(process.env.REACT_PARSE_JS_KEY),
        'REACT_PARSE_SERVER' : JSON.stringify(process.env.REACT_PARSE_SERVER)
      }
    }),
    new webpack.NoErrorsPlugin()
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel'],
      include: path.join(__dirname, 'app')
    }, {
      test: /\.less$/,
      loader: "style!css!less"
    }, {
      test: /\.css$/,
      loader: "style!css"
    }, {
      test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
      loader: 'file?name=images/[hash].[ext]'
    },
    {
      test: /\.json$/,
      loader: 'json-loader'
    }]
  }
};
