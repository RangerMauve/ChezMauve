var caching = require("../caching"),
	notmodified = require("notmodified"),
	path = require("path");

module.exports = function (app) {
	app.get("/games", function (req, res) {
		caching.cacheInfo(path.normalize(__dirname+"/../data/games.json"), function (err, info) {
			if (err) return res.send(500, err.stack);
			if (notmodified(req, res, info)) return res.end();
			res.render("viewlist", require("../data/games.json"));
		});
	})
}
