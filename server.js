var url = require("url");
var express = require("express");
var api = require("./api");

var app = express();
app.use(express.static('assets'));

var port = process.env.PORT || 8000;

function index(req, res) {
	res.sendFile(__dirname + "/assets/pages/app.html");
};

app.get("/api/lookup", api.lookup);
app.get("/api/queue", api.get_queue);
app.get("/api/recommend", api.recommend);
app.get("/api/search", api.search);
app.get("/api/song", api.add_song);
app.get("/", index);

process.on('uncaughtException', function (err) {
    console.log(err);
});

app.listen(port);
