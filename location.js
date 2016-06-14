var userName;
var groupName;
var groupNamePicked;
var userInfo = {
};
var markers = [];
var allMembers = [];
firstTime = true;

$(window).resize(function() {
  windowSize();
});

function windowSize() {
    var width = $(window).width();
    var height = $(window).height();
    $('#createGroup').css('width', width);
    $('#createGroup').css('height', height * '0.81');
    $('#NewGroupMembers').css('width', width);
    $('#NewGroupMembers').css('height', height * '0.81');
    $('#userLogin').css('width', width);
    $('#userLogin').css('height', height * '0.81');
    $('#signUp').css('width', width);
    $('#signUp').css('height', height * '0.81');
  };
windowSize();


function sendUserInfo() {
  $('#submitName').hide();
  $('#nameInput').hide();
  $('#map').show();
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
    };
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

function showPosition(position,callback) {
  var userlat = position.coords.latitude;
  var userlong =position.coords.longitude;
  var group = groupNamePicked;
  var name = userName;
  userInfo = {
    name:name,
    group:group,
    userlat:userlat,
    userlong:userlong
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
$('#signUp').hide();
$('#map').hide();
$('#NewGroupMembers').hide();
$('#submitMate').hide();

$('#groupName').on('keyup', function(event) {
  while (this.value.length > 0) {
    // $('#submitGroup').show();
    $('#groupTime').show();
    $('#groupMates').show();
    $('.groupTimeLabel').show();
    $('.groupMatesLabel').show();
    $('#submitMate').show();

    return;
  }
  while (this.value.length ===0) {
    $('#groupTime').hide();
    $('#groupMates').hide();
    $('.groupTimeLabel').hide();
    $('.groupMatesLabel').hide();
    $('#submitGroup').hide();
    $('#submitMate').hide();
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
  $('#NewGroupMembers').show();
  $('#groupNameHeader').text(groupName);
  allMembers.forEach(function(each) {
    $('#allGroupMembers').append(each+' <br>');
  });
  $('#createGroup').hide();
  $.post('/sendGroupMembers',
  { groupName: groupName,
    allMembers: allMembers
  }, function(data) {
  });
});

$('#login').on('click', function(event) {
  event.preventDefault();

  if ($('#userPasswordInput').val().length > 1) {
    $.post('/loginTime', {
      email: $('#userEmailInput').val().toLowerCase(),
      password: window.btoa(window.btoa($('#userPasswordInput').val()))
    }, function(data) {
    }).done(function(data) {
      if (data === 'incorrect') {
        alert('Login Incorrect. Please try logging in again.');
      }
      else{
        $('#userLogin').hide();
        $('#createGroup').show();
        $('body').css('background-image', 'url("http://dlrprepschool.com/wp-content/uploads/2015/05/industry-groups-product-groups.jpg")');
        $('body').css('background-repeat', 'repeat');
        $('body').css('background-size', '40%');
        $('#userNameHeader').text(data.username);
        getLocation();
        userName = data.username;
        if (data.groups !== null) {
          console.log(data.groups);
          var groups = data.groups.split(',');
          console.log(groups);
          groups.forEach(function(each) {
            $('#usersGroups').append('<p class="usersGroup">'+each+'</p>');
          });
        }
        else{
          $('#usersGroups').append('<p>You currently are not part of any groups.</p>');
        }
        pickGroup();
      }
    });
  }
  else{
    alert('Password incorrect!!');
  }
});

function pickGroup() {
  $('.usersGroup').on('click', function(event) {
    event.preventDefault();
    groupNamePicked = $(this).text();
    userInfo.group = groupNamePicked;
    $('#createGroup').hide();
    sendUserInfo();

    // $.post('/toGroup', {group: groupPicked}, function(data) {
    // }).done(function(data) {
    //
    // });
  });
}


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

$('#newUser').on('click', function(event) {
  event.preventDefault();
  $('#userLogin').hide();
  $('#signUp').show();
  $('#newUserSubmit').on('click', function(event) {
    event.preventDefault();
    if(($('#firstNameNew').val().length>2)&&($('#lastNameNew').val().length>2)&&(document.getElementById("userEmail").checkValidity())&& ($('#userNameNew').val().length>3)&&($('#passwordNew').val().length>3)&&($('#passwordRe-enter').val().length>3)) {
      if ($('#passwordNew').val()===$('#passwordRe-enter').val()) {
        $.post('/newUserInfo', {
          firstName:  $('#firstNameNew').val(),
          lastName: $('#lastNameNew').val(),
          email: $('#userEmail').val().toLowerCase(),
          userName: $('#userNameNew').val(),
          password: window.btoa(window.btoa($('#passwordNew').val()))
        }, function(data) {
        }).done(function(data) {
          console.log(data);
          $('#signUp').hide();
          $('#userLogin').show();
        });
      }
      else {
        alert('Passwords do not match. Please Try again.');
      }
    }
    else {
      alert('Please fill out all boxes.');
    }
  });
});


$('#submitName').on('click', function(event) {
  event.preventDefault();
  userName = $('#nameInput').val();
  userInfo.name = userName;
  userInfo.group = groupName;
  sendUserInfo();
});

$('#toGroups').on('click', function(event) {
  event.preventDefault();
  $('#NewGroupMembers').hide();
  $('#createGroup').show();
  $('#groupName').val('');
  $('#groupTime').val('');
  $('#groupMates').val('');
  $('#members').empty(  );

});
