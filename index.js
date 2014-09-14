var unzip = require('unzip'),
	http = require('http'),
	Q = require('q'),	
	fs = require('fs');

function ValConnector() {
}

ValConnector.prototype.get = function() {
	var dfd = Q.defer();
	var file = fs.createWriteStream('result.zip');
	
	http.get('http://www.val.se/val/val2014/valnatt/valnatt.zip', function(res) {
		res.pipe(file);
		file.on('finish', dfd.resolve);
	});

	return dfd.promise;
};


ValConnector.prototype.run = function() {
	console.log('Fetching...');
	var promise = this.get();
	promise.then(function() {
		console.log('Unzip...');
		fs.createReadStream('result.zip')
	  	.pipe(unzip.Extract({ path: 'results' }));
	}).catch(function(err) {
		console.error('Failed', err);
	});
};

var connector = new ValConnector(),
	twominutes = 2 * 60 * 1000;

setInterval(function() {
	connector.run();
}, twominutes);

connector.run();
