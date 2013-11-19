var fs = require("fs");

module.exports = {
	cacheInfo: function (file, done) {
		fs.stat(file, function (error, stat) {
			if (error) return done(error, null);
			var result = {
				mtime: stat.mtime
			}
			done(null, result);
		});
	}
}
