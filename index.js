var spark      = require('spark'),
    express    = require('express'),
    app        = express(),
    server     = require('http').createServer(app),
    io         = require('socket.io')(server),
    port       = (process.env.PORT || 8000),
    wcStatus   = 'initializing...';

app.set('port', port);
// view engine setup
app.set('view engine', 'ejs'); //tell the template engine

console.log("App successfully launched!");

spark.on('login', function(err, body) {
  console.log('API call completed on Login event:');
});

spark.login({accessToken: process.env.PARTICLE_ACCESS_TOKEN});

var publishChanges = function(data) {
  wcStatus = data.data;
  console.log(wcStatus);
  io.sockets.emit('status', wcStatus);
}

spark.getDevice('frodo', function(err, device) {
  console.log('Device name: ' + device.name);
  device.subscribe('wcStatus', function(data) {
    publishChanges(data);
  });
});

app.get('/', function(req, res) {
  res.render('index', {
    wcStatus: wcStatus
  });
});

server.listen(app.get('port'));
