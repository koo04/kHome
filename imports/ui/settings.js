import { Settings } from '/lib/Settings';
import './settings.html';

Template.settings.onCreated(function() {
  if(!Settings.findOne({user: Meteor.userId()})) {
    Settings.insert({
      user: Meteor.userId(),
      profile: {
        fName: "",
        lName: ""
      },
      torrent: {
        host: "",
        port: 9091,
        username: "",
        password: "",
        ssl: false
      },
      weather: {
        appId: "",
        zip: ""
      }
    });
  }
});

Template.settings.events({
  'click a.save': function(e, t) {
    e.preventDefault();
    var form = $('form').serializeArray();
    Meteor.call('updateSettings', $('form').serializeArray());
  }
});

Template.settings.helpers({
  userEmail: function() {
    return Meteor.user().emails[0].address;
  },
  profile: function() {
    return Settings.findOne({user: Meteor.userId()}).profile;
  },
  torrent: function() {
    return Settings.findOne({user: Meteor.userId()}).torrent;
  },
  weather: function() {
    return Settings.findOne({user: Meteor.userId()}).weather;
  }
});