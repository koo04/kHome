import { Profile } from '/lib/Settings';
import { Lazy } from '/lib/Tools';


(function() {

  Meteor.methods({

    updateProfile: function(form) {
      console.log('Updating ' + this.userId + '\'s profile...');
      form = Lazy.formToArray(form);
      Profile.update({user: this.userId}, {
        $set:{
          fName: form['fName'],
          lName: form['lName']
        }
      });
      // Session.set('profile', {fName: form['fName'], lName: form['lName']});
      return true;
    } 

  });

}())

