// "use strict";
var express = require('express');
var app = express();
// var bodyParser = require('body-parser');
var PORT = 3000;

app.listen(PORT, function(){
  console.log('listen on port:'+ PORT);
  console.log('server running');
});
