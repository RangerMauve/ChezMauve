var caching = require("../caching"),
	notmodified = require("notmodified");

module.exports = function (app) {
	app.get(/view(\/.+)/, function (req, res) {
		var path = req.params[0];
		var name = path.match(/\/([^\/]+).html/)[1];
		caching.cacheInfo("./public"+path, function (err, info) {
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
