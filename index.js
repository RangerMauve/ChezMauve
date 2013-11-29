var express = require("express"),
	passport = require("passport"),
	GoogleStrategy = require("passport-google").Strategy,
	db = require("./data"),
	app = express(),
	logger = require("http-logger").logger,
	path = require("path"),
	http = require('http'),
	server = http.createServer(app),
	config;

module.exports.app = app;
module.exports.server = server;

// Configure production-specific settings
app.configure("production", function () {
	// Set up config
	var rawcfg = require("./config.json");
	config = rawcfg.production;
	for (var k in rawcfg) {
		if (k !== "production" && k != "development") {
			config[k] = rawcfg[k];
		}
	}

	// Set script locals to not be pulled from file system
	app.locals.scripts = require("./data/scriptLocals.json").production;
});

// Configure development-specific settings
app.configure("development", function () {
	// Set up config
	var rawcfg = require("./config.json");
	config = rawcfg.development;
	for (var k in rawcfg) {
		if (k !== "production" && k != "development") {
			config[k] = rawcfg[k];
		}
	}

	// Have script locals point to files on the server for use without an internet connection
	app.locals.scripts = require("./data/scriptLocals.json").development;

	// Have logging made to the console
	//app.use(express.logger());
});

// Configure for both production and development
app.configure("production", "development", function () {

	// Set up templates
	app.set("views", __dirname + "/templates");
	app.set("view engine", "jade");
	app.locals.pretty = true;
	app.locals.menu = require("./data/menu.json");

	// Parsing out the body and session data
	app.use(express.json());
	app.use(express.urlencoded());
	app.use(express.cookieParser());
	app.use(express.cookieSession({
		secret: "Where are the bodies?!"
	}));

	// Logging
	app.use(logger(path.join(__dirname, "httpRequests.log")));

	// Configure passport.js
	app.use(passport.initialize());
	app.use(passport.session());
	passport.serializeUser(function (user, done) {
		console.log("Serialize", user);
		db.Users.update({openId:user.openId},user,{},function(err){
			if(err)done(err,null);
			else done(null, user.openId);
		})
	});
	passport.deserializeUser(function (id, done) {
		console.log("Deserialize", id);
		db.Users.findOne({
			openId: id
		}, function(err,doc){
			if(!doc){
				done("Not Found",null);
			} else if(err){
				done(err,null);
			} else done(null,doc);
		});
	})
	passport.use(new GoogleStrategy({
			returnURL: config.domain + "/auth/google/return",
			realm: config.domain + "/"
		},
		function (ident, profile, done) {
			var url = require("url");
			var id = url.parse(ident, true).query.id;
			console.log("Login", profile);
			db.Users.update({
				openId: id
			}, {
				openId: id,
				profile: profile
			}, {
				upsert: true
			}, function (err, docs) {
				db.Users.findOne({
					openId: id
				}, function (err, user) {
					done(err, user);
				});
			});
		}
	));

	// Compression
	app.use(express.compress());

	// Serving public files
	require("./routes");
	app.use(express.static(__dirname + "/public"));
	app.use(express.directory('public'))
});

server.listen(process.env.VCAP_APP_PORT || 80);
