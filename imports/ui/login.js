import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import './login.html'

(function() {
  var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");

  Template.login.onCreated(function() {
    this.register = new ReactiveVar(false);
    this.good = new ReactiveVar(false);
  });

  Template.login.events({
    'click [name=btn_register]': function(e, t) {
      e.preventDefault();
      t.register.set(true);
    },
    'change [name=password]': function(e, t) {
      var password = $('[name=password]');
      if(strongRegex.test(password.val())) {
        password.addClass("valid");
        password.removeClass("invalid");
        t.good.set(true);
      } else {
        password.addClass("invalid");
        password.removeClass("valid");
        t.good.set(false);
      }
    },
    'change [name=re-password]': function(e, t) {
      var password = $('[name=password]');
      var repassword = $('[name=re-password]');
      if(repassword.val() != password.val()) {
        repassword.addClass("invalid");
        repassword.removeClass("valid");
        t.good.set(false);
      } else {
        repassword.addClass("valid");
        repassword.removeClass("invalid");
        t.good.set(true);
      }
    },
    'submit form': function(e, t) {
      e.preventDefault();
      var email = $('[name=email]').val();
      var password = $('[name=password]').val();
      var good = t.good.get();
      if($('form').hasClass('register')) {
        if(good) {
          Accounts.createUser({
            email: email,
            password: password
          });
        }
      } else if($('form').hasClass('login')) {
        Meteor.loginWithPassword(email, password, function(err) {
          if(err)
            console.log(err)
        });
      }
    }
  });

  Template.login.helpers({
    register: function() {
      return Template.instance().register.get();
    },
    userCount: function() {
      return Meteor.call('getUserCount');
    }
  });

}());