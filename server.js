var express = require('express'),
	app = express();



app.set('views', 'src/templates');
app.use(express.static('./src/'));


app.get('/', function(req, res){
	res.render('index.jade', {title: 'juicySlider'});
});

app.get('/carousel', function(req, res){
	res.render('carousel.jade', {title: 'juicySlider - carousel'});
});

var server = app.listen(3337, function(){
	var host = server.address().address;
	var port = server.address().port
	console.log('Example app listening at http://%s:%s', host, port);
});