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
        return {
            color: "#000000",
            fillColor: chooseColor(x.geometry.coordinates[2]),
            radius: chooseRadius(x.properties.mag),
            fillOpacity: 1,
            stroke: 0.4
        }
    }


    //get radius function
    function chooseColor(depth) {
        switch (true) {
            case depth > 90:
                return "#ea2c2c";
            case depth > 70:
                return "#aa2c2c";
            case depth > 50:
                return "#ba2c2c";
            case depth > 30:
                return "#ca2c2c";
            case depth > 10:
                return "#da2c2c";


            default:
                return "#98ee0"
        }
    }


    //get colour function
    function chooseRadius(mag) {
        if (mag ===0) {
            return "1";
        }
        return mag * 4
    }


    // Creating a GeoJSON layer with the retrieved data
    L.geoJson(data, {
        pointToLayer: function (feature, latlong) {
            return L.circleMarker(latlong);
        },
        style: styleinfo
    }).addTo(myMap);




    //Legend
});
