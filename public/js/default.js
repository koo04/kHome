var socket = io.connect();

$(document).ready(function() {
  socket.on('torrents', (torrents) => {
    var torrentList = $('div.torrents');
    torrentList.empty();
    torrents.forEach((torrent) => {
      torrentList.append(`<div class="torrent">${torrent.name} | ${torrent.rateDownload} | ${torrent.rateUpload} | ${torrent.status}</div>`);
    });
  });

  socket.on("weather", (weather) => {
    var weatherDiv = $('div.weather');
    var weather = JSON.parse(weather);
    weatherDiv.html(`${Math.floor(weather.main.temp)}`);
  });
});

