var caching = require("../caching"),
	notmodified = require("notmodified"),
	path = require("path");

module.exports = function (app) {
	app.get("/", function (req, res) {
		caching.cacheInfo(path.normalize(__dirname+"/../data/home.json"), function (err, info) {
			if (err) return res.send(500, err.stack);
			if (notmodified(req, res, info)) return res.end();
			res.render("homepage", require("../data/home.json") );
		});
	})
}
