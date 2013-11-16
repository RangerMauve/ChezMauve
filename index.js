var
	express = require("express"),
	app = express(),
	logger = require("http-logger").logger,
	path = require("path"),
	busy = require("busy")();

// Set up templates
app.set("views",__dirname+"/templates");
app.set("view engine","jade");
app.locals.pretty = true;
app.locals.menu = {
	links:[
		{name:"Home",url:"/",icon:"home"},
		{name:"Games",url:"/games",icon:"gamepad"},
		{name:"Tools",url:"/tools",icon:"wrench"},
		{name:"Userscripts",url:"/userscripts",icon:"puzzle piece"},
	],
	contact:[
		{url:"https://github.com/RangerMauve",icon:"green github"},
		{url:"https://twitter.com/LoneMauve",icon:"blue twitter"},
		{url:"http://www.linkedin.com/profile/view?id=280090458",icon:"linkedin"}
	]
}

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
app.use(express.logger());

// Compression
app.use(express.compress());

// Serving public files
require("./routes")(app);
app.use(express.static(__dirname + "/public"));
app.use(express.directory('public'))

// For pesky bots scanning stuff they shouldn't be
app.use(function(req, res,next) {
	res.writeHead(418);
	res.end("<html>\n<center><h1>404</h1></center>\n<!-- What are you even looking here for?-->\n</html>");
});


app.listen(process.env.VCAP_APP_PORT || 80);
