var username = process.env.SAUCE_USERNAME;
var accessKey = process.env.SAUCE_ACCESS_KEY;
var URL_TO_TEST = process.env.URL_TO_TEST || process.env.LOCAL_TUNNEL_URL;

if (!username || !accessKey) {
  console.error('You must provide SAUCE_USERNAME and SAUCE_ACCESS_KEY in env');
  process.exit(1);
}

if (!URL_TO_TEST) {
  console.error('You must provide a URL_TO_TEST');
  process.exit(1);
}

var wd = require('wd');

var timeout = 30000;
wd.configureHttp({
  timeout: timeout,
  retryDelay: 10000,
  retries: 1
});

var capabilities = {
  browserName: 'chrome',
  name: 'test name here',
  tags: []
};

if (process.env.BROWSER) {
  capabilities = JSON.parse(process.env.BROWSER);
}

console.warn('testing "%s" against browser: %s', URL_TO_TEST, JSON.stringify(capabilities));

var browser = wd.remote("ondemand.saucelabs.com", 80, username, accessKey);
var assert = require('assert');

describe('spec', function() {
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
    browser.get(URL_TO_TEST, function(error) {
      assert.ok(!error);
      browser.title(function(error, title) {
        assert.equal(title, 'Hello, world!');
        done();
      });
    });
  });
});
