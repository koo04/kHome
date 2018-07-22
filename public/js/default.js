var socket = io.connect();
var timer = 5;
var width = 100;
var toLow = (width/timer);
var torrentTimer;

$(document).ready(function() {
  socket.emit('torrents', 'please');
  socket.emit('weather', 'please');

//   torrentTimer = setInterval(() => {
//     if(timer <= 0) {
//       timer = 5;
//       socket.emit('torrents', 'please');
//       width = 100;
//     }
//     timer -= 1;

//     width -= toLow;
//     width = width.toFixed(2);

//     $('.countdown').animate({
//       width: width+"%"
//     }, 500);
//   }, 1000);

  socket.on('torrents', (torrents) => {
    console.log(torrents);
    $('div.torrents>table').DataTable({
      "data": torrents,
      "columns": [{title: "Name"},
      {title: "DL Rate"},
      {title: "UL Rate"},
      {title: "Status"},
      {title: "Added"},
      {title: "Finished"}]
    });
  });

  socket.on("weather", (weather) => {
    var temp = $('div.temp>span');
    var windSpeed = $('div.windSpeed>span');
    var windDir = $('div.windDir>span');
    temp.html(`${Math.floor(weather.main.temp)}`);
    windSpeed.html(`${weather.wind.speed}`);
    windDir.html(`${Math.floor(weather.wind.deg)}`);
  });
});