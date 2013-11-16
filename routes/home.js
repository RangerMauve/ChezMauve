module.exports = function(app){
	app.get("/",function(req,res){
		res.render("homepage",{title:"Home",tab:"Home"});
	})
}
