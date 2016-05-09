var userName;
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
      console.log('sorry please enable location for app');
    }
}
function showPosition(position) {
  var userlat = position.coords.latitude;
  var userlong =position.coords.longitude;
  var userInfo = {
    'name': userName,
    'lat': userlat,
    'long': userlong
  };
  $('#submitName').hide();
  $('#submitName').hide();
  $('.usersLocation').append('<h2 id="'+userName+'"><span class="name">'+userName+'</span><span class="location">'+' lat: '+ userlat+' long: '+userlong+'</span></h2>');

  console.log(userInfo);
  $.post('/userLocation', {userper: userInfo}, function(data) {
  }).done(function(data) {
    console.log(data);
  });
}


$('#submitName').hide();

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
  getLocation();
  userName = $('#nameInput').val();
});
