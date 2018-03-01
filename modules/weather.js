//http://api.openweathermap.org/data/2.5/weather?q=mira%20loma,us&APPID=ace8faecc7058f241c5e19f3842bb2e0
exports.name = "weather";
exports.version = "0.0.1";
exports.dependencies = ['socket'];

let settings;

exports.install = function() {
  F.on('ready', () => {
    settings = F.settings;
    this.getWeather();
    setInterval(function(callback) {
      F.module('weather').getWeather();
    }, 60000*60);
  });
};

exports.getWeather = function() {
  var query = settings.weather.city ? "q=" : "zip=";
  U.request(`http://api.openweathermap.org/data/2.5/weather?${query}${settings.weather.city || settings.weather.zip}&APPID=${settings.weather.appID}&units=imperial`, {}, function(err, weather, status, headers, host) {
    var weatherDB = F.database('weather'); 
    weather = JSON.parse(weather);
    weather.dateTime = Date.now();
    weatherDB.insert(weather);
  });
};

exports.getWeatherNow = function() {
  var query = settings.weather.city ? "q=" : "zip=";
  U.request(`http://api.openweathermap.org/data/2.5/weather?${query}${settings.weather.city || settings.weather.zip}&APPID=${settings.weather.appID}&units=imperial`, {}, function(err, weather, status, headers, host) {
    var weatherDB = F.database('weather'); 
    weather = JSON.parse(weather);
    weather.dateTime = Date.now();
    F.io.emit('weather', err || weather);
  });
};