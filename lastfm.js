var https = require("https");
var qs = require("querystring");
var settings = require("./settings");
var song = require("./song");

var api_root = "ws.audioscrobbler.com";

function _request(options, callback) {
	options = options || {};
	options.api_key = settings.API_KEYS.LASTFM;
	options.format = "json";
	var api_options = {
		hostname: api_root,
		path: "/2.0/?" + qs.stringify(options),
		method: "GET"
	};
	var data = '';
	var req = https.request(api_options, function(res) {
		res.setEncoding("utf8");
		res.on("data", function(chunk) {
			data += chunk;
		});
		res.on("end", function() {
			var parsed = JSON.parse(data);
			callback(parsed);
		});
	});
	req.end();
};

module.exports = {
	similar: function(options, callback) {
		_request({
			method: "track.getSimilar",
			artist: options.song.artist,
			track: options.song.title,
			limit: 10
		}, callback);
	}
};
