import React from 'react';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.min.js';
import '../App.css';

class Geocoder extends React.Component {
    componentDidMount() {}

    render() {
        return (
            <div className="geocoder"></div>
        );
    }
}

export default Geocoder;