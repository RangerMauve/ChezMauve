var caching = require("../caching"),
	notmodified = require("notmodified"),
	path = require("path"),
	app = require("../").app;

app.get(/view(\/.+)/, function (req, res) {
	caching.cacheInfo(path.normalize(__dirname+"/../templates/frameview.jade"), function (err, info) {
		if (err) return res.send(500, err.stack);
		if (notmodified(req, res, info)) return res.end();
		var path = req.params[0];
		var name = path.match(/\/([^\/]+).html/)[1];
		res.render("frameview", {
			title: name,
			view: {
				url: path
			}
		});
	});
});
