const fs = require('fs');
const settings = JSON.parse(fs.readFileSync("settings.json"));
const MC = require('mongodb').MongoClient;
let DB = null;

F.wait('database');

MC.connect(settings.mongodb.url, function(err, client) {
	if (err)
		throw err;
  
	DB = client.db(settings.mongodb.dbName);
	F.wait('database');
});

F.database = function(collection) {
	return collection ? DB.collection(collection) : DB;
};