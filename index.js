'use strict';

var state = require('./state');
var mongotape = require('./mongotape');

function setup (options) {
  state.configure(options);
  return mongotape;
}

module.exports = setup;
