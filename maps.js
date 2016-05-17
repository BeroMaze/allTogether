function movemarker(usersInfoArray){
  console.log(usersInfoArray);
  for (var i = 0; i < usersInfoArray.length; i++) {
    var user = usersInfoArray[i];
    var userName = user.name;
    var userLat = Number(user.lat);
    var userLong = Number(user.long);
      latv = parseFloat(userLat);
      lonv = parseFloat(userLong);

      myLatlng = new google.maps.LatLng(latv,lonv);
      var fld = document.getElementById('before_map');
      fld.innerText = ' ' + 'lat:' + latv + ', lon: ' + lonv + ' ' + myLatlng.toString();
      // var image = {
      //   url:'http://files.softicons.com/download/game-icons/super-mario-icons-by-sandro-pereira/ico/Mushroom%20-%201UP.ico',
      //   size: new google.maps.Size(200, 150)
      // };
      var marker = new google.maps.Marker(
      {
        position: myLatlng,
        map: map,
        // icon: image,
        label: userName,
        title:userName
      });
      markers.push(marker);
      marker.setPosition(myLatlng);
    }
  }

function initialize(){
    myLatlng = new google.maps.LatLng(userInfo.lat,userInfo.long);
    mapOptions =
    {
      center: myLatlng,
      zoom: 18,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("map"),
      mapOptions);

    // var image = {
    //   url:'http://files.softicons.com/download/game-icons/super-mario-icons-by-sandro-pereira/ico/Mushroom%20-%201UP.ico',
    //   size: new google.maps.Size(20, 32)
    // };

    marker = new google.maps.Marker(
    {
      position: myLatlng,
      map: map,
      // icon: image,
      label: userInfo.name,
      title:userInfo.name
    });
    markers.push(marker);
  }
