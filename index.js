let express        = require('express'),
    app            = express(),
    server         = require('http').createServer(app),
    io             = require('socket.io')(server),
    port           = (process.env.PORT || 8000),
    Particle       = require('particle-api-js'),
    Toilet         = require('./Toilet'),
    DummyToilet    = Toilet.DummyToilet,
    PhotonToilet   = Toilet.PhotonToilet,
    NODE_ENV       = process.env.NODE_ENV || 'development',
    PHOTON_DEVICES = (process.env.PHOTON_DEVICES || '').split(','),
    toilets        = [];

if(NODE_ENV == 'development') {
  toilets.push(
    new DummyToilet('men', 'men', 'ground floor', 'busy', io.sockets),
    new DummyToilet('women', 'women', 'ground floor', 'available', io.sockets)
  );
} else {
  let particle = new Particle();
  particle.login({username: process.env.PARTICLE_USERNAME, password: process.env.PARTICLE_PASSWORD}).then(
    function(data){
      console.log('API call completed on promise resolve: ', data.body.access_token);
      const token = data.body.access_token;
      PHOTON_DEVICES.forEach(function(device, index){
        particle.getVariable({ deviceId: device, name: 'state', auth: token }).then(function(data) {
          let currentStatus = data.body.result,
              gender        = process.env[device+'_GENDER'],
              location      = process.env[device+'_LOCATION'],
              photon        = new PhotonToilet(
                                    particle,
                                    token,
                                    device,
                                    gender,
                                    location,
                                    currentStatus,
                                    io.sockets);
          toilets.push(photon);
        }, function(err) {
          console.log('An error occurred while getting attrs:', err);
        });
      });
    },
    function(err) {
      console.log('API call completed on promise fail: ', err);
    }
  );
}

app.set('port', port);
app.use(express.static('public'));
app.get('/toilets', function(req, res) {
  res.send(toilets.map(function(toilet){ return toilet.detail() }) );
});

server.listen(app.get('port'));
