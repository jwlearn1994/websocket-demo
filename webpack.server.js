const path = require('path');
const nodeExternals = require('webpack-node-externals');

const isProd = process.env.NODE_ENV === 'production';

const config = {
  mode: process.env.NODE_ENV,
  entry: path.resolve(__dirname, './server/index.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name].js'
  },
  target: 'node',
  node: {
    // tell webpack not to handle following
    __dirname: false,
    __filename: false,
  },
  externals: [nodeExternals()], // external node_modules deps
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './server')
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins: []
};

// dev
if (!isProd) {
  const NodemonPlugin = require('nodemon-webpack-plugin');
  config.plugins.push(new NodemonPlugin());
}

module.exports = config;
