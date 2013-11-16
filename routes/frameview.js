var caching = require("../caching"),
	notmodified = require("notmodified"),
	path = require("path");

module.exports = function (app) {
	app.get(/view(\/.+)/, function (req, res) {
		var path = req.params[0];
		var name = path.match(/\/([^\/]+).html/)[1];
		caching.cacheInfo(path.normalize(__dirname+"/../templates/frameview.jade"), function (err, info) {
			if (err) return res.send(500, err.stack);
			if (notmodified(req, res, info)) return res.end();
			res.render("frameview", {
				title: name,
				view: {
					url: path
				}
			});
		});
	});
}
