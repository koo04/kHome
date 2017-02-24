import { Template } from 'meteor/templating';
import './torrent.html'

(function() {

  Template.torrent.onCreated(function() {
    this.confirm = new ReactiveVar(false);
    this.playing = new ReactiveVar(false);
  });

  Template.torrent.onRendered(function(){
    var t = this;
    Meteor.call("isPlaying", this.data._id, function(err, playing) {
      if(playing)
        t.playing.set(true);
    });
  });

  Template.torrent.events({

    'click button.delete': function(e, t) {
      e.preventDefault();
      var id = e.target.dataset.id;
      console.log("Deleting torrent: " + id);
      t.confirm.set(id);
    },

    'click button.confirm': function(e, t) {
      e.preventDefault();
      var id = parseInt(e.target.dataset.id);
      console.log("Deletion confirmed: " + id);
      Meteor.call("deleteTorrent", id);
    },

    'click button.pause': function(e, t) {
      // Session.clear();
      e.preventDefault();
      var id = parseInt(e.target.dataset.id);
      console.log("Pausing Torrent: " + id);
      Meteor.call("pauseTorrent", id, function(err, paused) {
        if(paused) {
          t.playing.set(false);
        }
      });
    },

    'click button.play': function(e, t) {
      e.preventDefault();
      var id = parseInt(e.target.dataset.id);
      console.log("Playing Torrent: " + id);
      Meteor.call("playTorrent", id, function(err, played) {
        if(played) {
          t.playing.set(true);
        }
      });
    }
  });

  Template.torrent.helpers({
    confirm: function() {
      return Template.instance().confirm.get();
    },
    playing: function() {
      return Template.instance().playing.get();
    }
  });

}());