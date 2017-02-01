import { Template } from 'meteor/templating';
import './body.html';

Template.registerHelper("toDateTime", function(time) {
  var dateTime = new Date(time).toLocaleString();
  return dateTime;
});

Template.body.helpers({
  
});

Template.body.events({
});