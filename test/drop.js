'use strict';

var test = require('tape');
var sinon = require('sinon');
var proxyquire = require('proxyquire');
var mongoose;

function env (config) {
  return function get (key) {
    return config[key];
  };
}

function mock (config) {
  mongoose = {
    connection: { db: { dropDatabase: sinon.spy() } }
  };
  return proxyquire('../drop', {
    './state': {
      mongoose: mongoose,
      env: env(config)
    }
  });
}

test('exposes expected API', function (t) {
  var dbService = mock({});
  t.equal(Object.keys(dbService).length, 1, 'exposes correct API member count');
  t.ok(typeof dbService.drop === 'function', 'exposes .drop method');
  t.end();
});

test('.drop fails unless test environment on NODE_ENV', function (t) {
  t.throws(function () {
    mock({ NODE_ENV: 'production' }).drop(sinon.spy());
  });
  t.throws(function () {
    mock({ NODE_ENV: 'staging' }).drop(sinon.spy());
  });
  t.throws(function () {
    mock({ NODE_ENV: 'staging-two' }).drop(sinon.spy());
  });
  t.throws(function () {
    mock({ NODE_ENV: 'development' }).drop(sinon.spy());
  });
  t.end();
});

test('.drop fails unless test somewhere in MONGO_URI', function (t) {
  t.throws(function () {
    mock({ NODE_ENV: 'test' }).drop(sinon.spy());
  });
  t.throws(function () {
    mock({ NODE_ENV: 'test', MONGO_URI: 'mongodb://localhost/stompflow' }).drop(sinon.spy());
  });
  t.doesNotThrow(function () {
    mock({ NODE_ENV: 'test', MONGO_URI: 'mongodb://localhost/stompflow-test' }).drop(sinon.spy());
  });
  t.end();
});

test('.drop drops the database when successfully validated', function (t) {
  var done = sinon.spy();
  mock({ NODE_ENV: 'test', MONGO_URI: 'mongodb://localhost/stompflow-test' }).drop(done);
  t.equal(mongoose.connection.db.dropDatabase.callCount, 1);
  t.deepEqual(mongoose.connection.db.dropDatabase.firstCall.args, [done]);
  t.end();
});
