//
//
//
const HTMLWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const fs = require('fs');

function addPages(dir){

  var plugins = [];

  fs.readdirSync(dir).forEach (function(file) {

    var fn = file.split('.')[0];
    var newTitle = fn;
    var newTemplate = dir + file;
    var newFilename = path.resolve(__dirname, "./dist/"+ fn +".html" );

    plugins.push(
      new HTMLWebpackPlugin(
        {
          "title" : newTitle,
          "template" : newTemplate,
          "filename" : newFilename,
          "inject" : "body"
        }
      )
    );
  });

  return plugins;
   
}

module.exports = {
  AddPages: addPages
}