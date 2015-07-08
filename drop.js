'use strict';

var state = require('./state');
var word = /\btest\b/i;

// being able to drop the database is kind of a big deal
// disallow outside of 'test' environment, and also outside of 'test' database
function validate () {
  var env = state.env('NODE_ENV');
  var uri = state.env('MONGO_URI');
  var notTestEnv = env !== 'test';
  if (notTestEnv) {
    throw new Error('NODE_ENV must be set to "test".');
  }
  var notTestDb = word.test(uri) === false;
  if (notTestDb) {
    throw new Error('MONGO_URI must contain "test" word.');
  }
}

function drop (done) {
  validate();
  state.mongoose.connection.db.dropDatabase(done);
}

module.exports = drop;
