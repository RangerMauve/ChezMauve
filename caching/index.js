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
		if (file in cache_info) {
			done(null, cache_info[file]);
		} else {
			fs.stat(file, function (error, stat) {
				if(error)return done(error,null);
				var result = {
					mtime: stat.mtime
				}
				done(null, result);
				module.exports.updateCacheInfo(file,result);
			});
		}
	},
	updateCacheInfo: function (file, info, done) {
		cache_info[file] = info;
		fs.writeFile(
			__dirname+"/cache-info.json",
			JSON.stringify(cache_info),
			done
		);
	}
}
