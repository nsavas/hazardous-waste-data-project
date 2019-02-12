// Display map
mapboxgl.accessToken = 'pk.eyJ1IjoiY3N1bGJhY20td2FzdGVwcm9qZWN0IiwiYSI6ImNqbmI3bXIwdDAxMnMzcG8weDRzM3Z1NnkifQ.3V4lCPK2mrT54kGI22fdRQ';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v9',
    zoom: 1
});

// Fetch us cities csv data
d3.csv("../data/uscitiesv1.4.csv").then(function(data) {
    console.log(data);
});

// Query parameters to be passed to API endpoint
let params = {};
  
// This function takes in a parameter object and
// encodes it into a URL query
function encodeQuery(params) {
    let esc = encodeURIComponent;
    let query = Object.keys(params)
    .map(k => esc(k) + '=' + esc(params[k]))
    .join('&');

    return query;
}