var app = require("../").app,
	passport = require("passport"),
	GoogleStrategy = require("passport-google").Strategy,
	TwitterStrategy = require("passport-twitter").Strategy,
	db = require("../data"),
	Users = db.Users,
	config = require("../").config;

// Website endpoints for loggin in/out
app.get("/login", function (req, res) {
	res.render("login", {});
});
app.get("/logout", function (req, res) {
	req.logout();
	res.redirect("/login");
});

// Get/set users through NeDB
passport.serializeUser(function (user, done) {
	console.log("Serialize", user);
	db.Users.update({
		openId: user.openId
	}, user, {}, function (err) {
		if (err) done(err, null);
		else done(null, user.openId);
	})
});
passport.deserializeUser(function (id, done) {
	console.log("Deserialize", id);
	db.Users.findOne({
		openId: id
	}, function (err, doc) {
		if (!doc) {
			done("Not Found", null);
		} else if (err) {
			done(err, null);
		} else done(null, doc);
	});
});

// Login with Google
passport.use(new GoogleStrategy({
		returnURL: config.domain + "/auth/google/return",
		realm: config.domain + "/"
	},
	function (ident, profile, done) {
		var url = require("url");
		var id = url.parse(ident, true).query.id;
		db.Users.update({
			openId: id
		}, {
			openId: id,
			displayName: profile.displayName,
			emails: profile.emails || [],
		}, {
			upsert: true
		}, function (err, docs) {
			db.Users.findOne({
				openId: id
			}, function (err, user) {
				done(err, user);
			});
		});
	}
));
// Auth endpoint
app.get("/auth/google", passport.authenticate("google"));
// Auth redirect endpoint
app.get('/auth/google/return',
	passport.authenticate('google', {
		successRedirect: '/',
		failureRedirect: '/login'
	})
);

//Login with twitter
passport.use(new TwitterStrategy({
		consumerKey: process.env["TWITTER_KEY"],
		consumerSecret: process.env["TWITTER_SECRET"],
		callbackURL: config.domain + "/auth/twitter/return"
	},
	function (token, secret, profile, done) {
		db.Users.update({
			openId: token
		}, {
			openId: token,
			displayName: profile.displayName,
			emails: profile.emails || [],
		}, {
			upsert: true
		}, function (err, docs) {
			db.Users.findOne({
				openId: token
			}, function (err, user) {
				done(err, user);
			});
		});
	}
));
// Auth endpoint
app.get("/auth/twitter", passport.authenticate("twitter"));
// Auth redirect endpoint
app.get("/auth/twitter/return",
	passport.authenticate("twitter", {
		successRedirect: "/",
		failureRedirect: "/login"
	})
);
