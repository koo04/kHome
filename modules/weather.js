//http://api.openweathermap.org/data/2.5/weather?q=mira%20loma,us&APPID={APPID}
exports.name = "weather";
exports.version = "0.0.1";
exports.dependencies = ['settings','socket'];

  let settings;

  exports.install = function() {
    F.on('ready', function() {
      settings = F.settings;
      if(settings.weather && settings.weather.appID) {
        F.on('ready', () => {
          this.getWeather();
          setInterval(function(callback) {
            F.module('weather').getWeather();
          }, 60000*60);
        });
      } else {
        LOG(`Weather is Disabled!`);
      }
    });
  };

    exports.getWeather = function() {
      if(F.settings.weather && F.settings.mongodb) {
        var query = settings.weather.city ? "q=" : "zip=";
        U.request(`http://api.openweathermap.org/data/2.5/weather?${query}${settings.weather.city || settings.weather.zip}&APPID=${settings.weather.appID}&units=imperial`, {}, function(err, weather, status, headers, host) {
          var weatherDB = F.database('weather');
          weather = JSON.parse(weather);
          weather.dateTime = Date.now();
          weatherDB.insert(weather);
        });
      } else {
        LOG(`Weather is Disabled!`);
      }
    };

  exports.getWeatherNow = function() {
    if(F.settings.weather && F.settings.weather.appID) {
      var query = settings.weather.city ? "q=" : "zip=";
      U.request(`http://api.openweathermap.org/data/2.5/weather?${query}${settings.weather.city || settings.weather.zip}&APPID=${settings.weather.appID}&units=imperial`, {}, function(err, weather, status, headers, host) {
        var weatherDB = F.database('weather'); 
        weather = JSON.parse(weather);
        weather.dateTime = Date.now();
        F.io.emit('weather', err || weather);
      });
    } else {
      F.io.emit('weather', 'disabled');
    }
  };