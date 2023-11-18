// Welcome
console.log("Welcome to Jiahui's Module 15 Project!")

// Apply Earthquakes' URL
let earthq_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Retrieve Earthquakes' URL with D3
d3.json(earthq_url).then(data => {

    // Display all the data
    console.log(data);

    // Finish reading all the data
    console.log("This is all the data from the url!")

    // Call the function to create the circle markers
    featureDesign(data);
});

// Function to design the circle markers
function featureDesign(earthq_data) {

  // Function to display place and time of each earthquake
  function onEachFeature(features, layer){
    layer.bindPopup("<h4>Location: " + features.properties.place + 
    "</h4><hr><p>Date & Time: " + new Date(features.properties.time) + 
    "</p><hr><p>Magnitude: " + features.properties.mag + "</p>");};

    // Create a GeoJSON layer that contains all the features on the earthquakes data
    let earthquakes = L.geoJSON(earthq_data, {
        onEachFeature: onEachFeature,

        // Point to a layer for the circle coordinates
        pointToLayer: function(features, coordinates) {

        // Determine the properties of the circle markers based on the magnitude of earthquakes
        let magnitude = features.properties.mag;
        let depth = features.geometry.coordinates[2];
        let geoMarkers = {
            radius: magnitude*5,
            fillColor: colorsDesign(depth),
            fillOpacity: 0.7,
            weight: 0.5
        };
        return L.circleMarker(coordinates, geoMarkers);
        }
    });

  // Call the function to create maps
  mapDesign(earthquakes);
};

// Function to determine the color of markers based on the magnitude of the earthquake
function colorsDesign(depth) {

    // variable to hold the color
    let color = "";

    if (depth <= 1 && depth >= 0) {
        return color = "#84fd6c";
    }
    else if (depth <= 2) {
        return color = "#bfd16e";
    }
    else if (depth <= 3) {
        return color = "#ddbf5c";
    }
    else if (depth <= 4) {
        return color = "#e79b37";
    }
    else if (depth <= 5) {
        return color = "#ec7141";
    }
    else {
        return color = "#f82720";
    }

};

// Function to set up the map layers
function mapDesign(earthquakes) {
    // Create Tile Layers
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    // Create a baseMaps to hold street map layer
    let baseMaps = {
        "Street Map": street
    };

    // Create a OverlayMaps to hold the earthquakes data layer
    let overlayMaps = {
        Earthquakes: earthquakes
    };

   // Create the map object with options
    let myMap = L.map("map", {
        center: [34.03, -108.15],
        zoom: 6,
        layers: [street, earthquakes]
    });

    // Create a layer control, and pass it baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps).addTo(myMap);

    // Create a legend to display information about our map
    var info = L.control({
        position: "bottomright"
    });

    // When the layer control is added, insert a div with the class of "legend"
    info.onAdd = function() {
        var div = L.DomUtil.create("div", "legend");
        div.innerHTML=[
            "<p class='l1'>0 - 1</p>",
            "<p class='l2'>1 - 2</p>",
            "<p class='l3'>2 - 3</p>",
            "<p class='l4'>3 - 4</p>",
            "<p class='l5'>4 - 5</p>",
            "<p class='g5'>>=5</p>"
        ].join("");

        return div;
    };
    
    // Add the info legend to the map
    info.addTo(myMap);
};


