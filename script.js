var map;
function initMap() {
    var OVIEDO = new google.maps.LatLng(43.3625, -5.850278);
    var ASTURIAS_BOUNDS = {
        north: 43.67,
        south: 42.83,
        east: -4.44,
        west: -7.22
    };
    map = new google.maps.Map(document.getElementById('mapa'), {
        center: OVIEDO,
        restriction: {
            latLngBounds: ASTURIAS_BOUNDS,
            strictBounds: false
        },
        zoom: 7, 
        mapTypeId: 'satellite',
        disableDefaultUI: true
    });
};