let Toilet = class {
  constructor(name, gender, location, status, sockets) {
    this.name = name;
    this.gender = gender;
    this.location = location;
    this.status = status;
    this.sockets = sockets;
  }

  detail() {
    return {
      name: this.name,
      gender: this.gender,
      location: this.location,
      status: this.status
    }
  }

  publishChanges() {
    this.sockets.emit('status', this.detail());
  }
}

class DummyToilet extends Toilet {
  constructor(name, gender, location, status, sockets) {
    super(name, gender, location, status, sockets);
    this.assignRandomStatus();
  }

  assignRandomStatus() {
    const self     = this,
          statuses = ['busy', 'available'];
    setInterval(function() {
      self.status = statuses[Math.floor(Math.random() * statuses.length)];
      self.publishChanges();
    }, 2000);
  }
}

class PhotonToilet extends Toilet {
  constructor(particle, token, name, gender, location, status, sockets) {
    super(name, gender, location, status, sockets);
    this.particle = particle;
    this.token = token;
    this.setEventStream();
  }

  setEventStream() {
    let self = this;
    this.particle.getEventStream({deviceId: self.name, name: 'wcStatus', auth: this.token }).then(function(stream) {
      stream.on('event', function(data) {
        // console.log("Event: " + JSON.stringify(data));
        self.status = data.data;
        self.publishChanges();
      });
    });
  }
}

exports.DummyToilet = DummyToilet;
exports.PhotonToilet = PhotonToilet;
