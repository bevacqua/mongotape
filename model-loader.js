'use strict';

var path = require('path');
var glob = require('glob');
var rjs = /\.js$/i;
var rindex = /\/index\.js$/i;
var models;

function load (pattern) {
  var modules = glob.sync(pattern);
  return modules.filter(notIndex).map(unwrap).reduce(keys, models);

  function keys (accumulator, model, i) {
    var name = path.basename(modules[i], '.js');
    accumulator[name] = model;
    return accumulator;
  }

  function notIndex (file) {
    return rjs.test(file) && rindex.test(file) === false;
  }
}

function unwrap (file) {
  return require(path.join(__dirname, file));
}

function models (paths) {
  paths.forEach(load);
  return models;
}

module.exports = models;
