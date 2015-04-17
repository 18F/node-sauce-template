#!/usr/bin/env node
var yargs = require('yargs')
  .usage('$0 [options] -- [test command]')
  .describe('browsers', 'load the browser list from this JSON file')
  .default('browsers', 'browsers.json')
  .describe('series', 'run the tests in series rather than in parallel')
  .alias('series', 's')
  .alias('browsers', 'b')
  .alias('h', 'help')
  .wrap(80);

var options = yargs.argv;
var args = options._;
if (options.help) {
  return yargs.showHelp();
}

var async = require('async');
var child = require('child_process');
require('colors');

// TODO: qualify the path more intelligently
var browsersPath = './' + options.browsers;
try {
  var browsers = require(browsersPath);
} catch (error) {
  console.error('Unable to parse browsers from "%s": %s', browsersPath, error);
  process.exit(1);
}

if (args.length) {
  var command = args.shift();
  var testArgs = args;
} else {
  var command = 'npm';
  var testArgs = ['test'];
}
console.warn('test command: %s', [command].concat(testArgs).join(' ').bold);

var jobs = browsers.map(function(browser) {
  var env = Object.create(process.env);
  env.BROWSER = JSON.stringify(browser);

  var proc;

  var job = function(done) {
    proc = child.spawn(command, testArgs, {
      env: env,
      stdio: 'inherit'
    })
    .on('exit', done);
  };

  job.kill = function(signal) {
    return proc && proc.kill(signal);
  };

  return job;
});

async[options.series ? 'series' : 'parallel'](jobs, function(error) {
  if (error) {
    // console.error('Error:', error);
    jobs.forEach(function(job) {
      job.kill('SIGINT');
    });
    process.exit(1);
  }
  console.log('success!');
  process.exit(0);
});
