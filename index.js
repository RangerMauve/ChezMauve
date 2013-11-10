var
	express = require("express"),
	exphbs  = require('express3-handlebars'),
	app = express(),
	logger = require("http-logger").logger;

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded());
app.use(express.cookieParser());
app.use(express.cookieSession({secret:"Where are the bodies?!"}));
app.use(logger(path.join(__dirname,"httpRequests.log")));
app.use(logger());
require("./routes")(app);
app.use(express.static(__dirname + "/public"));
app.use(express.directory('public'))

app.listen(process.env.VCAP_APP_PORT || 80);
