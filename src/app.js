import React from 'react';
import MapboxGl from 'mapbox-gl/dist/mapbox-gl.js';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.min.js';
import './App.css';

const ACCESS_TOKEN = process.env.REACT_APP_ACCESS_TOKEN;
MapboxGl.accessToken = ACCESS_TOKEN;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showHeader: true,
            center: [-97.2795, 38.0282],
            zoom: 4.20
        }
    };

    componentDidMount() {
        // Instantiate a map
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
            types: "place",
            placeholder: "Enter any US city",
            limit: 4
        });

        // Geocoder result listener
        this.geocoder.on('result', result => {
            this.handleGeocoderResult(result);
        });

        // Add geocoder to map
        document.getElementById('geocoder').appendChild(this.geocoder.onAdd(this.map));
    }

    componentDidUpdate() {
        if (this.state.showHeader) {
            // Place geocoder back onto the input header
            document.getElementById('geocoder').appendChild(this.geocoder.onAdd(this.map));
        }
    }

    handleGeocoderResult(result) {
        let city, state;
        let eventData = result.result;

        // Parse city name
        if (eventData.matching_text) city = eventData.matching_text.toUpperCase();
        else city = eventData.text.toUpperCase();

        // Parse two letter state code
        let locationContext = eventData.context;
        locationContext.map(context => {
            if (context.id.split('.')[0] == 'region') {
                state = context.short_code.split('-')[1];
            }
        })

        // JSON object that sends to api
        let data = JSON.stringify({
            city: city,
            state: state
        });

        // Query request with city/state user input
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
            this.map.addSource('facilities', {
                    "type": "geojson",
                    "data": data.result_geometry
            });
                 
            this.map.addLayer({
            "id": "facilities-heatmap",
            "type": "heatmap",
            "source": "facilities",
            "maxzoom": 9,
            "paint": {
                // Increase the heatmap weight based on frequency and property magnitude
                "heatmap-weight": ["interpolate", ["linear"], ["get", "mag"], 0, 0, 6, 1],
                // Increase the heatmap color weight weight by zoom level
                // heatmap-intensity is a multiplier on top of heatmap-weight
                "heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 0, 1, 9, 3],
                // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
                // Begin color ramp at 0-stop with a 0-transparancy color
                // to create a blur-like effect.
                "heatmap-color": [
                "interpolate",
                ["linear"],
                ["heatmap-density"],
                0, "rgba(33,102,172,0)",
                0.2, "rgb(103,169,207)",
                0.4, "rgb(209,229,240)",
                0.6, "rgb(253,219,199)",
                0.8, "rgb(239,138,98)",
                1, "rgb(178,24,43)"
                ],
                // Adjust the heatmap radius by zoom level
                "heatmap-radius": [
                "interpolate",
                ["linear"],
                ["zoom"],
                0, 2,
                9, 20
                ],
                // Transition from heatmap to circle layer by zoom level
                "heatmap-opacity": [
                "interpolate",
                ["linear"],
                ["zoom"],
                7, 1,
                9, 0
                ],
            }
            }, 'waterway-label');

            this.map.addLayer({
                "id": "facilities-point",
                "type": "circle",
                "source": "facilities",
                "minzoom": 7,
                "paint": {
                // Size circle radius by earthquake magnitude and zoom level
                "circle-radius": [
                "interpolate",
                ["linear"],
                ["zoom"],
                7, [
                "interpolate",
                ["linear"],
                ["get", "mag"],
                1, 1,
                6, 4
                ],
                16, [
                "interpolate",
                ["linear"],
                ["get", "mag"],
                1, 5,
                6, 50
                ]
                ],
                // Color circle by earthquake magnitude
                "circle-color": [
                "interpolate",
                ["linear"],
                ["get", "mag"],
                1, "rgba(33,102,172,0)",
                2, "rgb(103,169,207)",
                3, "rgb(209,229,240)",
                4, "rgb(253,219,199)",
                5, "rgb(239,138,98)",
                6, "rgb(178,24,43)"
                ],
                "circle-stroke-color": "white",
                "circle-stroke-width": 1,
                // Transition from heatmap to circle layer by zoom level
                "circle-opacity": [
                "interpolate",
                ["linear"],
                ["zoom"],
                7, 0,
                8, 1
                ]
                }
                }, 'waterway-label');
        })
        .catch(err => {
            console.log(err);
        })

        // Toggle off the input header
        this.setState({ showHeader: false });
    }

    // Executes each time user returns to input header
    onClick() {
        // Reset state
        this.setState({
            showHeader: true,
            center: [-97.2795, 38.0282],
            zoom: 4.20
        });

        // Change view back to original
        this.map.flyTo({
            center: this.state.center,
            zoom: this.state.zoom
        })

        // Reconfigure map properties
        this.map.setCenter(this.state.center);
        this.map.setZoom(this.state.zoom);

        // Clear input
        this.geocoder.clear();
    }

    render() {
        return (
            <div className="App">
                <div className="Map" ref={(x) => { this.container = x }}>
                    <a href="https://github.com/nsavas/us-city-tri-visualizer" target="_blank" className="github-ribbon">
                        <img src="https://github.blog/wp-content/uploads/2008/12/forkme_right_white_ffffff.png?resize=149%2C149" className="attachment-full size-full" alt="Fork me on GitHub" data-recalc-dims="1"></img>
                    </a>
                </div>
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
                            grab the data for the given city and begin the visualization.
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

export default App;