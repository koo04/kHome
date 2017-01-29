import Future from 'fibers/future';
var settings = Meteor.settings.private.weather;

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

function get(type) {
  var future = new Future();
  var location = getPlace();
  Meteor.http.call("GET", "http://api.openweathermap.org/data/2.5/" + type + "?" + location + "&units=imperial&appid=" + settings.appID, function(err, res) {
    var weather = {};
    console.log(res.data.weather);
    if(err){ 
      future.return(err)
    } else {
      weather.temp = res.data.main.temp;
      weather.humidity = res.data.main.humidity;
      weather.wind = {};
      weather.wind.speed = res.data.wind.speed;
      weather.wind.dir = res.data.wind.deg;
      future.return(weather);
    }
  });
  return future.wait();
}

(function() {

  Meteor.methods({
      
    getWeather: function() {
      return get("weather");
    }

  });

}())