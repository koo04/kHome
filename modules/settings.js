exports.name = "settings";

const fs = require('fs');

exports.install = function() {
  F.on('load', function() {
    this.settings = JSON.parse(fs.readFileSync("settings.json"));
  });
};