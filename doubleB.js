/**
 * Created by Baptiste on 25/04/2015.
 */

L.mapbox.accessToken = "pk.eyJ1IjoiYmJpbGx5IiwiYSI6ImtFbzVWVUkifQ.2-mF8GZ1nfQWOxpICSOABA";
var url = 'https://{s}.tiles.mapbox.com/v4/bbilly.416c4e7a/{z}/{x}/{y}.png?access_token=';
var mapboxTiles = L.tileLayer(url + L.mapbox.accessToken, {
    attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>'
});

var map = L.map('map')
    .addLayer(mapboxTiles)
    .setView([47.466667, -0.55], 16);

 var markers = new L.MarkerClusterGroup();

$.ajax({
dataType: "json",
url: "bornes_incendies_angers.json",
success: function(data) {
    $(data.features).each(function(key, data) {
      var marker = L.marker(new L.LatLng(data.geometry.coordinates[1], data.geometry.coordinates[0]), {
          icon: L.mapbox.marker.icon({'marker-symbol': 'water', 'marker-color': 'c0392b'})
      });
      marker.bindPopup(data.properties.ADRESSE +"<br/>" + "<b>Débit : </b>"+data.properties.DEBIT+" m3/h",{showOnMouseOver : true});
      markers.addLayer(marker);
    });
}
}).error(function() {});

map.addLayer(markers);

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

// gestion de la géoloc
var lc = L.control.locate().addTo(map);
// request location update and set location
lc.start();
