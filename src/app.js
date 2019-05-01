<<<<<<< HEAD
// Display map
mapboxgl.accessToken = 'pk.eyJ1IjoiY3N1bGJhY20td2FzdGVwcm9qZWN0IiwiYSI6ImNqbmI3bXIwdDAxMnMzcG8weDRzM3Z1NnkifQ.3V4lCPK2mrT54kGI22fdRQ';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/csulbacm-wasteproject/cjtndojemd8ln1fjp02ndinqk',
    zoom: 4.05,
    center: [-97.2795, 38.0282],
    interactive: true
});

let geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    placeholder: "Enter a US city",

    countries: 'us',
    limit: 6
    //bbox: [-124.848974, 24.396308, -66.885444, 49.384358] // US Boundary Coordinates
})

/*$.getJSON('../data/us-zip-code.geojson', function(data) {
    let tileIndex = geojsonvt(data);
    let tile = tileIndex.getTile(0, 0, 0);
    let features = tile.features;
    map.on('load', function() {
        map.addLayer({
            "id": "us-zip-codes",
            "type:": "line",
            "source": {
                "type": "geojson",
                "data": data
            },
            "layout": {},
            "paint": {
                "line-color": "#888",
                "line-width": 4
            }
        })
    })
    console.log(tileIndex);
    console.log(features);
    console.log(tileIndex.tileCoords);
    console.log(tile);
})*/

document.getElementById('geocoder').appendChild(geocoder.onAdd(map));

// After the map style has loaded on the page, add a source layer and default
// styling for a single point.
map.on('load', function() {
    // Listen for the `result` event from the MapboxGeocoder that is triggered when a user
    // makes a selection
    //'mapbox://styles/csulbacm-wasteproject/cjtnasenh4l2n1fo36ttq1h9b'
    map.addLayer({
        "id": "us-zip-codes",
        "type:": "fill",
        "source": {
            type: 'vector',
            url: 'mapbox://csulbacm-wasteproject.9ab6sl6x'
        },
        "layout": {
            'visibility': 'none'
        },
        "paint": {
            'fill-outline-color': '#696969',
            'fill-opacity': .65
        },
        "source-layer": "us-zip-codes-aocpck"
    });
    geocoder.on('result', function(ev) {
        console.log(ev);
    });
});

// Query parameters to be passed to API endpoint
/*let params = {
    state_abbr: "CA",
    city_name: "Long Beach",
};

let esc = encodeURIComponent;

// This function takes in a parameter object and
// encodes it into a URL query
function encodeQuery(params) {
    return Object.keys(params).map(key =>
        esc(key) + '/' + esc(params[key]))
        .join('/');
=======
import React, { Component } from 'react'
import Map from './components/Map'

class App extends Component {
  constructor() {
    super();
    this.state = {}
  };

  componentDidMount() {
  }

  render() {
  return (
      <div className="app">
        <Map/>
      </div>
  );
  }
>>>>>>> 735d67624fd8cd525fd7875db0cd981da4b340e0
}

export default App;
