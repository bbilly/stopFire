/**
 * Created by Baptiste on 25/04/2015.
 */

L.mapbox.accessToken = "pk.eyJ1IjoiYmJpbGx5IiwiYSI6ImtFbzVWVUkifQ.2-mF8GZ1nfQWOxpICSOABA";
var url = 'https://{s}.tiles.mapbox.com/v4/bbilly.416c4e7a/{z}/{x}/{y}.png?access_token=';
var mapboxTiles = L.tileLayer(url + L.mapbox.accessToken, {
    attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>'
});



//gestion du champ de recherche
$("#rechercher").on("keydown",function search(e) {
    if(e.keyCode == 13) {
        $("#validRecherche").click();
    }
});

$("#validRecherche").on("click", function () {
    $("#loader").show();
    var geocoder = L.mapbox.geocoder('mapbox.places');
    geocoder.query($("#rechercher").val(), showMap);
    function showMap(err,data) {
 	$("#loader").hide();
        if (data.latlng) {
            map.setView([data.latlng[0], data.latlng[1]], 17);
        }
    }
});

var map = L.map('map')
    .addLayer(mapboxTiles)
    .setView([47.466667, -0.55], 16);

var markers = new Array();
map.on('moveend', onMapMove);
function onMapMove(e) {
    if(map.getZoom() >= 16) {
        $(".error").hide();
        populate();
    }
    else {
        $(".error").show();
        removeMarkers()
    }
}

function populate() {
    removeMarkers();
    var bounds = map.getBounds();
    var minll = bounds.getSouthWest();
    var maxll = bounds.getNorthEast();
    getBornes(minll.lat, maxll.lat, minll.lng, maxll.lng);
}

function getBornes(lat_min,lat_max,long_min,long_max) {
    $.ajax({
        method: "POST",
        url: "getBornes.php",
        data: {
            lat_min: lat_min,
            lat_max: lat_max,
            long_min : long_min,
            long_max : long_max
        },
        dataType : "json"
    }).done(function( bornes ) {
        for (i in bornes) {
            var lat_borne = bornes[i].geometry.coordinates[1];
            var long_borne = bornes[i].geometry.coordinates[0];
            var marker = L.marker([lat_borne, long_borne]).addTo(map);
            marker.bindPopup(bornes[i].properties.ADRESSE +"<br/>" + "<b>Débit : </b>"+bornes[i].properties.DEBIT+" m3/h",{showOnMouseOver : true});
            markers.push(marker);
            map.addLayer(markers[i]);
        }
    });
}

function removeMarkers() {
    for(i=0;i<markers.length;i++) {
        map.removeLayer(markers[i]);
    }
}

populate();
