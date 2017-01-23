// import Transmission from 'transmission';
// import Future from 'fibers/future';
// (function() {  

//   Meteor.methods({

//     getTorrents: function () {

//       var future = new Future();

//       if(this.isSimulation) {
//         Session.set('torrents', "Getting torrents...");
//         return;
//       } else {
  //       var transmission = new Transmission ({
  //         host: 'torrent.koo.technology',
  //         port: 9091,
  //         username: 'koo',
  //         password: 'L@rk0811',
  //         ssl: false
  //       });

  //       transmission.get(function(err, res) {
  //         if(err)
  //           future.return(err);
  //         else
  //           future.return(res);
  //       });

  //       return future.wait();
//       }

//     }

//   });

// }())
