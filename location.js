var userName;
var groupName;
var userInfo;

function sendUserInfo() {
  $('#submitName').hide();
  $('#nameInput').hide();
  console.log(userInfo);
  $.post('/userLocation', {userper: userInfo}, function(data) {
  }).done(function(data) {
    console.log(data);
    setInterval(getLocation, 1000)
    setInterval(updateLocation, 2000);
  });
}

function updateLocation() {
  $.post('/updateUser', {update: userInfo}, function(data) {
  }).done(function(data) {
    console.log(data);
  });
}

function getLocation(callback) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
      console.log('sorry please enable location for app');
    }
}

getLocation();
function showPosition(position,callback) {
  var userlat = position.coords.latitude;
  var userlong =position.coords.longitude;
  userInfo = {
    'name': userName,
    'group': groupName,
    'lat': userlat,
    'long': userlong
  };
  console.log(userInfo);
  console.log(userlat);
}

$('#submitGroup').hide();
$('#submitName').hide();
$('#nameInput').hide();

$('#groupName').on('keyup', function(event) {
  event.preventDefault();
  while (this.value.length > 0) {
    $('#submitGroup').show();
    return;
  }
  while (this.value.length ===0) {
    $('#submitGroup').hide();
    return;
  }
});


$('#submitGroup').on('click', function(event) {
  event.preventDefault();
  groupName = $('#groupName').val();
  $('#groupNameHeader').text(groupName);
  $('#submitGroup').hide();
  $('#groupName').hide();
  $('#nameInput').show();
});


$('#nameInput').on('keyup', function(event) {
  event.preventDefault();
  while (this.value.length > 0) {
    $('#submitName').show();
    return;
  }
  while (this.value.length ===0) {
    $('#submitName').hide();
    return;
  }
});


$('#submitName').on('click', function(event) {
  event.preventDefault();
  userName = $('#nameInput').val();
  userInfo.name = userName;
  userInfo.group = groupName;
  sendUserInfo();
});
