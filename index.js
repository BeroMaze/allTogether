// "use strict";
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var PORT = 3000;

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.static('./'));
app.use(bodyParser());

app.get('*', function(request, response) {
  console.log('New request:', request.url);
  response.sendFile('index.html', { root: '.' });
});

app.post('/userLocation', function(req, res) {
  var userInfo = req.body.userper;
  console.log(userInfo);
  res.send('send');
});


app.listen(PORT, function(){
  console.log('listen on port:'+ PORT);
  console.log('server running');
});
