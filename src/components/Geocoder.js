import React from 'react';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.min.js';
import '../App.css';

class Geocoder extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        var geocoder = new MapboxGeocoder({
            accessToken: this.props.accessToken
        });
    }

    render() {
        return (
            <div></div>
        );
    }
}

export default Geocoder;