import './mal.html';

Template.mal.onCreated(function() {
    this.stats = new ReactiveVar(false);

    this.stats.set(Meteor.call('getAnimeStats'));
});

Template.mal.onRendered(function() {
  Meteor.call('getAnimeList');
})

Template.mal.helpers({
  getStats: function() {
    return Template.instance().stats.get();
  }
});