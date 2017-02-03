import "./weather.html";

(function() {

    Template.weather.onCreated(function() {
      Meteor.call("getWeather", function(err, weather) {
        var sunset = new Date(weather.sunset).getHours();
        var time = new Date().getHours();
        console.log(weather);
        if(!(weather.code > 699 && weather.code < 800) && !(weather.code > 899 && weather.code < 1000)) {
          if(time < sunset) {
            weather.time = "day-";
          } else {
            if(weather.icon.icon == "sunny") {
              weather.icon.icon = "clear";
            }
            weather.time = "night-";
          }
        }

        Session.set('weather', weather);
      });

      Meteor.setInterval(function() {
        Meteor.call("getWeather", function(err, weather) {
          var sunset = new Date(weather.sunset).getHours();
          var time = new Date().getHours();
          if(!(weather.code > 699 && weather.code < 800) && !(weather.code > 899 && weather.code < 1000)) {
            if(time < sunset) {
              weather.time = "day-";
            } else {
              if(weather.icon.icon == "sunny") {
                weather.icon.icon = "clear";
              }
              weather.time = "night-";
            }
          }

          Session.set('weather', weather);
        });
      }, 60000);
    });

    Template.weather.helpers({
      todaysForcast: function() {
        return Session.get('weather');
      }
    });

}());