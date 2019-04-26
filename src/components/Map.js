import React, { Component } from 'react';
import MapGL from 'react-map-gl'
import Geocoder from './Geocoder'
import '../App.css'

const ACCESS_TOKEN = process.env.REACT_APP_ACCESS_TOKEN;
console.log(ACCESS_TOKEN);

class Map extends Component {
    mapRef = React.createRef();
    containerRef = React.createRef();
    
    state = {
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
          latitude: 38.0282,
          longitude: -97.2795,
          zoom: 4.05
        }
    };

    render() {
        const style = {
            position: "absolute",
            top: 0,
            bottom: 0,
            width:"100%"
        }

    return (
        <div className="map">
            <MapGL
            ref={this.mapRef}
            style={style}
            mapboxApiAccessToken={ACCESS_TOKEN}
            onViewportChange={(viewport) => this.setState({viewport})}
            {...this.state.viewport}
            />
            <Geocoder map={this.mapRef}/>
        </div>
    );
    }
}

export default Map;