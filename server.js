var express = require('express'),
	xml2js = require('xml2js'),
	fs = require('fs'),
	app = express();

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname);
app.use('/static', express.static(__dirname + '/static'));


app.get('/', function(req, res) {
	var parser = new xml2js.Parser();	
	fs.readFile('results/valnatt_00R.xml', function(err, data) {
		if (err) throw err;
	   	parser.parseString(data, function (err, result) {
	   	    res.render('index.html', { 
	   	    	results: result.VAL.NATION[0].GILTIGA,
	   	    	time: result.VAL['$'].TID_RAPPORT
	   	    });
	   	});
	});
});

var port = process.env.PORT || 8080;
app.listen(port, function() {
 console.log('Listening on', port);
});