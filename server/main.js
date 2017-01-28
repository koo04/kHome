import Transmission from 'transmission';
import Future from 'fibers/future';
var transmission = new Transmission (Meteor.settings.private.torrentServer);

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
       sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
       i = Math.floor(Math.log(bytes) / Math.log(k));
   return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
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
              name: torrentToReadable(torrent.name),
              dateAdded: torrent.addedDate,
              status: getStatus(torrent.status),
              downloaded: getPercentage(torrent.haveValid,torrent.sizeWhenDone),
              totalSize: formatBytes(torrent.sizeWhenDone, 1),
              uploadRatio: ratio
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
        tor = tor.torrents[0];
        if(err) {
          future.return(err);
        } else {
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
    }

  });

}())

