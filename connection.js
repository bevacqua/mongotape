'use strict';

var state = require('./state');
var socket = {
  socketOptions: { connectTimeoutMS: 2000, keepAlive: 1 }
};
var options = {
  server: socket,
  replset: socket,
  db: { native_parser: true }
};

function connect (done) {
  var uri = state.env('MONGO_URI');
  var db = state.mongoose.connection;
  db.once('connected', done || noop);
  db.open(uri, options);
}

function disconnect (done) {
  var next = done || noop;
  var db = state.mongoose.connection;
  if (db.readyState !== 0) {
    db.once('disconnected', next);
    db.close();
  } else {
    next();
  }
}

function noop () {}

module.exports = {
  connect: connect,
  disconnect: disconnect
};
