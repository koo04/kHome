import { Template } from 'meteor/templating';
import './body.html';
import './settings.js';

function formToArray (form) {
  var fo = [];
  for(var i = 0; i < form.length; i++) {
    fo[form[i].name] = form[i].value;
  }
  return fo;
}

Template.body.onCreated(function() {
  this.settingsPage = new ReactiveVar(false);
});

Template.body.helpers({
  settingsPage: function() {
    return Template.instance().settingsPage.get();
  }
});

Template.body.events({
  'click a.logout': function(e, t) {
    e.preventDefault();
    console.log("User logged out.");
    Meteor.logout();
  },
  'click a.settings': function(e, t) {
    e.preventDefault();
    console.log("Settings page");
    t.settingsPage.set(true);
  }
});

Template.registerHelper("toDateTime", function(time) {
  var dateTime = new Date(time).toLocaleString();
  return dateTime;
});