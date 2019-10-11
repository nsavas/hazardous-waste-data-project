import React from 'react';
import MapboxGl from 'mapbox-gl/dist/mapbox-gl.js';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.min.js';
import '../App.css';

const ACCESS_TOKEN = process.env.REACT_APP_ACCESS_TOKEN;

class Map extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showHeader: true,
            center: [-97.2795, 38.0282],
            zoom: 4.20
        }
    };

    componentDidMount() {
        MapboxGl.accessToken = ACCESS_TOKEN;

        // Instantiate a map interface once component is mounted
        this.map = new MapboxGl.Map({
          container: this.container,
          style: 'mapbox://styles/mapbox/light-v9',
          center: this.state.center,
          zoom: this.state.zoom
        })

        // Instantiate geocoder
        this.geocoder = new MapboxGeocoder({
            accessToken: ACCESS_TOKEN,
            countries: "US",
            placeholder: "Enter any US city",
            limit: 4
        });

        // Append geocoder to a div 
        document.getElementById('geocoder').appendChild(this.geocoder.onAdd(this.map));
        
        // Listens to the geocoder result event
        this.geocoder.on('result', result => {
            let state;
            let city = result.result.text; // Get city name
            let locationContext = result.result.context;
            locationContext.map(context => {
                if (context.id.split('.')[0] == 'region') {
                    state = context.short_code.split('-')[1]; // Get the two letter state code
                }
            })

            // JSON object that will be sent to api endpoint
            let data = JSON.stringify({
                city: city.toUpperCase(),
                state: state
            });

            // Request to retrieve the chemical release data corresponding to the given city and state
            let request = new Request('http://localhost:3000/postgre-api/get-tri-releases-by-city', {
                method: 'POST',
                headers: new Headers({ 'Content-Type': 'application/json' }),
                body: data
            });

            // Fetch request and handle result
            fetch(request)
            .then(response => response.json())
            .then(data => {
                console.log(data);
            }).catch(err => console.log(err))

            // Toggle off the input header
            this.setState({ showHeader: false });
        });
    }

    componentDidUpdate() {
        if (this.state.showHeader) {
            document.getElementById('geocoder').appendChild(this.geocoder.onAdd(this.map));
        }
    }

    onClick() {
        this.setState({
            showHeader: true,
            center: [-97.2795, 38.0282],
            zoom: 4.20
        });

        this.map.flyTo({
            center: this.state.center,
            zoom: this.state.zoom
        })

        this.map.setCenter(this.state.center);
        this.map.setZoom(this.state.zoom);

        this.geocoder.clear();
    }

    render() {
        return (
            <div className="parentMap">
                <div className="Map" ref={(x) => { this.container = x }}></div>
                {this.state.showHeader ? 
                <div className="header">
                    <div className="header-bg">
                        <h1>US Chemical Release Visualizer</h1>
                        <div className="header-inner-bg">
                        <h2>
                            <strong>Note:</strong> This data is queried from the <a href="https://www.epa.gov/toxics-release-inventory-tri-program/tri-basic-data-files-calendar-years-1987-2017">EPA Toxic Release Inventory (TRI)</a>.
                            TRI tracks the management of certain toxic chemicals that may pose a threat to human health and the environment.
                            More information may be found on the website.
                        </h2>
                        <div id="geocoder" className="geocoder"></div>
                        </div>
                        <div className="header-description">
                            <h2>
                            Welcome to the <strong>US Chemical Release Visualizer</strong>, a tool for
                            visualizing 30 years worth (1987-2017) of chemical release data within any US city.
                            <br /><br />
                            To get started, enter a US city. This will
                            grab the data for the given city and generate an interactive visualization.
                            This data includes chemical name, amount of release, date of release, and much more!
                            </h2>
                        </div>
                    </div>
                </div> 
                :
                <div className="back-button">
                    <button onClick={this.onClick.bind(this)}>Go Back</button>
                </div>}
            </div>
        );
    }
}

export default Map;