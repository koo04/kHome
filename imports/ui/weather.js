import "./weather.html";

(function() {

    Template.weather.onCreated(function() {
        Meteor.call("getWeather", function(err, weather) {
            var sunset = new Date(weather.sunset).getHours();
            var time = new Date().getHours();
            if(time < sunset)
                weather.time = "day";
            else
                weather.time = "night";

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