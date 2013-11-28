var app = require("../").app;

app.get("/login",function(req,res){
	res.render("login",{});
});
