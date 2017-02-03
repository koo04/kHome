import { Template } from 'meteor/templating';
import './body.html';

Template.body.onCreated(function() {

});

Template.registerHelper("toDateTime", function(time) {
  var dateTime = new Date(time).toLocaleString();
  return dateTime;
});

Template.body.helpers({
});

Template.body.events({
  'click a.logout': function(e, t) {
    e.preventDefault();

    Meteor.logout();
  }
});