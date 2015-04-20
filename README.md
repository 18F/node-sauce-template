# node-sauce-template
This is a [Node] template for cross-browser functional tests with [Selenium] on
[Sauce Labs]. The stack is all Node, but the site to test can be statically or
dynamically served with any language.

**Before you start:** You'll need to create a [Sauce Labs] account if you don't
have one already.

## Setup
Clone this repo and install the dependencies via [npm]:

```sh
git clone https://github.com/shawnbot/node-sauce-template.git
cd node-sauce-template
npm install
```

### Verify
Next up, you can verify that the test server works by calling `npm start`. This
fires up an [Express] server that serves up a page with an HTML title, `"Hello,
world!"`. You can confirm that it's running by visiting
[http://localhost:9000](http://localhost:9000) in a web browser, or:

```sh
curl -s http://localhost:9000
```

### Configure Sauce Labs
Before you can run the Selenium tests, you'll need to set some environment
variables so that the scripts can pass your credentials along to Sauce. The
easiest way to do this is to copy the provided `.env.example` file to `.env`:

```sh
cp .env.example .env
```

Then edit it to ensure that the `SAUCE_USERNAME` and `SAUCE_ACCESS_KEY` values
match those of your Sauce Labs account. You can also do it in your shell
manually like so:

```sh
export SAUCE_USERNAME="your-sauce-username"
export SAUCE_ACCESS_KEY="your-sauce-acess-key"
```

I suggest copying the file to `.env` and using [autoenv] to have it sourced
whenever you `cd` into this directory.

### Test Sauce Connect
[Sauce Connect] allows you to run virtual machine tests on Sauce Labs against
your local web server. Once your environment variables area set, you can run:

```sh
npm run sauce-connect
```

You should see output similar to below and ending with a line of green text
that reads, "Sauce Connect is running". If you don't, check your Sauce
credentials and try again.

![image](https://cloud.githubusercontent.com/assets/113896/7235686/93e0f948-e744-11e4-9e8c-84a384c51b04.png)


### Run the Tests!
Okay, now you're ready to start testing. You're going to need two shells for
this step, so get the other one ready (by opening a new window or tab in your
terminal app, for instance) and `cd` into this directory. In the first shell,
start the server:

```sh
npm start
```

Then, in the next shell, run the tests:

```sh
npm test
```

If all goes well, you should see some text like this:

![image](https://cloud.githubusercontent.com/assets/113896/7236545/7c7dd32e-e74a-11e4-8e7b-e81f6bb26afc.png)

If you look at [package.json](package.json#L8), you can see that this is using
[sauceconnect-runner] to create the [Sauce Connect] tunnel first, then running
the [Mocha] tests with [wd]. If you're having trouble with `sc-run`, you can
try decoupling it from the tests by running three shells in parallel:

* `npm start` to start the server
* `npm run sauce-connect` to create the Sauce Connect tunnel
* `npm test` to run the test

[Selenium]: http://docs.seleniumhq.org/
[Sauce Labs]: https://saucelabs.com
[Sauce Connect]: https://docs.saucelabs.com/reference/sauce-connect/
[Node]: https://nodejs.org/
[npm]: https://www.npmjs.com/
[Express]: http://expressjs.com/
[autoenv]: https://github.com/kennethreitz/autoenv
[sauceconnect-runner]: https://github.com/shawnbot/sauceconnect-runner
[Mocha]: http://mochajs.org/
[wd]: https://github.com/admc/wd
