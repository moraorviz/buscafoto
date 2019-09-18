let map;
let marker;
let markerImagen = {};
const player = {};
const areaJuego = {};
const data = {"data": [
    {"id": 1, "imagen": "img/catedraloviedo.jpg", "latitud": 43.362583, "longitud": -5.843081, "descripcion": "Catedral de Oviedo"},
    {"id": 2, "imagen": "img/basilicacovadonga.jpg", "latitud": 43.3086, "longitud": -5.05361, "descripcion": "Basílica de Covadonga"},
    {"id": 3, "imagen": "img/santacristinalena.jpg", "latitud": 43.127333, "longitud": -5.814306, "descripcion": "Santa Cristina de Lena"}
]};

areaJuego.mapa = document.querySelector('.mapa');
areaJuego.imagen = document.querySelector('.imagen');
areaJuego.botones = Array.from(document.querySelectorAll('.boton'));
areaJuego.botones.forEach(function (item) {
    item.addEventListener('click', handleBtn);
});

function handleBtn(e) {
    if (e.target.classList.contains("comenzar")) {
        comenzarJuego();
    } else if (e.target.classList.contains("confirmar")) {
        confirmar();
    } else {
        siguiente();
    }
}

function comenzarJuego() {
    console.log("Comienza el juego");
    player.score = 0;
    player.turno = 0;
    console.log("Comienza el turno " + player.turno);
    startImagen(player.turno);
}

function startImagen(i) {
    console.log("Starting image...");
    let img = document.createElement("img");
    img.src = data.data[i].imagen;
    let imagenActual = areaJuego.imagen.firstChild;
    if (imagenActual != null) {
        areaJuego.imagen.removeChild(imagenActual);
    }
    areaJuego.imagen.appendChild(img);
    areaJuego.botones[2].setAttribute("class", "invisible");
    añadirMarcadorImagen(i);
}

function añadirMarcadorImagen(i) {
    let location = new google.maps.LatLng(data.data[i].latitud, data.data[i].longitud);
    console.log(location.toString());
    markerImagen = new google.maps.Marker({
        position: location,
        map: map,
        visible: false
    });
    console.log("Añadido marcador para " + data.data[i].descripcion);
}

function initMap() {
    let OVIEDO = new google.maps.LatLng(43.3625, -5.850278);
    let ASTURIAS_BOUNDS = {
        north: 43.67,
        south: 42.83,
        east: -4.44,
        west: -7.22
    };
    map = new google.maps.Map(areaJuego.mapa, {
        center: OVIEDO,
        restriction: {
            latLngBounds: ASTURIAS_BOUNDS,
            strictBounds: false
        },
        zoom: 7, 
        mapTypeId: 'satellite',
        disableDefaultUI: true
    });
    google.maps.event.addListener(map, 'click', function(event) {
        añadirMarcador(event.latLng, map);
    });
}

function añadirMarcador(location, map) {

    if (marker != null) {
        marker.setMap(null);
    }

    marker = new google.maps.Marker({
    position: location,
    map: map
  });

  console.log(location.toString());
}

function confirmar() {
    console.log("Confirmado");
    markerImagen.setOptions({visible: true});
}

function siguiente() {
    console.log("Siguiente");
    if (marker && markerImagen != null) {
        marker.setMap(null);
        markerImagen.setMap(null);
    }

    player.turno += 1;
    console.log(player.turno);
    startImagen(player.turno);
}

console.log(areaJuego.botones)