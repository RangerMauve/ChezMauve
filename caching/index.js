var crypto = require("crypto");
var fs = require("fs");
var cache_info = require("./cache-info.json");
// Regenerate cache info from JSON file
for (var k in cache_info) {
	cache_info[k].mtime = new Date(cache_info[k].mtime);
}

function hashData(data) {
	return crypto.createHash("md5").update(data).digest("hex");
}

module.exports = {
	cacheInfo: function (file, done) {
		var filestat, filedata, err;
		if (file in cache_info) {
			done(null, cache_info[file]);
		} else {
			function tryFinish() {
				if (err) {
					done(err, null);
				} else if (filestat && filedata) {
					var hash = hashData(filedata);
					var modified = filestat.mtime;
					var result = {
						hash: hash,
						mtime: modified
					}
					cache_info[file] = result;
					done(null, result);
					module.exports.updateCacheInfo(file,result);
				}
			}
			fs.readFile(file, function (error, data) {
				if (error) err = error;
				else filedata = data;
				tryFinish();
			});
			fs.stat(file, function (error, stat) {
				if (error) err = error;
				else filestat = stat;
				tryFinish();
			});
		}
	},
	updateCacheInfo: function (file, info, done) {
		fs.writeFile(
			"./caching/cache-info.json",
			JSON.stringify(cache_info),
			done
		);
	}
}
