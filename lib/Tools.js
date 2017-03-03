var timers = [];

export const Lazy = {
  formToArray: function (form) {
    var fo = [];
    for(var i = 0; i < form.length; i++) {
      fo[form[i].name] = form[i].value;
    }
    return fo;
  }
}

export const Timer = { 
  start: function (name, func, time) {
    console.log('Starting timer for ' + name + ' at ' + time);
    timers.push({name: name, timer: Meteor.setInterval(func, time)});
  },

  stop: function(name) {
    for(var i = 0; i < timers.length; i++) {
      if(timers[i].name == name) {
        console.log('Stopping timer: ' + timers[i].timer);
        Meteor.clearInterval(timers[i].timer);
      }
    }
  },

  stopAll: function() {
    for(var i = 0; i < timers.length; i++) {
      console.log('Stopping timer: ' + timers[i].timer);
      Meteor.clearInterval(timers[i].timer);
    }
  }
}