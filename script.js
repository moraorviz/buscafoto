let map;
let marker;
let markerImagen = {};
let circulos = [];
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
areaJuego.info = document.querySelector('.info');

function handleBtn(e) {
    if (e.target.classList.contains("comenzar")) {
        comenzarJuego();
    } else if (e.target.classList.contains("confirmar")) {
        confirmar();
    } else {
        siguiente();
    }
}

function updateInfo(distancia, puntuacion) {
    areaJuego.info.innerHTML = "La distancia entre los puntos es: " + distancia
        + "<br>" + "La puntuación total es: " + player.score + "<br>" +
        "Este turno has puntuado: " + puntuacion;
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
    let detallesObjetivo = data.data[player.turno];
    let posicionEleccion = marker.getPosition();
    let latitudObjetivo = detallesObjetivo.latitud;
    let latitudEleccion = posicionEleccion.lat();
    let longitudObjetivo = detallesObjetivo.longitud;
    let longitudEleccion = posicionEleccion.lng();
    let distancia = getDistanceFromLatLonInKm(latitudObjetivo, longitudObjetivo, 
        latitudEleccion, longitudEleccion);

    let colores = ["AFEEEE", "FFFFEO", "DDA0DD", "C39B3"];
    let radios = [1000, 5000, 10000, 20000]
    let circulo;
    for (i = 0; i < 4; i++) {
        circulo = new google.maps.Circle({
            fillColor: colores[i],
            fillOpacity: 0.35,
            map: map,
            center: new google.maps.LatLng(latitudObjetivo, longitudObjetivo), 
            radius: radios[i] 
        });
        circulos.push(circulo);
    }

    let puntuacion;
    if (distancia < 1) {
        player.score += 10;
        puntuacion = 10
    } else if (distancia < 5) {
        console.log(distancia);
        player.score += 5;
        puntuacion = 5;
    } else if (5 < distancia && distancia < 10) {
        player.score += 3
        puntuacion = 3;
    } else if (10 < distancia && distancia < 20) {
        player.score += 1;
        puntuacion = 1;
    }  else {
        puntuacion = 0;
    }

    updateInfo(distancia, puntuacion);
}

function siguiente() {
    console.log(circulos);
    console.log("Siguiente");
    if (marker && markerImagen != null) {
        marker.setMap(null);
        markerImagen.setMap(null);
    }

    circulos.forEach(function (circulo) {
        circulo.setMap(null);
    })

    player.turno += 1;
    console.log(player.turno);
    startImagen(player.turno);
}

function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}