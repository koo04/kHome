import "./weather.html";

(function() {

    Template.weather.onCreated(function() {
        Meteor.call("getWeather", function(err, weather) {
            console.log(weather);
            Session.set('weather', weather);
        });
    });

    Template.weather.helpers({
        todaysForcast: function() {
            return Session.get('weather');
        }
    });

}());