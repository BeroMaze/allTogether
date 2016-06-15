var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var pg = require('pg');
var PORT = process.env.PORT;
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
    client.query("CREATE TABLE IF NOT EXISTS allUsers (firstName varchar(64), lastName varchar(64), email varchar(64), userName varchar(64), password varchar(64), groups varchar(10000))");
    client.query("INSERT INTO allUsers(firstName, lastName, email, userName, password, groups) values($1, $2, $3, $4, $5, $6)", [user.firstName, user.lastName, user.email, user.userName, user.password, user.groups]);
    done();
  });
  res.send('created');
});
app.post('/loginTime', function(req, res) {
  var userEmail = req.body.email;
  var userpassword = req.body.password;

  pg.connect(userString, function(err, client, done) {
  if(err) {
    return console.log('error fetching client from pool', err);
  }
    var query = client.query("SELECT * FROM allusers WHERE email='"+userEmail+"'");
    query.on("row", function (row, result) {
    result.addRow(row);
    });
    query.on("end", function (result) {
      var userInfo = result.rows[0];
      // console.log(userInfo);
      if (userpassword === userInfo.password) {
        var user = {
          firstname: userInfo.firstname,
          lastname: userInfo.lastname,
          email: userInfo.email,
          username: userInfo.username,
          groups: userInfo.groups
        };
        // console.log(user);
        done();
        res.send(user);
      }
      else {
        done();
        res.send('incorrect');
      }

    // client.end();
    });
  });
});

app.post('/sendGroupMembers', function(req, res) {
  var group = req.body.groupName;
  console.log('new Group Created: '+ group);
  var allMembers = req.body.allMembers;

  pg.connect(userString, function(err, client, done) {
  if(err) {
    return console.log('error fetching client from pool', err);
  }
    allMembers.forEach(function(each) {
      var updatedGroups;
      var query = client.query("SELECT groups FROM allusers WHERE email='"+each+"'");
      query.on("row", function (row, result) {
      result.addRow(row);
      });
      query.on("end", function (result) {
        var groupString = result.rows[0].groups;
        console.log(groupString);
        updatedGroups = groupString + ','+ group;
        console.log('updated To: '+updatedGroups);
        // updatedGroups = groupString.split(',');
        // console.log("array of groups: "+ updatedGroups);
        // updatedGroups.push(group);
        // console.log("updated group array: "+ updatedGroups);
        // var updatedGroupsString = updatedGroups.toString();
        // console.log('string Version of updatedGroupsString: '+updatedGroups);
        var query = client.query("UPDATE allusers SET groups= '" + updatedGroups +"' WHERE email= '"+each+"';");
        done();
      });
    });
  });

});

app.post('/userLocation', function(req, res) {
  var userInfo = req.body.userper;
  console.log(userInfo.group);
  console.log(userInfo.name);
  console.log(userInfo.userlat);
  console.log(userInfo.userlong);
  pg.connect(conString, function(err, client, done) {
  if(err) {
    return console.log('error fetching client from pool', err);
  }
  console.log('newGroup Being created');
    client.query("CREATE TABLE IF NOT EXISTS "+ userInfo.group +"(name varchar(64), lat varchar(64), long varchar(64))");
    client.query("INSERT INTO "+userInfo.group+"(name, lat, long) values($1, $2, $3)", [userInfo.name, userInfo.userlat, userInfo.userlong]);
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
    console.log("UPDATE "+info.group+" SET lat= '" + info.userlat +"', long= '"+ info.userlong +"' WHERE name= '"+info.name+"';");
    pg.connect(conString, function(err, client, done) {
    if(err) {
      return console.log('error fetching client from pool', err);
    }
      var query = client.query("UPDATE "+info.group+" SET lat= '" + info.userlat +"', long= '"+ info.userlong +"' WHERE name= '"+info.name+"';");
      console.log('updating Done');
      done();
    });
  };

  var list_records = function(req, res) {
    console.log("In listing records 2");
    console.log(info.group+ ' (groupName)');
    // Select all rows in the table
    pg.connect(conString, function(err, client, done) {
    if(err) {
      console.log('if error running');
      return console.log('error fetching client from pool', err);
    }
    console.log(info.group+ ' (rechecking Group Name)');
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
    update_record();
    list_records();
  res.send(allUsers);
});



app.listen(PORT, function(){
  console.log('listen on port:'+ PORT);
  console.log('server running');
});
