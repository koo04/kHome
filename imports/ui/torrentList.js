import { Template } from 'meteor/templating';
import './torrentList.html'
(function() {

Template.torrent_list.onCreated(function() {

  Meteor.call("getTorrents", function(err, torrents) {
    Session.set('torrents', torrents);
  });

  Meteor.setInterval(function() {
    var value = "No Torrents";
    Meteor.call("getTorrents", function(err, torrents) {
      if(torrents) {
        torrents.forEach(function(torrent) {
            Session.set('torrents', torrents);
        });
      }
    });
  }, 3000);

});

Template.torrent_list.events({
  "submit": function(e) {
    e.preventDefault();
    console.log(this);
    var form = this.serialize();
    console.log(form);
  }
});

Template.torrent_list.helpers({
  torrents: function() {
    return Session.get('torrents');
  }
});

}());