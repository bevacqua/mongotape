'use strict';

var tape = require('tape');
var contra = require('contra');
var state = require('./state');
var connection = require('./connection');
var drop = require('./drop');

function mongotape (description, tests) {
  var desc = tests ? description : 'mongotape test bundle';
  var fn = mongotaped.bind(null, tests || description);
  tape.test(desc, fn);
}

function mongotaped (tests, st) {
  var models = state.models();
  var sub = subtest.bind(null, models, st);
  sub.skip = skip;
  tests(sub);
  st.end();
}

function subtest (models, st, description, fn) {
  if (!fn) {
    fn = description;
    description = null;
  }

  st.test(description + '::connect', connect);
  st.test(description, fn);
  st.test(description + '::disconnect', disconnect);

  function connect (t) {
    contra.series([contra.curry(connection.connect), contra.curry(drop), ensureModels], t.end);
  }

  function ensureModels (done) {
    contra.each(models, ensureIndexes, done);
  }

  function ensureIndexes (model, next) {
    model.ensureIndexes(next);
  }

  function disconnect (t) {
    contra.series([contra.curry(connection.disconnect)], t.end);
  }
}

function skip () {}

mongotape.skip = skip;
module.exports = mongotape;
