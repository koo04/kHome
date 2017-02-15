import { Template } from 'meteor/templating';
import { FilesCollection } from 'meteor/ostrio:files';
import { ReactiveVar } from 'meteor/reactive-var';
import './torrentList.html';

(function() {

Template.torrent_list.onCreated(function() {

  this.currentUpload = new ReactiveVar(false);
  this.torrentUpload = new ReactiveVar(false);

  console.log("Getting initial Torrent list for " + Meteor.userId() + "...");
  Meteor.call("getTorrents", function(err, torrents) {

    if(!torrents.code) {
      Session.set('torrents', torrents);
  
      Meteor.setInterval(function() {
        console.log("Torrents Refreshing for " + Meteor.userId() + "...");
        Meteor.call("getTorrents", function(err, torrents) {
          if(!torrents.code) {
            torrents.forEach(function(torrent) {
              Session.set('torrents', torrents);
            });
          } else if(torrents.code = "ENOTFOUND") {
            console.log("Can not reach the Torrent Server!");
            Session.set('torrentsError', "Can not reach Torrent server");
          }
        });
      }, 10000);

    } else if(torrents.code == "ENOTFOUND") {
      console.log("Can not reach the Torrent Server!");
      Session.set('torrentsError', "Can not reach Torrent server");
    } else if(torrents.code == "ECONNREFUSED") {
      console.log("Invalid credentials");
      Session.set('torrentsError', "Invalid Login for Server!");
    } else {
      console.log(err || torrents);
    }
  });

});

Template.torrent_list.events({

  'change #fileInput': function (e, t) {
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      console.log("Uploading files: " + e.currentTarget.files);
      var upload = Torrents.insert({
        file: e.currentTarget.files[0],
        streams: 'dynamic',
        chunkSize: 'dynamic'
      }, false);

      upload.on('start', function () {
        console.log("Started uploading torrent.");
        t.currentUpload.set(this);
      });

      upload.on('end', function (error, tor) {
        console.log("Finished Uploading files.");
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
    console.log("Pausing all torrents.");
    Meteor.call("pauseAll");
  },

  'click a.play-all': function(e, t) {
    e.preventDefault();
    console.log("Playing all torrents.");
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