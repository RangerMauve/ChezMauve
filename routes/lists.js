var caching = require("../caching"),
	notmodified = require("notmodified"),
	path = require("path"),
	app = require("../").app;

app.get("/tools", function (req, res) {
	// Set caching for this route based on the template since the data is static
	caching.cacheInfo(path.normalize(__dirname + "/../data/tools.json"), function (err, info) {
		if (err) return res.send(500, err.stack);
		if (notmodified(req, res, info)) return res.end();
		res.render("viewlist", require("../data/tools.json"))
	})
});

app.get("/", function (req, res) {
	caching.cacheInfo(path.normalize(__dirname + "/../data/home.json"), function (err, info) {
		if (err) return res.send(500, err.stack);
		if (notmodified(req, res, info)) return res.end();
		res.render("homepage", require("../data/home.json"));
	});
})

app.get("/games", function (req, res) {
	caching.cacheInfo(path.normalize(__dirname+"/../data/games.json"), function (err, info) {
		if (err) return res.send(500, err.stack);
		if (notmodified(req, res, info)) return res.end();
		res.render("viewlist", require("../data/games.json"));
	});
})
