this.Torrents = new Meteor.Files({
  debug: true,
  collectionName: 'Torrents',
  allowClientCode: false,
  onBeforeUpload: function (file) {
    console.log(file);
    if (/torrent/i.test(file.extension)) {
      return true;
    } else {
      return 'Please upload a torrent';
    }
  }
});

if (Meteor.isServer) {
  Torrents.denyClient();
} else {
  Meteor.subscribe('files.torrents.all');
}