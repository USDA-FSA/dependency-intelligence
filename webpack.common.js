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

const basePath = process.cwd();

let customizations = {
  fsaStyleImg: path.join(__dirname, 'node_modules/fsa-style/src/img/'),
  mainStylePath: path.join(basePath, 'src/stylesheets/base.scss'),
  fsaStylePath: path.join(basePath, 'node_modules/fsa-style/src/stylesheets/fsa-style.scss')
};

// build array of sources from fsa-style in node_modules
let styleArray = [];

styleArray.push(customizations.fsaStylePath);
styleArray.push(customizations.mainStylePath);

const postCssLoader = {
  'loader': 'postcss-loader',
  'options': {
      'ident': 'extracted',
      'sourceMap': true,
      'plugins': [
          require('pixrem')(), // add fallbacks for rem units
          require('autoprefixer')({ browsers: 'last 2 versions' }) // add vendor prefixes
      ]
  }
};

module.exports = {

  devtool: 'source-map',

  entry:  {
    'main': [
      './src/stylesheets/base.scss',
      './src/index.js'
    ]
  },

  resolve: {
    modules: ['node_modules', 'src']
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
        /* Future option - allow customization of paths to include/exclude? */
        'exclude': styleArray,
        'test': /\.css$/,
        'use': [
          {
            'loader': 'raw-loader'
          },
          postCssLoader
        ]
      },
      {
        'exclude': styleArray,
        'test': /\.scss$|\.sass$/,
        'use': [
          {
            'loader': 'raw-loader'
          },
          postCssLoader,
          {
            'loader': 'sass-loader',
            'options': {
              'sourceMap': true,
              'precision': 8,
              'includePaths': []
            }
          }
        ]
      },
      {
        'include': styleArray,
        'test': /\.css$/,
        'use': [
            MiniCssExtractPlugin.loader,
            'css-loader',
            postCssLoader
          ]
      },
      {
        'include': styleArray,
        'test': /\.scss$|\.sass$/,
        'use': [
          'style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader',
          postCssLoader,
          {
            'loader': 'sass-loader',
            'options': {
              'sourceMap': true,
              'precision': 8,
              'includePaths': []
             }
          },
          {
            loader: "@epegzz/sass-vars-loader",
            options: {
              vars: {
                'font-path': '\'' + path.join(basePath, 'node_modules/fsa-style/src/fonts').replace(new RegExp('\\' + path.sep, 'g'), '/') + '\' !default',
                'image-path': '\'' + path.join(basePath, 'node_modules/fsa-style/src/img').replace(new RegExp('\\' + path.sep, 'g'), '/') + '\' !default'
              }
            }
          },
          {
            loader: 'sass-resources-loader',
            options: {
              resources: styleArray
            }
          }
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