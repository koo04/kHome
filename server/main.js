import Transmission from 'transmission';
import Future from 'fibers/future';
import { Settings } from '/lib/Settings';
var transmission = new Transmission (Meteor.settings.private.torrentServer);

function formToArray (form) {
  var fo = [];
  for(var i = 0; i < form.length; i++) {
    fo[form[i].name] = form[i].value;
  }
  return fo;
}

function getStatus(status) {
  switch(status) {
    case 0:
      return "Stopped"
    case 1:
      return "Check Qued"
    case 2:
      return "Checking"
    case 3:
      return "Download Qued"
    case 4:
      return "Downloading"
    case 5:
      return "Seed Qued"
    case 6:
      return "Seeding"
    case 7:
      return "No Peers"
  }
}

function formatBytes(bytes,decimals) {
   if(bytes == 0) return '0 Bytes';
   var k = 1000,
       dm = decimals + 1 || 3,
       sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
       i = Math.floor(Math.log(bytes) / Math.log(k));
   return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function limitString(str, lng) {
  return (str.length > lng) ? str.substr(0,lng-1) + "..." : str;
}

function getPercentage(current, max) {
  return Math.floor((current/max) * 10000) / 100 + "%";
}

function torrentToReadable(name) {
  return name.replace(/\./g, " ");
}

(function() {

  var ids = [];

  Meteor.methods({

    putTorrents: function(tor) {
      var future = new Future();

      transmission.addFile(tor.versions.original.path, function(err, arg){
        if(arg)
          future.return(true);
        else
          future.return(err);
      });

      return future.wait();
    },

    getTorrents: function () {
      var future = new Future();

      transmission.get(function(err, res) {
        var torrents = [];
        ids = [];
        if(err) {
          future.return(err);
        } else {
          res.torrents.forEach(function(torrent, index) {
            var ratio = Math.round(torrent.uploadRatio * 100) / 100;
            if(ratio < 0)
              ratio = 0;
              
            torrents.push({_id: torrent.id,
              name: {
                snip: limitString(torrentToReadable(torrent.name), 40),
                full: torrentToReadable(torrent.name)
              },
              dateAdded: torrent.addedDate,
              status: getStatus(torrent.status),
              downloaded: getPercentage(torrent.haveValid,torrent.sizeWhenDone),
              totalSize: formatBytes(torrent.sizeWhenDone, 1),
              uploadRatio: ratio,
              speed: {
                up: formatBytes(torrent.rateUpload, 1),
                down: formatBytes(torrent.rateDownload, 1)
              },
              peers: {
                seeding: torrent.peersSendingToUs,
                leeching: torrent.peersGettingFromUs
              }
            });
            ids.push(torrent.id);
          });
          future.return(torrents);
        }
      });

      return future.wait();
    },

    deleteTorrent: function(id) {
      var future = new Future();

      transmission.remove(id, function(err, args) {
        if(err) {
          future.return(err);
        } else {
          future.return(true);
        }
      });

      return future.wait();
    },

    isPlaying: function(id) {
      var future = new Future();

      transmission.get(id, function(err, tor) {
        if(err) {
          future.return(err);
        } else {
          tor = tor.torrents[0];
          if(tor.status != 0)
            future.return(tor.id);
          else
            future.return(false);
        }
      });

      return future.wait();
    },

    pauseTorrent: function(id) {
      var future = new Future();

      transmission.stop(id, function(err, arg) {
        if(err) {
          future.return(err);
        } else {
          future.return(true);
        }
      });
    },

    playTorrent: function(id) {
      var future = new Future();

      transmission.start(id, function(err, arg) {
        if(err) {
          future.return(err);
        } else {
          future.return(true);
        }
      });

      return future.wait();
    },

    pauseAll: function() {
      var future = new Future();
      
      transmission.stop(ids, function(err, args) {
        if(err)
          future.return(err);
        else
          future.return(true);
      });

      return future.wait();
    },

    playAll: function() {
      var future = new Future();

      transmission.start(ids, function(err, args) {
        if(err)
          future.return(err);
        else
          future.return(true);
      });

      return future.wait();
    },

    updateSettings: function(form) {
      form = formToArray(form);
      Settings.update({user: this.userId}, {
        $set:{
          profile: {
            fName: form['fName'],
            lName: form['lName']
          },
          torrent: {
            host: form['torrentHost'],
            port: parseInt(form['torrentPort']),
            username: form['torrentUserName'],
            password: form['torrentPassword'],
            ssl: ((form['torrentSSL']) ? true : false)
          },
          weather: {
            appId: form['weatherAppId'],
            zip: form['weatherZip']
          }
        }
      });
    }

  });

}())

