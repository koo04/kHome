import Future from 'fibers/future';
import { Rss } from '/lib/Rss';
import { Lazy } from '/lib/Tools';

(function() {

  Meteor.methods({
    addRssFeed: function(form) {
      var future = new Future();
      var user = this.userId;
      var formArray = Lazy.formToArray(form);
      Rss.insert({
        user: user,
        title: formArray.rssTitle,
        link: formArray.rssLink
      });

      return future.wait();
    }
  });

}())