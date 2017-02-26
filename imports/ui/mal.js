import './mal.html';

Template.mal.onCreated(function() {
    this.stats = new ReactiveVar(false);
});

Template.mal.onRendered(function() {
  var t = this;
  Meteor.call('getAnimeStats', function(err, stats) {
    console.log(stats);
    t.stats.set(stats);
  });
});

Template.mal.helpers({
  getStats: function() {
    return Template.instance().stats.get();
  }
});