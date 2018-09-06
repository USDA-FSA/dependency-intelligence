//
//
//
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HTMLBeautifyPlugin = require('html-beautify-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const HandlebarsWebpackPlugin = require('handlebars-webpack-plugin');
const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const WebpackPages = require('./webpack.pages.js');

const fsaStyleImg = path.join(__dirname, 'node_modules/fsa-style/src/img/');


module.exports = {

  devtool: 'source-map',

  entry:  {
    'fsa-style': [
      path.resolve(__dirname, 'src/index.js')
    ]
  },

  resolve: {
    modules: ['node_modules', 'src'],
    alias: {
      'FSA-STYLE-SCSS' : path.join(__dirname, 'node_modules/fsa-style/src/stylesheets/fsa-style.scss'),
      'FSA-STYLE-JS' : path.join(__dirname, 'node_modules/fsa-style/src/js/main.js')
    }
  },

  module: {
    rules: [

      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              // needed for HTML Partials to work
              interpolate: true,
              removeAttributeQuotes: false
            }
          }
        ]
      },
      {
        test: /\.hbs$/,
        use: [
          {
            loader: "handlebars-loader",
            query: {
              partialDirs: [
                  path.join(__dirname, 'src', '/**/')
              ]
            }
          }
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      },
      {
        test: require.resolve("jquery"),
        use: [
          {
            loader: "imports-loader?$=jquery"
          }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: '/img/',
              name: '[name].[ext]',
              limit: 100000
            }
          }
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: '/fonts/',
              name: '[name].[ext]',
              limit: 100000
            }
          }
        ]
      }
    ]
  }   
};

// Creates array for HTMLWebpackPlugin pages based on files in directory
module.exports.plugins = WebpackPages.AddPages( './src/pages/' );

module.exports.plugins.push(
  new CopyWebpackPlugin([
    {
      from: './src/img',
      to: './img/'
    },
    {
      from: fsaStyleImg,
      to: './img/'
    },
    {
      from: './src/fonts',
      to: './fonts/'
    }
  ])
);

module.exports.plugins.push(
  new MiniCssExtractPlugin({
    // Options similar to the same options in webpackOptions.output
    // both options are optional
    filename: "css/[name].css",
    chunkFilename: "[name].css"
  })
);

module.exports.plugins.push(
  new HTMLBeautifyPlugin({
    config: {
        html: {
            end_with_newline: true,
            indent_size: 2,
            indent_with_tabs: true,
            indent_inner_html: true,
            preserve_newlines: true,
            unformatted: ['p', 'i', 'b', 'span']
        }
    },
    replace: [ ' type="text/javascript"' ]
  })
);