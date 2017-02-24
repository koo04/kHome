import Future from 'fibers/future';
import { Mal } from '/lib/Settings';
import popura from 'popura';

(function() {

  Meteor.methods({

    getAnimeStats: function() {
      var settings = Mal.findOne({user: Meteor.userId()});
      // client = popura(settings.username, settings.password);

      // var list = client.getAnimeList();
      //TODO: Create Stats;
    },

    getAnimeList: function() {
      var settings = Mal.findOne({user: Meteor.userId()});
      // client = popura(settings.username, settings.password);

      // client.getAnimeList()
      //   .then(res => console.log(res))
      //   .catch(err => console.log(err));
    }

  });

}())