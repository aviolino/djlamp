var http = require("http");
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
	var req = http.request(api_options, function(res) {
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
		title: raw.name,
		artist: raw.artist.name,
		platform: "lastfm",
		id: raw.mbid
	};
	return song(params);
};

module.exports = {
	similar: function(options, callback) {
		var api_callback = function(res) {
			var parsed = [];
			if(res && res.similartracks) {
				var raw_songs = res.similartracks.track;
				if( typeof raw_songs === 'string' ) {
					raw_songs = [];
				}
				parsed = raw_songs.map(function(raw_song) {
					return parse_song(raw_song);
				});	
			}
			callback(parsed);
		};
		_request({
			method: "track.getSimilar",
			artist: options.song.artist,
			track: options.song.title,
			limit: 10
		}, api_callback);
	}
};
