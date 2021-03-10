const path = require('path');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { VueLoaderPlugin } = require('vue-loader');

const isProd = process.env.NODE_ENV === 'production';


/**
 * Development mode
 */
const config = {
  mode: process.env.NODE_ENV,
  devtool: false,
  entry: path.resolve(__dirname, 'src/main.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: 'js/[name].js',
  },
  optimization: {
    splitChunks: { chunks: 'all' },
  },
  resolve: {
    extensions: [
      '.js',
      '.json',
      '.vue',
    ],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  optimization: {
    minimizer: [],
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'public'),
    host: '0.0.0.0',
    disableHostCheck: true,
    inline: true,
    hot: true,
    historyApiFallback: true,
    overlay: { errors: true },
    quiet: true, // close for using friendly error plugin
  },
};


/**
 * Plugins
 */

config.plugins = [
  new FriendlyErrorsWebpackPlugin(),
  new VueLoaderPlugin(),
  new HtmlWebpackPlugin({
    template: path.resolve(__dirname, 'public/index.html'),
    filename: 'index.html',
    inject: true,
    minify: isProd
      ? {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true,
        }
      : false,
  }),
];


/**
 * Modules
 */

config.module = {
  rules: [
    {
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
      include: [path.resolve(__dirname, './src')],
    },
    {
      test: /\.vue$/,
      loader: 'vue-loader',
    },
    {
      test: /\.s?css$/,
      use: [
        isProd ? MiniCssExtractPlugin.loader : 'vue-style-loader',
        {
          loader: 'css-loader',
          options: {
            sourceMap: true,
            esModule: false,
          },
        },
        {
          loader: 'postcss-loader',
          options: {
            postcssOptions: {
              plugins: [
                ['postcss-preset-env'],
              ],
            },
          },
        },
        {
          loader: 'sass-loader',
          options: {
            sourceMap: true,
            additionalData: '@import "./src/styles/mixin.scss";',
          },
        },
      ],
    },
  ]
};


/**
 * Production mode
 */
if (isProd) {
  const { CleanWebpackPlugin } = require('clean-webpack-plugin');
  const TerserPlugin = require('terser-webpack-plugin');
  config.devtool = false;
  config.output.filename = 'js/[name].[contenthash].js';
  config.plugins.push(new CleanWebpackPlugin());
  config.optimization.minimizer.push(new TerserPlugin());

  // css optimiztion
  const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
  config.plugins.push(new MiniCssExtractPlugin({
    filename: 'css/[name].[contenthash].css',
    chunkFilename: 'css/[id].[contenthash].css',
  }));
  config.optimization.minimizer.push(new OptimizeCSSAssetsPlugin());
}

module.exports = config;