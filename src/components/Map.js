import React from 'react';
import MapboxGl from 'mapbox-gl/dist/mapbox-gl.js';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.min.js';
import '../App.css';

class Map extends React.Component {
    mapRef = React.createRef();

    componentDidMount() {
        const ACCESS_TOKEN = 'pk.eyJ1IjoiY3N1bGJhY20td2FzdGVwcm9qZWN0IiwiYSI6ImNqbmI3bXIwdDAxMnMzcG8weDRzM3Z1NnkifQ.3V4lCPK2mrT54kGI22fdRQ';
        
        MapboxGl.accessToken = ACCESS_TOKEN;

        var map = new MapboxGl.Map({
          container: this.container,
          style: 'mapbox://styles/mapbox/light-v9',
          center: [-97.2795, 38.0282],
          zoom: 4.20
        })

        var geocoder = new MapboxGeocoder({
            accessToken: ACCESS_TOKEN,
            countries: "US",
            placeholder: "Enter any US city"
        });

        document.getElementById('geocoder').appendChild(geocoder.onAdd(map));

        geocoder.on('result', function(result) {
            console.log(result);
            var city = result.result.text;
            console.log(city);
        })
    }

    render() {
        return (
            <div className="parentMap">
                <div className="Map" ref={(x) => { this.container = x }}></div>
                <div className="header">
                    <div className="header-bg">
                        <h1>US Chemical Release Visualizer</h1>
                        <div className="header-inner-bg">
                        <h2>
                            <strong>Note:</strong> This data is queried from the <a href="https://www.epa.gov/toxics-release-inventory-tri-program">EPA Toxic Release Inventory (TRI)</a>.
                            TRI tracks the management of certain toxic chemicals that may pose a threat to human health and the environment.
                            More information may be found on the website.
                        </h2>
                        <div id="geocoder" className="geocoder">
                        </div>
                        </div>
                        <div className="header-description">
                            <h2>
                            Welcome to the <strong>US Chemical Release Visualizer</strong>, a tool for
                            visualizing a decades worth of chemical release data within a given US city.
                            <br /><br />
                            To get started, enter the name of a US city and press enter. This will
                            query chemical release data for the given city and generate an interactive visualization.
                            This data includes chemical name, amount of release, date of release, and much more!
                            </h2>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Map;