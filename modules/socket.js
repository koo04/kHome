exports.name = "socket";
exports.version = "0.0.1";

const io = require('socket.io');

exports.install = function(options) {
  F.on("load", function() {
    this.io = io.listen(this.server);

    this.io.on('connection', function(socket) {
      // socket.on('message',function(data){
      //   console.log(data);
      //   socket.broadcast.emit('receive',data.message);

      // });
    });
  });
};