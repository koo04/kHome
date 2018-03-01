var socket = io.connect();
var timer = 5;
var width = 100;
var toLow = (width/timer);
var torrentTimer;

$(document).ready(function() {
  socket.emit('torrents', 'please');
  socket.emit('weather', 'please');

  torrentTimer = setInterval(() => {
    if(timer <= 0) {
      timer = 5;
      socket.emit('torrents', 'please');
      width = 100;
    }
    timer -= 1;

    width -= toLow;
    width = width.toFixed(2);

    $('.countdown').animate({
      width: width+"%"
    }, 500);
  }, 1000);

  socket.on('torrents', (torrents) => {
    var torrentList = $('div.torrents>table');
    $('div.torrents>table tr.torrent').remove();
    torrents.reverse().forEach((torrent) => {
      torrentList.append(`<tr class="torrent">
        <td>${torrent.name}</td>
        <td>${torrent.rateDownload}</td>
        <td>${torrent.rateUpload}</td>
        <td>${torrent.status}</td>
        <td class="timeago" datetime="${new Date(torrent.addedDate*1000).toISOString()}">${new Date().toLocaleString()}</td>
        <td class="timeago" datetime="${new Date(torrent.doneDate*1000).toISOString()}">${new Date().toLocaleString()}</td>
      </tr>`);
    });
    $("td.timeago").timeago();
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