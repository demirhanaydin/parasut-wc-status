var spark      = require('spark'),
    express    = require('express'),
    app        = express(),
    server     = require('http').createServer(app),
    io         = require('socket.io')(server),
    port       = (process.env.PORT || 8000),
    wcStatus   = 'initializing...',
    COLOURlovers = require('colourlovers'),
    initialBg;

app.set('port', port);
// view engine setup
app.set('view engine', 'ejs'); //tell the template engine

console.log("App successfully launched!");

spark.on('login', function(err, body) {
  console.log('API call completed on Login event:');
});

spark.login({accessToken: process.env.PARTICLE_ACCESS_TOKEN});

var publishChanges = function(wcStatus) {
  io.sockets.emit('status', wcStatus);
  publishBackground();
}

var publishBackground = function() {
  COLOURlovers.get('/patterns/random', function(err, data) {
    if(err) throw err;
    io.sockets.emit('bg', data[0].imageUrl);
    initialBg = data[0].imageUrl;
  })
}

spark.getDevice('frodo', function(err, device) {
  console.log('Device name: ' + device.name);
  device.getVariable('state', function(err, data) {
    if (err) {
      console.log('An error occurred while getting attrs:', err);
    } else {
      console.log('Device attr retrieved successfully:', data.result);
      wcStatus = data.result;
      publishChanges(data.result);
    }
  });

  device.subscribe('wcStatus', function(data) {
    publishChanges(data.data);
  });
});

app.get('/', function(req, res) {
  Promise.resolve(publishBackground()).then(function() {
    res.render('index', {
      wcStatus: wcStatus,
      initialBg: initialBg
    });
  });
});

server.listen(app.get('port'));
