// "use strict";
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var pg = require('pg');
var PORT = 3000;
var conString = process.env.ELEPHANTSQL_URL;
var allUsers;


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.static('./'));
app.use(bodyParser());

app.get('*', function(request, response) {
  // console.log('New request:', request.url);
  response.sendFile('index.html', { root: '.' });
});

app.post('/userLocation', function(req, res) {
  var userInfo = req.body.userper;
  // console.log(userInfo);
  var client = new pg.Client(conString);
  client.connect(function(err) {
    if(err) {
      return console.error('could not connect to postgres', err);
    }
  client.query("CREATE TABLE IF NOT EXISTS "+ userInfo.group +"(name varchar(64), lat varchar(64), long varchar(64))");
  client.query("INSERT INTO "+userInfo.group+"(name, lat, long) values($1, $2, $3)", [userInfo.name, userInfo.lat, userInfo.long]);
  list_records();
  });

  var list_records = function(req, res) {
    console.log("In listing records");
    // Select all rows in the table
    console.log(userInfo.group);
    var query = client.query("SELECT name, lat, long FROM "+ userInfo.group +" ORDER BY name, lat, long");
    query.on("row", function (row, result) {
    result.addRow(row);
    });
    query.on("end", function (result) {
      allUsers = JSON.stringify(result.rows, null, "    ");
      console.log(allUsers);
    });
  };
  // console.log(userInfo);
  res.send(allUsers);

});

app.post('/updateUser', function(req, res) {
  var info = req.body.update;
  // console.log('update '+ info.name+ ' on '+ info.group);
  var update_record = function(req, res) {
  var client = new pg.Client(conString);
  query = client.query("UPDATE" +info.group+ " set lat = "+ info.lat +" AND long = "+ info.long +" WHERE name= "+info.name);
  };
  var list_records = function(req, res) {
    console.log("In listing records");
    // Select all rows in the table
    var client = new pg.Client(conString);
    var query = client.query("SELECT name, lat, long FROM "+info.group+"ORDER BY name, lat, long");
    query.on("row", function (row, result) {
    result.addRow(row);
    });
    query.on("end", function (result) {
      allUsers = JSON.stringify(result.rows, null, "    ");
      console.log(allUsers);
    });
  };

  update_record();
  list_records();
  res.send(allUsers);
});



app.listen(PORT, function(){
  console.log('listen on port:'+ PORT);
  console.log('server running');
});
