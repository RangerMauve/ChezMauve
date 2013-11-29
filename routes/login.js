var app = require("../").app,
	passport = require("passport"),
	Users = require("../data").Users;

app.get("/login", function (req, res) {
	res.render("login", {});
});

app.get("/auth/google", passport.authenticate("google"));

app.get('/auth/google/return',
	passport.authenticate('google', {
		successRedirect: '/',
		failureRedirect: '/login'
	})
);
