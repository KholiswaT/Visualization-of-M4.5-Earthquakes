// Create map & boundaries
var myMap = L.map("map", {
    center: [20, 0],
    zoom: 2,
    minZoom: 2
  });
  
  // Adding a base layer for map
  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 10,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);

  // Store API in newly created variable
var earthquake = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson";

//  Call variable and retrieve magnitude data
d3.json(earthquake, function(data) {
    console.log(data)
  function markerStyle(feature) {
    return {
      opacity: 1,
      fillOpacity: 0.75,
      fillColor: colorMarker(feature.properties.mag),
      color: "black",
      radius: markerRadius(feature.properties.mag),
      stroke: true,
      weight: 0.75
    };
  }
  // Switch colors for increasing level of earthquake magnitude
    function colorMarker(magnitude) {
    switch (true) {
    case magnitude > 7:
      return "black";
    case magnitude > 6:
      return "RebeccaPurple";
    case magnitude > 5.5:
      return "MediumOrchid";
    case magnitude > 5:
      return "red";
    case magnitude > 4.5:
      return "orange";
    default:
      return "yellow";
    }
  }
// Set color function to be used for legend
  function getColors(d) {
    return d > 7 ? "black":
    d > 6 ? "RebeccaPurple":
    d > 5.5 ? "MediumOrchid":
    d > 5 ? "red":
    d > 4.5 ? "orange" :
    d > 0 ?  "yellow":
    "white"
    }

  // Create function for radius so that it changes in size based on magnitude
    function markerRadius(magnitude) {
        return magnitude * 3;
  }
// Define pop-up for each feature
  function onEachFeature(feature, layer) {
        layer.bindPopup("<strong>Location: </strong>" + feature.properties.place+ "<hr>" + "<strong> Magnitude: </strong> " + feature.properties.mag );
      };


// Create GeoJSON layer
    L.geoJson(data, {
      // Maken circles
      pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng);
      },
      style: markerStyle,
      onEachFeature: onEachFeature
    }).addTo(myMap);
  
// Create legend
    var legend = L.control({
      position: "bottomright"
    });
  
//Add details to legend
    legend.onAdd = function() { 
      var div = L.DomUtil.create("div", "info legend");
      var labels = ['<strong>Richter Scale</strong>']
      var scale = [0, 4.5, 5, 5.5, 6, 7];

      for (var i = 0; i < scale.length; i++) {
        div.innerHTML +=
            labels.push('<i style= "background:' + getColors(scale[i]+0.5) + '"></i> ' +
            scale[i] + (scale[i + 1] ? "&ndash;" + scale[i + 1]: "+"));
      }
      div.innerHTML = labels.join('<br>');
      return div;
    };
    legend.addTo(myMap);
  });

