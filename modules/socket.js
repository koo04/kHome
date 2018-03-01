exports.name = "socket";
exports.version = "0.0.1";

const io = require('socket.io');

exports.install = function(options) {
  F.on("load", function() {
    this.io = io.listen(this.server);

    this.io.on('connection', function(socket) {
      // socket.join(['torrents', 'weather']);
      socket.on('torrents', function(data) {
        if(data === 'please')
          F.module('torrents').getAll();
      });
      socket.on('weather', function(data) {
        if(data === 'please')
          F.module('weather').getWeatherNow();
      });
      
    });

    // this.io.on('please', (data) => {
    //   console.log(data);
    // });
  });
};