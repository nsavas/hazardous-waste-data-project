// Display map
mapboxgl.accessToken = 'pk.eyJ1IjoiY3N1bGJhY20td2FzdGVwcm9qZWN0IiwiYSI6ImNqbmI3bXIwdDAxMnMzcG8weDRzM3Z1NnkifQ.3V4lCPK2mrT54kGI22fdRQ';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v9',
    zoom: 4.05,
    center: [-97.2795, 38.0282],
    interactive: false
});

let geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    placeholder: "Enter a US city",

    countries: 'us',
    limit: 10
    //bbox: [-124.848974, 24.396308, -66.885444, 49.384358] // US Boundary Coordinates
})

document.getElementById('geocoder').appendChild(geocoder.onAdd(map));

// Query parameters to be passed to API endpoint
let params = {
    state: "CA"
};

// This function takes in a parameter object and
// encodes it into a URL query
function encodeQuery(params) {
    let esc = encodeURIComponent;
    let query = Object.keys(params)
    .map(key => esc(key) + '/' + esc(params[key]))
    .join('/');
    return query;
}

let userQuery = encodeQuery(params);

/*fetch("https://iaspub.epa.gov/enviro/efservice/V_TRI_RELEASES_EZ/" + userQuery, function(data) {
}).then()*/