var timers = [];

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