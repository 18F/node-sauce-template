var express = require('express');
var app = express();

app.get('/', function(req, res) {
  res.send('<title>Hello, world!</title>');
});

var server = app.listen(9000, function() {
  var addr = server.address();
  var host = addr.address;
  var port = addr.port;
  console.log('server running at http://%s:%s', host, port);
});
