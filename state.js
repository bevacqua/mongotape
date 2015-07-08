'use strict';

var loader = require('./model-loader');
var state = {
  env: env,
  models: models,
  configure: configure
};

function env (key) {
  return process.env[key];
}

function models () {
  throw new Error('You must define a `models` function that loads your Mongoose models!\n\nmongotape({\n  models: models\n})');
}

function loads (paths) {
  return function load () {
    return loader(paths);
  };
}

function configure (options) {
  if (typeof options.models === 'string') {
    state.models = loads([options.models]);
  } else if (Array.isArray(options.models)){
    state.models = loads(options.models);
  } else {
    state.models = options.models;
  }
  if (options.env) { state.env = options.env; }
  if (options.mongoose) { state.mongoose = options.mongoose; }
}

module.exports = state;
