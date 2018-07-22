exports.name = "torrents";
exports.version = "0.0.1";
exports.dependencies = ['settings', 'socket'];

const Promise = require('promise');
const Transmission = require('transmission');
const TimeAgo = require('javascript-time-ago');
const en = require('javascript-time-ago/locale/en');
TimeAgo.locale(en)
const timeAgo = new TimeAgo('en-US');
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
      if(torrents){
        var torrentsArray = [];
        torrents.forEach((torrent) => {
          var torrentArray = [];
          var rateDownload = Math.floor(torrent.rateDownload/8/1024/1024*100)/100;
          var rateUpload = Math.floor(torrent.rateUpload/8/1024/1024*100)/100;
          var status = F.module("torrents").getStatus(torrent.status);
          var addedDate = timeAgo.format(torrent.addedDate*1000);
          var doneDate = torrent.doneDate > 0 ? timeAgo.format(torrent.doneDate*1000) : "Not Done";
          torrentArray.push(torrent.name);
          torrentArray.push(rateDownload);
          torrentArray.push(rateUpload);
          torrentArray.push(status);
          torrentArray.push(addedDate);
          torrentArray.push(doneDate);
          torrentsArray.push(torrentArray);
          torrentArray = null;
        });
        F.io.emit('torrents', torrentsArray);
      } else {
        F.io.emit('torrents', []);
      }
    });
  });
};
exports.pauseAll = function() {};
exports.resumeAll = function() {};
exports.getStatus = function(nStatus) {
  return status[nStatus];
};