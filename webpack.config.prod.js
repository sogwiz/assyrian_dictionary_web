var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var packager = require('./package.json');
require('dotenv').config();

module.exports = {
  devtool: 'source-map',
  entry: {
    bundle: './app/js/main'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: './'
  },
  resolve: {
    alias: {
      images: path.join(__dirname, '/app/assets/images')
    }
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel'],
      include: [path.join(__dirname, 'app'), path.join(__dirname, 'node_modules/@restart/hooks')]
    }, {
      test: /\.less$/,
      loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader")
    }, {
      test: /\.css$/,
      loader: ExtractTextPlugin.extract("style-loader", "css-loader")
    }, {
      test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
      loader: 'file?name=images/[hash].[ext]'
    },
    {
      test: /\.json$/,
      loader: 'json-loader'
    }]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production'),
        'REACT_PARSE_APP_ID': JSON.stringify(process.env.REACT_PARSE_APP_ID),
        'REACT_PARSE_JS_KEY': JSON.stringify(process.env.REACT_PARSE_JS_KEY),
        'REACT_PARSE_SERVER': JSON.stringify(process.env.REACT_PARSE_SERVER),
        'SUPPORTER_CODE': JSON.stringify(process.env.SUPPORTER_CODE)
      }
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    }),
    new HtmlWebpackPlugin({
      template: 'app/htdocs/index.html',
      description: packager.description
    }),
    new ExtractTextPlugin('[name].css')
  ]
};
