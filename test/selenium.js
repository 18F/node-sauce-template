var env = require('require-env');
env.inherit('.env');

var username = env.require('SAUCE_USERNAME');
var accessKey = env.require('SAUCE_ACCESS_KEY');
var url = env.require('SAUCE_TEST_URL');

var wd = require('wd');

var timeout = 30000;
wd.configureHttp({
  timeout: timeout,
  retryDelay: 10000,
  retries: 1
});

/*
 * TODO: encapsulate from here to `var browser` into a single function
 * that can allow you to run tests against a local browser as well.
 *
 * Maybe use wd-min instead:
 * <https://www.npmjs.com/package/min-wd>
 */
var capabilities = {
  browserName: 'chrome',
  name: process.env.SAUCE_TEST_NAME,
  tags: (process.env.SAUCE_TEST_TAGS || '').split(' ')
};

if (process.env.BROWSER) {
  capabilities = JSON.parse(process.env.BROWSER);
}

console.warn('testing "%s" against browser: %s', url, JSON.stringify(capabilities));

var browser = wd.remote("ondemand.saucelabs.com", 80, username, accessKey);
var assert = require('assert');

describe('selenium', function() {
  this.timeout(timeout);

  var allPassed = true;

  before(function(done) {
    browser.init(capabilities, done);
  });

  afterEach(function() {
    allPassed = allPassed && (this.currentTest.state === 'passed');
  });

  after(function(done) {
    browser.sauceJobStatus(allPassed, function() {
      browser.quit(done);
    });
  });

  it('title == "Hello, world!"', function(done) {
    browser.get(url, function(error) {
      assert.ok(!error);
      browser.title(function(error, title) {
        assert.equal(title, 'Hello, world!');
        done();
      });
    });
  });
});
