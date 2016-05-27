// "use strict";
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var pg = require('pg');
var PORT = 3000;
var conString = process.env.ELEPHANTSQL_URL;
var userString = process.env.ELEPHANTSQL_URL_USER;
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

app.post('/newUserInfo', function(req, res) {
  var user = req.body;
  pg.connect(userString, function(err, client, done) {
    if(err) {
      return console.log('error fetching client from pool', err);
    }
    client.query("CREATE TABLE IF NOT EXISTS allUsers (firstName varchar(64), lastName varchar(64), email varchar(64), userName varchar(64), password varchar(64))");
    client.query("INSERT INTO allUsers(firstName, lastName, email, userName, password) values($1, $2, $3, $4, $5)", [user.firstName, user.lastName, user.email, user.userName, user.password]);
    done();
  });
  res.send('created');
});

app.post('/userLocation', function(req, res) {
  var userInfo = req.body.userper;
  // console.log(userInfo);
  // client.connect(function(err, client, done) {
  //   if(err) {
  //     return console.error('could not connect to postgres', err);
  //   }
  pg.connect(conString, function(err, client, done) {
  if(err) {
    return console.log('error fetching client from pool', err);
  }
    client.query("CREATE TABLE IF NOT EXISTS "+ userInfo.group +"(name varchar(64), lat varchar(64), long varchar(64))");
    client.query("INSERT INTO "+userInfo.group+"(name, lat, long) values($1, $2, $3)", [userInfo.name, userInfo.lat, userInfo.long]);
    done();
    list_records();
  });

  var list_records = function(req, res) {
    console.log("In listing records");
    // Select all rows in the table
    console.log(userInfo.group);
    pg.connect(conString, function(err, client, done) {
    if(err) {
      return console.log('error fetching client from pool', err);
    }
      var query = client.query("SELECT name, lat, long FROM "+ userInfo.group +" ORDER BY name, lat, long");
      query.on("row", function (row, result) {
      result.addRow(row);
      });
      query.on("end", function (result) {
        allUsers = JSON.stringify(result.rows, null, "    ");
        console.log(allUsers);
        done();
      // client.end();
      });
    });
  };
  // console.log(userInfo);
  res.send(allUsers);

});

app.post('/updateUser', function(req, res) {
  var info = req.body.update;
  console.log('update '+ info.name+ ' on '+ info.group);

  var update_record = function(req, res) {
    console.log("UPDATE "+info.group+" SET lat= '" + info.lat +"', long= '"+ info.long +"' WHERE name= '"+info.name+"';");
    pg.connect(conString, function(err, client, done) {
    if(err) {
      return console.log('error fetching client from pool', err);
    }
      var query = client.query("UPDATE "+info.group+" SET lat= '" + info.lat +"', long= '"+ info.long +"' WHERE name= '"+info.name+"';");
      done();
    });
  };

  var list_records = function(req, res) {
    console.log("In listing records");
    // Select all rows in the table
    pg.connect(conString, function(err, client, done) {
    if(err) {
      return console.log('error fetching client from pool', err);
    }
      var query = client.query("SELECT * FROM "+info.group);
      query.on("row", function (row, result) {
      result.addRow(row);
      });
      query.on("end", function (result) {
        allUsers = JSON.stringify(result.rows, null, "    ");
        console.log(allUsers);
        // client.end();
        done();
      });
    });
  };

  // client.connect(function(err) {
  //   if(err) {
  //     return console.error('could not connect to postgres', err);
  //   }
    update_record();
    list_records();
  // });
  res.send(allUsers);
});



app.listen(PORT, function(){
  console.log('listen on port:'+ PORT);
  console.log('server running');
});
