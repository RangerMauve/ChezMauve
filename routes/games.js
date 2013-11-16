var caching = require("../caching"),
	notmodified = require("notmodified"),
	path = require("path");

module.exports = function (app) {
	app.get("/games", function (req, res) {
		caching.cacheInfo(path.normalize(__dirname+"/../templates/viewlist.jade"), function (err, info) {
			if (err) return res.send(500, err.stack);
			if (notmodified(req, res, info)) return res.end();
			res.render("viewlist", {
				title: "Games",
				tab: "Games",
				list: {
					description: "This is a bunch of games or \"toys\" that I've made for fun.",
					items: [
						{
							title: "Psycosnake",
							description: "A snake clone with pretty colors.",
							url: "/view/singles/Psychosnake.html",
							icon: "map"
						},
						{
							title: "Dodge",
							description: "A 3D arcade game that never happened",
							url: "/singles/Dodge.html",
							icon: "rocket"
						}
					]
				}
			});
		});
	})
}
