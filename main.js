'use strict';
var fs = require('fs');
var express = require('express');
var db = require('./db');

var app = express();
var config = JSON.parse(fs.readFileSync('./config.json'));

function crossOrigin(req, res, next) {
	if (req.header('Origin')) {
		if (config.allowOrigin)
			res.header('Access-Control-Allow-Origin', config.allowOrigin);
		if (config.allowMethods)
			res.header('Access-Control-Allow-Methods', config.allowMethods);
		if (req.header('Access-Control-Request-Headers'))
			res.header('Access-Control-Allow-Headers', req.header('Access-Control-Request-Headers'));
	}
	next();
}

function parsePath(req, res, done) {
	req.key = req.path.split('/').filter(Boolean);
	done();
}

app.configure(function() {
	app.use(express.logger());
	app.use(express.bodyParser({ strict: false }));
	app.use(crossOrigin);
	app.use(parsePath);
});

app.get('*', function(req, res) {
	var resource = db.get(req.key);
	if (!resource)
		return res.send(404);

	res.header('Content-Type', 'application/json');
	res.send(200, JSON.stringify(resource));
});

app.post('*', function(req, res) {
	db.set(req.key, req.body);
	res.send(200, null);
});

app.put('*', function(req, res) {
	db.set(req.key, req.body);
	res.send(200, null);
});

app.delete('*', function(req, res) {
	db.remove(req.key);
	res.send(200, null);
});

app.listen(config.port);
