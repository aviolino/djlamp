var https = require("https");
var qs = require("querystring");
var settings = require("./settings");
var song = require("./song");

var api_root = "developer.echonest.com";

function _request(options, callback) {
	options = options || {};
	var params = options.params || {};
	params.api_key = settings.API_KEYS.ECHONEST;
	params.format = "json";
	var api_options = {
		hostname: api_root,
		path: "/api/v4" + options.path + "?" + qs.stringify(params),
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

function parse_song(raw) {
	var params = {
		title: raw.title,
		artist: raw.artist_name,
		id: raw.id,
		platform: "echonest"
	};
	return song(params);
};

module.exports = {
	lookup: function(options, callback) {
		var api_callback = function(res) {
			var result; 
			if(res && res.response && res.response.songs) {
				var result = parse_song(res.response.songs[0]);	
			}
			callback(result);
		};
		_request({
			path: "/song/profile",
			params: {
				track_id: options.id
			}
		}, api_callback);
	}
};
