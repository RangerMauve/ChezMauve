var Datastore = require("nedb");

var db = {};

db.Users = new Datastore({
	filename: __dirname + "/users.json",
	autoload: true
});

db.BlogPosts = new Datastore({
	filename: __dirname + "/blogposts.json",
	autoload: true
});
