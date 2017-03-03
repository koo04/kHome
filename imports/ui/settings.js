import { Profile } from '/lib/Settings';
import { Torrent } from '/lib/Settings';
import { Weather } from '/lib/Settings';
import { Mal } from '/lib/Settings';
import { Rss } from '/lib/Rss';
import { Lazy } from '/lib/Tools';
import './settings.html';

Template.settings.onCreated(function() {
  Session.set('rssFeedList', false);

  if(!Mal.findOne({user: Meteor.userId()})) {
    Mal.insert({
      user: Meteor.userId(),
      username: "",
      password: ""
    });
  }

  Session.set('rssFeedList', Rss.find({user: Meteor.userId()}).fetch());

});

Template.settings.onRendered(function() {
  if($('input[name=torrentUserName]').val() != '')
    $('label[for=torrentUserName]').addClass('active');
  if($('input[name=torrentPassword').val() != '')
    $('label[for=torrentPassword]').addClass('active');
  if($('input[name=torrentHost]').val() != '')
    $('label[for=torrentHost]').addClass('active');
  if($('input[name=weatherAppID]').val() != '')
    $('label[for=weatherAppID]').addClass('active');
  if($('input[name=weatherZip]').val() != '')
    $('label[for=weatherZip]').addClass('active');
  if($('input[name=malUsername]').val() != '')
    $('label[for=malUsername]').addClass('active');
  if($('input[name=malPassword]').val() != '')
    $('label[for=malPassword]').addClass('active');
});

Template.settings.events({
  'click a.profile': function(e, t) {
    e.preventDefault();
    var form = $('form.profile').serializeArray();
    var newProfile = Meteor.call('updateProfile', form);
    $('form.profile .saved').show().fadeOut(2000);
  },
  'click button.torrent': function(e, t) {
    e.preventDefault();
    var form = $('form.torrent').serializeArray();
    Meteor.call('updateTorrent', form);
    $('form.torrent .saved').show().fadeOut(2000);
  },
  'click button.weather': function(e, t) {
    e.preventDefault();
    var form = $('form.weather').serializeArray();
    Meteor.call('updateWeather', form);
    $('form.weather .saved').show().fadeOut(2000);
  },
  'click button.mal': function(e, t) {
    e.preventDefault();
    var form = $('form.mal').serializeArray();
    Meteor.call('updateMal', form);
    $('form.mal .saved').show().fadeOut(2000);
  },
  'click form.rss button.add': function(e, t) {
    e.preventDefault();
    var form = $('form.rss').serializeArray();
    var formArray = Lazy.formToArray(form);
    Rss.insert({
      user: user,
      title: formArray.rssTitle,
      link: formArray.rssLink
    },function(err, id) {
      Session.set('rssFeedList', Rss.find({user: Meteor.userId()}).fetch());
    });
  },
  'click form.rss button.delete': function(e, t) {
    e.preventDefault();
    var id = $(this)[0]._id;
    Rss.remove({_id: id});
    Session.set('rssFeedList', Rss.find({user: Meteor.userId()}).fetch());
  }
});

Template.settings.helpers({
  userEmail: function() {
    return Meteor.user().emails[0].address;
  },
  rss: function() {
    return Session.get('rssFeedList');
  },
  profile: function() {
    var profile = Profile.findOne({user: Meteor.userId()});
    if(!profile) {
      Profile.insert({
        user: Meteor.userId(),
        fName: "",
        lName: ""
      });
      return {fName: "",lName: ""}
    } else {
      return profile;
    }
  },
  torrent: function() {
    var torrent = Torrent.findOne({user: Meteor.userId()});
    if(!torrent) {
      Torrent.insert({
        user: Meteor.userId(),
        host: "",
        port: 9091,
        username: "",
        password: "",
        ssl: false
      });
      return {host: "",port: 9091,username: "",password: "", ssl: false}
    } else {
      return torrent;
    }
  },
  weather: function() {
    var weather = Weather.findOne({user: Meteor.userId()});
    if(!weather) {
      Weather.insert({
        user: Meteor.userId(),
        appId: "",
        zip: ""
      });
      return {appId: "",zip: ""}
    } else {
      return weather;
    }
  },
  mal: function() {
    var mal = Mal.findOne({user: Meteor.userId()});
    if(!mal) {
      Mal.insert({
        user: Meteor.userId(),
        username: "",
        password: ""
      });
      return {username: "",password: ""}
    } else {
      return mal;
    }
  }
});