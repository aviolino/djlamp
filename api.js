var url = require("url");
var queue = require("./queue");
var soundcloud = require("./soundcloud");
var lastfm = require("./lastfm");
var echonest = require("./echonest");

function add_song(req, res) {
	queue.add("");
	get_queue(req, res);
};

function get_queue(req, res) {
	var content = queue.get();
	_respond(res, content);
}

function lookup(req, res) {
	var id = url.parse(req.url, true).query.id;
	echonest.lookup({
		id: id
	}, function(song) {
		_respond(res, song);
	});
};

function recommend(req, res) {
	var id = url.parse(req.url, true).query.id;
	echonest.lookup({
		id: id
	}, function(song) {
		lastfm.similar({
			song: song	
		}, function(songs) {
			var content = {
				results: songs,
				original: song
			};
			_respond(res, content);
		});
	});
};

function search(req, res) {
	var term = url.parse(req.url, true).query.q;
	soundcloud.search({
		q: term
	}, function(song) {
		_respond(res, song);
	});
};

function _respond(res, content) {
	res.writeHead(200, {"Content-Type": "application/json"});
	res.write(JSON.stringify(content));
	res.end();
};

module.exports = {
	add_song: add_song,
	get_queue: get_queue,
	recommend: recommend,
	search: search,
	lookup: lookup
};
