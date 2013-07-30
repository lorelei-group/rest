'use strict';
var fs = require('fs');
var dataFile = './data.json';

var load = function() {
	if (!fs.existsSync(dataFile))
		fs.writeFileSync(dataFile, '{}');

	var json = JSON.parse(fs.readFileSync(dataFile));
	var data = Object.create(null);
	Object.keys(json).forEach(function(key) { data[key] = json[key] });

	load = function() { return data };
	return data;
};

function save(data) {
	fs.writeFile('./data.json', JSON.stringify(data));
}


function get(path) {
	var data = load();
	var target = path.reduce(function(target, id) {
		return target && target[id];
	}, data);
	return target == null ? null : target;
}

function set(path, value) {
	var data = load();
	var key = path.pop();

	var target = path.reduce(function(target, id) {
		if (target[id] == null)
			target[id] = {};

		return target[id];
	}, data);

	console.log(path, key, value);
	target[key] = value;
	save(data);
}

function remove(path) {
	var data = load();
	var key = path.pop();

	var target = path.reduce(function(target, id) {
		return target && target[id];
	}, data);

	if (target)
		delete target[key];

	save(data);
}

exports.get = get;
exports.set = set;
exports.remove = remove;
