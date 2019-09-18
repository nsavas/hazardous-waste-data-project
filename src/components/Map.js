import React from 'react';
import MapboxGl from 'mapbox-gl/dist/mapbox-gl.js';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.min.js';
import Geocoder from './Geocoder';
import '../App.css';

class Map extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    mapRef = React.createRef();

    componentDidMount() {
        MapboxGl.accessToken = 'pk.eyJ1IjoiY3N1bGJhY20td2FzdGVwcm9qZWN0IiwiYSI6ImNqbmI3bXIwdDAxMnMzcG8weDRzM3Z1NnkifQ.3V4lCPK2mrT54kGI22fdRQ';

        var map = new MapboxGl.Map({
          container: this.container,
          style: 'mapbox://styles/mapbox/light-v9',
          center: [-97.2795, 38.0282],
          zoom: 4.20
        })
        
        var geocoder = new MapboxGeocoder({
            accessToken: MapboxGl.accessToken
        });

        map.addControl(geocoder);
    }

    render() {
        return (
            <div className="Map" ref={(x) => { this.container = x }}>
            </div>
        );
    }
}

export default Map;