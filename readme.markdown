# mongotape

> Run integration tests using `mongoose` and `tape`

# install

```shell
npm i mongotape -S
```

# usage

Set up a `./mongotape` module as follows.

```js
var mongotape = require('mongotape');
var options = {
  mongoose: require('mongoose'),
  models: 'models/*'
};
module.exports = mongotape(options);
```

You're all set, your tests should now use that module to access the `mongotape` API.

# `mongotape(description?, tests)`

The `tests` callback will receive a `test` object that matches the API you would expect from `tape`. The difference is that each test will include a setup and teardown.

### setup

- Database connection is established
- Database is dropped
- Database is re-created and models are re-loaded

### teardown

- Database connection is closed

This process ensures each test runs effectively in isolation, which is usually a very painful thing to achieve using plain `tape` and `mongoose`.

### example

```js
mongotape(function tests (test) {
  test('.recent pulls recent sorted by creation date, descending', function (t) {
    contra.series([
      function (next) {
        new models.Log({ level: 'info', message: 'some foo' }).save(next);
      },
      function (next) {
        new models.Log({ level: 'error', message: 'some bar' }).save(next);
      },
      function (next) {
        logQueryService.recent({}, next);
      }
    ], function (err, results) {
      var logs = results.pop();
      t.equal(err, null);
      t.equal(logs.length, 2);
      t.equal(logs[0].message, 'some bar');
      t.equal(logs[1].message, 'some foo');
      t.end();
    });
  });
});
```

You can mix `mongotape` and _regular Tape's_ `test` statements as you see fit. There's no need to call a special method to signal that you are done, as mongotape will simply yield execution once all your mongoose `test` handlers have ran to completion.

# options

You can set a few options when first configuring `mongotape` as [seen above](#usage).

#### mongoose

Set `mongoose` to your local mongoose instance so that we have the same exact version

#### models

Set `models` to the path to your mongoose models. It can be an string, an array, or a method that returns the models in an object like:

```js
{
  Article: ArticleModel,
  Comment: CommentModel
}
```

<sub>_(and so on...)_</sub>

#### env

If you use an environment variables manager such as `nconf`, set `options.env` to a method that returns an environment configuration value given a key. Here's the default implementation:

```js
function env (key) {
  return process.env[key];
}
```
# license

MIT
