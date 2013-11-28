var app = require("../").app;
var Users = require("../data").Users;

app.get("/login",function(req,res){
	res.render("login",{});
});
