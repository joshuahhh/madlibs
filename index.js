/////////////////////////////
////    server side     ////
///////////////////////////

// dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var request = require('request');
var bodyParser = require('body-parser');
var fbStuff = require('./fbStuff');
var madlibify = require('./madlibify');
var app = express();

// nasty server state
var cookies = undefined;
// var fbPostData = undefined;
var scrapedBits = undefined;

// all environments
app.set('port', process.env.PORT || 3000);
app.use(express.static(path.join(__dirname, 'public')));
app.use( bodyParser.json() );

// first route
app.get('/', function(req, res) {res.render('index')});

app.post('/cookies', function(req, res) {
  console.log('got post to cookies!', req.body);
  cookies = req.body;
  fbStuff.turnCookiesIntoScrapedBits(cookies, function (incomingScrapedBits) {
    scrapedBits = incomingScrapedBits;
  });
  res.send('sweet!');
});

// second route - this happens On Document Ready
app.get('/searching', function(req, res){
	var string =  "{noun} shopping, registry scanning and Michael's for {adjective} projects! Yup, we're getting {past participle}! ‪{hashtag}‬ ‪#‎shitisgettingreal‬ {emoji}";
	var pos = ['noun','adjective','past participle'];
	res.send([pos,string]); //returns [POS, phrase]
});

app.get('/fbPostData', function(req, res){
  if (!scrapedBits) {
    res.type('json');
  	res.send(undefined);
  } else {
    var toReturn, numBraces = 0;
    while (numBraces < 5) {
      toReturn = scrapedBits[Math.floor(Math.random() * scrapedBits.length)];
      // toReturn.madlib = "{emoji} his {noun}"; //madlibify.madlibify(toReturn.text);
      toReturn.madlib = madlibify.madlibify(toReturn.text);
      numBraces = ((toReturn.madlib.match(/{/g) || []).length);
    }
    res.type('json');
  	res.send(toReturn);
  }
});

app.get('/fb', function(req,res){
	res.send('index');
})

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
