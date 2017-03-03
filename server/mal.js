import Future from 'fibers/future';
import { Mal } from '/lib/Settings';
import { Lazy } from '/lib/Tools';
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
    },

    updateMal: function(form) {
      form = Lazy.formToArray(form);
      Mal.update({user: this.userId}, {
        $set:{
          username: form['malUsername'],
          password: form['malPassword']
        }
      });
    }

  });

}())