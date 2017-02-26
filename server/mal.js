import Future from 'fibers/future';
import { Mal } from '/lib/Settings';
import popura from 'popura';

(function() {

  Meteor.methods({

    getAnimeStats: function() {
      var future = new Future();
      var settings = Mal.findOne({user: Meteor.userId()});
      client = popura(settings.username, settings.password);
      client.getAnimeList()
        .then(res => future.return(res));
      return future.wait();
    }

  });

}())