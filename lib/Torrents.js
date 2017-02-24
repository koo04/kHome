import { FilesCollection } from 'meteor/ostrio:files';

export const Torrents = new FilesCollection({
  debug: true,
  collectionName: 'Torrents',
  allowClientCode: false,
  storagePath: () => {
    return process.env.PWD + '/torrents'
  },
  onBeforeUpload: (file) => {
    if (/torrent/i.test(file.extension)) {
      return true;
    } else {
      return 'Please upload a torrent';
    }
  }
});