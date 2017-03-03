import Future from 'fibers/future';
import { Weather } from '/lib/Settings';
var convertion = JSON.parse(Assets.getText('weatherIcons.json'));
function getPlace() {
  if(settings.cityID != "")
    return "id=" + settings.cityID;
  else if(settings.lon != "" && settings.lat != "")
    return "lat=" + settings.lat + "&lon=" + settings.lon;
  else if(settings.zip)
    return "zip=" + settings.zip + "," + settings.countryCode;
  else if(settings.city != "")
    return "q=" + settings.city + "," + settings.countryCode;
}

(function() {

  Meteor.methods({
      
    getWeather: function() {
      var future = new Future();
      // var location = getPlace();
      var settings = Weather.findOne({user: Meteor.userId()});
      console.log("Getting weather for " + Meteor.userId());
      Meteor.http.call("GET", "http://api.openweathermap.org/data/2.5/weather?zip=" + settings.zip  + ",us&units=imperial&appid=" + settings.appId, function(err, res) {
        var weather = {};
        if(err){ 
          future.return(err);
        } else {
          weather.code = res.data.weather[0].id
          weather.temp = Math.floor(res.data.main.temp);
          weather.humidity = res.data.main.humidity;
          weather.wind = {};
          weather.wind.speed = res.data.wind.speed;
          weather.wind.dir = res.data.wind.deg;
          weather.sunset = res.data.sys.sunset*1000
          weather.icon = convertion[res.data.weather[0].id];
          future.return(weather);
        }
      });
      return future.wait();
    },

    updateWeather: function(form) {
      form = formToArray(form);
      Weather.update({user: this.userId}, {
        $set:{
          appId: form['weatherAppID'],
          zip: form['weatherZip']
        }
      });
    }

  });

}())