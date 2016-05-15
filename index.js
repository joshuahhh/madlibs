/////////////////////////////
////    server side     ////
///////////////////////////

// dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var request = require('request');
var bodyparser = require('body-parser');
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.use(express.static(path.join(__dirname, 'public')));

// first route
app.get('/', function(req, res) {res.render('index')});

// second route - this happens On Document Ready
app.get('/searching', function(req, res){
	var string =  "{noun} shopping, registry scanning and Michael's for {adjective} projects! Yup, we're getting {past participle}! ‪{hashtag}‬ ‪#‎shitisgettingreal‬ {emoji}";
	var pos = ['noun','adjective','past participle'];
	res.send([pos,string]); //returns [POS, phrase]
});


app.get('/fb', function(req,res){
	res.send('index');
})

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
