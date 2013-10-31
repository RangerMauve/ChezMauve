/*
 * Loads routes from files located in current directory
 * Reads a list of file names, iterates through each name,
 * require()'s the file, then calls the .register() method
 * on it and passes the reference to the current express app
 * */
var fs = require('fs');

module.exports = function(app){
	// Read other files in dir
	var files = fs.readdirSync(__dirname);
	for(var i = 0; i < files.length; i++){
		if(files[i] != "index.js"){
			require("./"+files[i])(app);
		}
	}
};