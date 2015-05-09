var express = require('express'),
	app = express();



app.set('views', 'src/templates');
app.use(express.static('./'));


app.get('/', function(req, res){
	res.render('index.jade', {title: 'juicySlider'});
});


var server = app.listen(3337, function(){
	var host = server.address().address;
	var port = server.address().port
	console.log('Example app listening at http://%s:%s', host, port);
});