var path = require("path"),
	app = require("../").app;

app.get("/tools", function (req, res) {
	res.render("blog/viewlist", require("../data/tools.json"))
});

app.get("/games", function (req, res) {
	res.render("blog/viewlist", require("../data/games.json"));
});

app.get("/userscripts", function (req, res) {
	res.render("blog/viewlist", require("../data/userscripts.json"));
});

app.get(/view(\/.+)/, function (req, res) {
	var path = req.params[0];
	var name = path.match(/\/([^\/]+).html/)[1];
	res.render("blog/frameview", {
		title: name,
		view: {
			url: path
		}
	});
});
