var https = require("https");
var qs = require("querystring");
var settings = require("./settings");
var song = require("./song");

var api_root = "api.soundcloud.com";

function _request(options, callback) {
	options = options || {};
	var params = options.params || {};
	params.client_id = settings.API_KEYS.SOUNDCLOUD;
	var api_options = {
		hostname: api_root,
		path: options.path + "?" + qs.stringify(options.params),
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
	var title = raw.title;
	var artist = raw.user.username;
	title = title.replace("--", "-");
	var split_title = title.split("-");
	if(split_title.length > 1) {
		artist = split_title[0].trim();
		title = split_title[1].trim();
	}
	
	var params = {
		title: title,
		artist: artist,
		platform: "soundcloud",
		url: raw.stream_url
	};
	return song(params);
};

module.exports = {
	search: function(options, callback) {
		var api_callback = function(response) {
			var result = parse_song(response[0]);
			callback(result);
		};
		_request({
			path: "/tracks",
			params: {
				q: options.q	
			}
		}, api_callback);
	}
};
