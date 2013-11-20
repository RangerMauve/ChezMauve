var
	express = require("express"),
	app = express(),
	logger = require("http-logger").logger,
	path = require("path"),
	busy = require("busy")({max:500,interval:200}),
	http = require('http'),
	server = http.createServer(app);

module.exports.app = app;
module.exports.server = server;

// Set up templates
app.set("views",__dirname+"/templates");
app.set("view engine","jade");
app.locals.pretty = true;
app.locals.menu = require("./data/menu.json");

// Prevent server for crashing too hard under high load
app.use(function(req,res,next){
	busy.blocked ? res.send(503,"Server load too high") : next();
});

// Parsing out the body and session data
app.use(express.json());
app.use(express.urlencoded());
app.use(express.cookieParser());
app.use(express.cookieSession({secret:"Where are the bodies?!"}));

// Logging
app.use(logger(path.join(__dirname,"httpRequests.log")));
//app.use(express.logger());

// Compression
app.use(express.compress());

// Serving public files
require("./routes");
app.use(express.static(__dirname + "/public"));
app.use(express.directory('public'))

// For pesky bots scanning stuff they shouldn't be
app.use(function(req, res,next) {
	res.writeHead(418);
	res.end("<html>\n<center><h1>404</h1></center>\n<!-- What are you even looking here for?-->\n</html>");
});


server.listen(process.env.VCAP_APP_PORT || 80);
