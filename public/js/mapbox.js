/* eslint-disable */

console.log('clinet side test');
const locations = JSON.parse(document.getElementById('map').dataset.locations);

console.log(locations);

mapboxgl.accessToken =
  'pk.eyJ1IjoiYXJ0ZW0yOTExIiwiYSI6ImNrM2VrcXNtNzA5YjMzbm16cWN3bjg0MjUifQ.nAGRcWm4Pe8rEiT6GvQNAA';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/artem2911/ck3ekuoku4gha1cquahqp65xo',
  //   center: [-118.243683, 34.052235],
  //   zoom: 10
  //   interactive: false
  scrollZoom: false
});

// creating instance of bounds
const bounds = new mapboxgl.LngLatBounds();

// for each location creating a marker
locations.forEach(location => {
  // create html element
  const marker = document.createElement('div');
  // add class
  marker.className = 'marker';

  // create instance of Marker
  new mapboxgl.Marker({
    // pass element name
    element: marker,
    // pass position
    anchor: 'bottom'
  })
    // method requires an array of Lng and Lat in that exact order
    .setLngLat(location.coordinates)
    // method requires an element, isntance of Map which will use this bounds
    .addTo(map);

  // create instance of Popup
  new mapboxgl.Popup({
    anchor: 'left',
    offset: 30
  })
    .setLngLat(location.coordinates)
    .setHTML(`<p>Day ${location.day}: ${location.description}</p>`)
    .addTo(map);

  // extending map bounds to include current location each
  bounds.extend(location.coordinates);
});

// zoom in to fit the bounds
map.fitBounds(bounds, {
  // custom padding for bounds
  padding: {
    top: 200,
    bottom: 200,
    left: 100,
    right: 100
  }
  // maxZoom: 2
});

// Prefixing async on js file injection will prevent it from parsing before dom is loaded.
// Another JS work around

/*

document.addEventListener('DOMContentLoaded', function() {
    const locations = JSON.parse(document.getElementById('map').dataset.locations);
});

*/
