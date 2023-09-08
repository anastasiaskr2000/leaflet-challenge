// Creating the map object
let myMap = L.map("map", {
    center: [40.7128, -74.0059],
    zoom: 2
});

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Use this link to get the GeoJSON data.
let link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Getting our GeoJSON data
d3.json(link).then(function (data) {

    //style info (radius, colour)
    function styleinfo(x) {
        console.log(x.geometry.coordinates)

        return {
            radius: chooseRadius(x.properties.mag),
            fillColor: chooseColor(x.geometry.coordinates[2]),
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 1,
            stroke: 0.4
        }
    }


    //get radius function
    function chooseColor(depth) {
        if (depth > 90) {
            return "#f53939"
        } else if (depth > 70) {
            return "#ff7a00 "
        } else if (depth > 50) {
            return '#ffad4b'
        } else if (depth > 30) {
            return '#fff74b'
        } else if (depth > 10) {
            return '#92ff4b'
        }

        return "#00FF00"

    }


    //get colour function
    function chooseRadius(mag) {
        if (mag === 0) {
            return "1";
        }
        return mag * 4
    }

    function onEachFeature(x, layer) {
        layer.bindPopup("Magnitude: " + x.properties.mag + "<br>Location: " + x.properties.place + "<br>Depth: " + x.geometry.coordinates[2]);
        layer.on('mouseover', function (e) {
            this.openPopup();
        });
        layer.on('mouseout', function (e) {
            this.closePopup();
        });
        layer.setOpacity(0);
    }


    // Creating a GeoJSON layer with the retrieved data
    L.geoJson(data, {
        pointToLayer: function (x, latlong) {
            return L.circleMarker(latlong);
        },
        style: styleinfo,


    }).addTo(myMap);

    L.geoJSON(data, {
        onEachFeature: onEachFeature
    }).addTo(myMap);

    //Legend    

    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function () {
        var div = L.DomUtil.create("div", "info legend")
        var depth = [-10, 10, 30, 50, 70, 90];

        div.innerHTML += "<h3 style='text-align: center'>Depth</h3>"

        for (var i = 0; i < depth.length; i++) {
            div.innerHTML += '<i class="circle" style="background:' + chooseColor(depth[i] + 1) + '"></i> ' + depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
        }
        return div;
    };


    legend.addTo(myMap);

});
