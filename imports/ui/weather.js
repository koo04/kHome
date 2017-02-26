import { Timer } from '../../lib/Tools';
import "./weather.html";

(function() {

    Template.weather.onRendered(function() {
      Meteor.call("getWeather", function(err, weather) {
        if(!weather.response){
          var sunset = new Date(weather.sunset).getHours();
          var time = new Date().getHours();
          console.log("Getting the initial weather report.");
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
          
          Timer.start('weather', function() {
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
              console.log("Got the weather report.");

              Session.set('weather', weather);
            });
          }, 60000);
        } else if(weather.response.statusCode == 401) {
          Session.set('weatherError', 'Invalid API Key');
        }
      });
    });

    Template.weather.helpers({
      todaysForcast: function() {
        return Session.get('weather');
      },
      weatherError: function() {
        return Session.get('weatherError');
      }
    });

}());