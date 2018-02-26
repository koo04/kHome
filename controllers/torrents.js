exports.install = () => {
  F.route('/torrent/all', getAll, ['get']);
};

function getAll() {
  var self = this;
  self.module('torrents').getAll().then((torrents) => {
    self.json(torrents.torrents);
  });
}