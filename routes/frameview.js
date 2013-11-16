module.exports = function (app) {
	app.get(/view(\/.+)/, function (req, res) {
		var path = req.params[0];
		var name = path.match(/\/([^\/]+).html/)[1];
		res.render("frameview", {
			title: name,
			view: {
				url: path
			}
		});
	})
}
