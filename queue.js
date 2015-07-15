
module.exports = {
	_queue: [],
	
	add: function(song) {
		this._queue.push(song);
	},
	
	get: function() {
		return this._queue;
	}
};
