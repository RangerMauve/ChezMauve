var express = require("express"),
	passport = require("passport"),
	db = require("./data"),
	app = express(),
	httplogger = require("http-logger"),
	logger = httplogger.logger,
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
	module.exports.config = config;
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
	module.exports.config = config;
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
	var logpath = path.join(__dirname, "httpRequests.log");
	app.use(logger(logpath));
	httplogger.server(logpath).listen(6336);

	// Configure passport.js
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(function (req, res, next) {
		res.locals.user = req.user;
		next();
	});

	// Compression
	app.use(express.compress());

	// Serving public files
	require("./routes");
	app.use(express.static(__dirname + "/public"));
	app.use(express.directory('public'))
});

server.listen(process.env.VCAP_APP_PORT || 80);
