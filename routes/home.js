var caching = require("../caching"),
	notmodified = require("notmodified"),
	require("path");

module.exports = function (app) {
	app.get("/", function (req, res) {
		caching.cacheInfo(path.normalize(__dirname+"/../templates/homepage.jade"), function (err, info) {
			if (err) return res.send(500, err.stack);
			if (notmodified(req, res, info)) return res.end();
			res.render("homepage", {
				title: "Home",
				tab: "Home"
			});
		});
	})
}
