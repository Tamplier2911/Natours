/* eslint-disable */

console.log('clinet side test');
const locations = JSON.parse(document.getElementById('map').dataset.locations);

console.log(locations);

mapboxgl.accessToken =
  'pk.eyJ1IjoiYXJ0ZW0yOTExIiwiYSI6ImNrM2VrcXNtNzA5YjMzbm16cWN3bjg0MjUifQ.nAGRcWm4Pe8rEiT6GvQNAA';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/artem2911/ck3ekuoku4gha1cquahqp65xo',
  center: [-118.243683, 34.052235],
  zoom: 10
  //   interactive: false
});

// Prefixing async on js file injection will prevent it from parsing before dom is loaded.
// Another JS work around

/*

document.addEventListener('DOMContentLoaded', function() {
    const locations = JSON.parse(document.getElementById('map').dataset.locations);
});

*/
