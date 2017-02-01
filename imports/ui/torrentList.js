import { Template } from 'meteor/templating';
import { FilesCollection } from 'meteor/ostrio:files';
import { ReactiveVar } from 'meteor/reactive-var';
import './torrentList.html'

(function() {

Template.torrent_list.onCreated(function() {

  this.currentUpload = new ReactiveVar(false);
  this.torrentUpload = new ReactiveVar(false);

  Meteor.call("getTorrents", function(err, torrents) {
    if(!torrents.code) {
      torrents.forEach(function(torrent) {
          Session.set('torrents', torrents);
      });
  
      Meteor.setInterval(function() {
        Meteor.call("getTorrents", function(err, torrents) {
          if(!torrents.code) {
            torrents.forEach(function(torrent) {
                Session.set('torrents', torrents);
            });
          } else if(torrents.code = "ENOTFOUND") {
            Session.set('torrentsError', "Can not reach Torrent server");
          }
        });
      }, 3000);

    } else if(torrents.code = "ENOTFOUND") {
      Session.set('torrentsError', "Can not reach Torrent server");
    }
  });

});

Template.torrent_list.events({

  'change #fileInput': function (e, t) {
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      // We upload only one file, in case
      // multiple files were selected
      var upload = Torrents.insert({
        file: e.currentTarget.files[0],
        streams: 'dynamic',
        chunkSize: 'dynamic'
      }, false);

      upload.on('start', function () {
        t.currentUpload.set(this);
      });

      upload.on('end', function (error, tor) {
        t.currentUpload.set(false);
        t.torrentUpload.set(this);
        Meteor.call("putTorrents", tor, function(err, test) {
          t.torrentUpload.set(false);
        })
      });

      upload.start();
    }
  },

  'click a.pause-all': function(e, t) {
    e.preventDefault();

    Meteor.call("pauseAll");
  },

  'click a.play-all': function(e, t) {
    e.preventDefault();

    Meteor.call("playAll");
  }

});

Template.torrent_list.helpers({

  torrents: function() {
    return Session.get('torrents');
  },

  torrentsError: function() {
    return Session.get('torrentsError');
  },

  currentUpload: function () {
    return Template.instance().currentUpload.get();
  },

  torrentUpload: function () {
    return Template.instance().torrentUpload.get();
  }

});

}());