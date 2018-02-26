exports.name = "torrents";
exports.version = "0.0.1";
exports.dependencies = ['settings', 'socket'];

const Promise = require('promise');
const Transmission = require('transmission');
let transmission;
let settings;

const status = {
  0: "Stopped",
  1: "Check Wait",
  2: "Checking",
  3: "Download Wait",
  4: "Downloading",
  5: "Seed Wait",
  6: "Seeding",
  7: "Isolated"
}

exports.install = function(options) {
  F.on('ready', () => {

    settings = F.settings;
    transmission = new Transmission({
      host: settings.transmission.host || "localhost",
      port: settings.transmission.port || 9091,
      username: settings.transmission.username,
      password: settings.transmission.password,
      ssl: settings.transmission.ssl || false,
      url: settings.transmission.url || "/transmission/rpc"
    });

    this.getAll();
    setInterval(function(callback) {
      F.module('torrents').getAll();
    }, 5000);

    
  });
};
exports.uninstall = function() {};
exports.get = function() {};
exports.upload = function() {};
exports.delete = function() {};
exports.pause = function() {};
exports.resume = function() {};
exports.getAll = function() {
  transmission.get((err, torrents) => {
    new Promise((resolve, reject) => {
      if(err) {
        reject(err);
      } else {
        resolve(torrents.torrents);
      }
    }).then((torrents) => {
      torrents.forEach((torrent) => {
        var status = F.module("torrents").getStatus(torrent.status);
        torrent.status = status;
      });
      F.io.emit('torrents', torrents);
    });
  });
};
exports.pauseAll = function() {};
exports.resumeAll = function() {};
exports.getStatus = function(nStatus) {
  return status[nStatus];
};