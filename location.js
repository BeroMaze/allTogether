function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
      console.log('sorry please enable location for app');
    }
}
function showPosition(position) {
    console.log('lat: '+ position.coords.latitude+'long: '+position.coords.longitude);
}
