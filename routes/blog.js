var app = require("../").app;

app.get("/", function (req, res) {
	res.render("blog/homepage", require("../data/home.json"));
});
