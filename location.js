var userName;
var groupName;
var userInfo;
var markers = [];
var allMembers = [];
firstTime = true;

function sendUserInfo() {
  $('#submitName').hide();
  $('#nameInput').hide();
  $.post('/userLocation', {userper: userInfo}, function(data) {
  }).done(function(data) {
    console.log(data);
    initialize();
    setInterval(getLocation, 1000);
    setInterval(updateLocation, 5000);
  });
}

function updateLocation() {
  $.post('/updateUser', {update: userInfo}, function(data) {
  }).done(function(data) {
    // console.log(data);
    var usersInfoArray = JSON.parse(data);
    console.log(userInfo);
    console.log(usersInfoArray);
    console.log(markers);
    function deleteMarkers() {
      google.maps.Map.prototype.clearOverlays = function() {
      for (var i = 0; i < markers.length; i++ ) {
        markers[i].setMap(null);
      }
      markers.length = 0;
    }
    google.maps.Map.prototype.clearOverlays();
        console.log(markers);
      }
      deleteMarkers();
      movemarker(usersInfoArray);
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
}

$('#submitGroup').hide();
$('#submitName').hide();
$('#createGroup').hide();
$('#groupTime').hide();
$('#groupMates').hide();
$('.groupTimeLabel').hide();
$('.groupMatesLabel').hide();
$('#submitMate').hide();

$('#groupName').on('keyup', function(event) {
  event.preventDefault();
  while (this.value.length > 0) {
    // $('#submitGroup').show();
    $('#groupTime').show();
    $('#groupMates').show();
    $('.groupTimeLabel').show();
    $('.groupMatesLabel').show();
    return;
  }
  while (this.value.length ===0) {
    $('#groupTime').hide();
    $('#groupMates').hide();
    $('.groupTimeLabel').hide();
    $('.groupMatesLabel').hide();
    $('#submitGroup').hide();
    return;
  }
});

$('#groupMates').on('keyup', function(event) {
  event.preventDefault();
  var matesEmail = this.value;
  if (document.getElementById("groupMates").checkValidity()) {
    console.log('email');
    $('#submitMate').show();
  }
  else{
    $('#submitMate').hide();
  }
});

$('#submitMate').on('click', function(event) {
  event.preventDefault();
  var memberEmail = $('#groupMates').val();
  $('#members').append(memberEmail+'<br>');
  allMembers.push(memberEmail);
  $('#groupMates').val('');
  $('#submitGroup').show();
});

$('#submitGroup').on('click', function(event) {
  event.preventDefault();
  groupName = $('#groupName').val();
  $('#groupNameHeader').text(groupName);
  allMembers.forEach(function(each) {
    $('#allGroupMembers').append(each+' <br>');
  });
  // $('#submitGroup').hide();
  // $('#groupName').hide();
  $('#createGroup').hide();
  // $('#nameInput').show();
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
