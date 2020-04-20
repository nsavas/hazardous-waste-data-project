import React from "react";
import MapboxGl from "mapbox-gl/dist/mapbox-gl.js";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.min.js";

import Result from "./components/Result";

import "./App.css";

const ACCESS_TOKEN = process.env.REACT_APP_ACCESS_TOKEN;
MapboxGl.accessToken = ACCESS_TOKEN;

const initialMapCenter = [-97.2795, 38.0282];
const initialMapZoom = 4.2;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showHeader: true,
      center: initialMapCenter,
      zoom: initialMapZoom,
      data: {}
    };
  }

  componentDidMount() {
    // Instantiate Mapbox Map & Geocoder
    this.map = new MapboxGl.Map({
      container: this.container,
      style: "mapbox://styles/mapbox/light-v9",
      center: this.state.center,
      zoom: this.state.zoom
    });
    this.geocoder = new MapboxGeocoder({
      accessToken: ACCESS_TOKEN,
      countries: "US",
      types: "place",
      placeholder: "Enter any US city",
      limit: 4
    });
    // Load images
    this.map.on("load", () => {
      this.map.loadImage('https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Maki-danger-15.svg/15px-Maki-danger-15.svg.png', (error, image) => {
        if (error) throw error;
        this.map.addImage('danger', image);
      });
    })
    // Set Geocoder result listener 
    this.geocoder.on("result", result => {
      this.handleGeocoderResult(result);
    });
    // Append Geocoder
    document
      .getElementById("geocoder")
      .appendChild(this.geocoder.onAdd(this.map));
  }

  componentDidUpdate() {
    if (this.state.showHeader) {
      document
        .getElementById("geocoder")
        .appendChild(this.geocoder.onAdd(this.map));
    }
  }

  handleGeocoderResult(result) {
    // Clear previous data layer and geocoder config, reset position
    if (!(this.map.getSource('facilities') === undefined)) {
      this.map.removeLayer("facilities-point");
      this.map.removeSource("facilities");
      this.geocoder.clear();
    }
    this.setState({
      center: [result.result.center[0] + 1, result.result.center[1]],
      zoom: 4
    });
    this.geocoder.setFlyTo({
      center: [result.result.center[0] + 1, result.result.center[1]],
      zoom: 4,
      speed: 0.7
    });
    this.map.flyTo({
      center: [result.result.center[0], result.result.center[1]],
      zoom: 10,
      speed: 0.7
    });
    // Parse location and update state
    let city, state;
    let eventData = result.result;
    let locationContext = eventData.context;
    if (eventData.matching_text) city = eventData.matching_text.toUpperCase();
    else city = eventData.text.toUpperCase();
    locationContext.map(context => {
      if (context.id.split(".")[0] == "region") {
        state = context.short_code.split("-")[1];
      }
    });
    this.setState({ city: city, state: state });
    // Create request objects and fetch results
    let data = JSON.stringify({ city: city, state: state });
    let request = new Request("http://localhost:3000/postgre-api/get-tri-releases-by-city", {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: data
    });
    let request2 = new Request("http://localhost:3000/postgre-api/get-release-method-totals-by-city", {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: data
    });
    fetch(request).then(response => response.json())
      .then(data => {
        this.map.addSource("facilities", {
          type: "geojson",
          data: data.result_geometry
        });
        this.map.addLayer({
          id: "facilities-point",
          type: "symbol",
          source: "facilities",
          layout: {
            'icon-image': 'danger',
            'icon-allow-overlap': true
          }
        });
      })
      .catch(err => {
        console.log(err);
      });
    fetch(request2).then(response => response.json())
      .then(data => {
        console.log(data);
        this.setState({
          data: {
            releaseMethodTotals: data
          }
        });
      })
      .catch(err => {
        console.log(err);
      });
    this.setState({ showHeader: false });
  }

  // Executes each time user returns to input header
  onHomeClick = () => {
    // Reset state
    this.setState({
      showHeader: true,
      center: initialMapCenter,
      zoom: initialMapZoom
    });
    // Change view back to original
    this.map.flyTo({
      center: initialMapCenter,
      zoom: initialMapZoom

    });
    this.map.setCenter(initialMapCenter);
    this.map.setZoom(initialMapZoom);
    this.geocoder.clear();
    // Remove data source
    this.map.removeLayer("facilities-point");
    this.map.removeSource("facilities");
  }

  render() {
    return (
      <div className="App">
        <div
          className="Map"
          ref={x => {
            this.container = x;
          }}
        >
          <a
            href="https://github.com/nsavas/us-city-tri-visualizer"
            target="_blank"
            className="github-ribbon"
          >
            <img
              src="https://github.blog/wp-content/uploads/2008/12/forkme_right_white_ffffff.png?resize=149%2C149"
              className="attachment-full size-full"
              alt="Fork me on GitHub"
              data-recalc-dims="1"
            ></img>
          </a>
        </div>
        {this.state.showHeader ? (
          <div className="header">
            <div className="header-bg">
              <h1>US Chemical Release Visualizer</h1>
              <div className="header-inner-bg">
                <h2>
                  <strong>Note:</strong> This data is queried from the{" "}
                  <a href="https://www.epa.gov/toxics-release-inventory-tri-program/tri-basic-data-files-calendar-years-1987-2017">
                    EPA Toxic Release Inventory (TRI)
                  </a>
                  . TRI tracks the management of certain toxic chemicals that
                  may pose a threat to human health and the environment. More
                  information may be found on the website.
                </h2>
                <div id="geocoder" className="geocoder"></div>
              </div>
              <div className="header-description">
                <h2>
                  Welcome to the <strong>US Chemical Release Visualizer</strong>
                  , a tool for visualizing 30 years worth (1987-2017) of
                  chemical release data within any US city.
                  <br />
                  <br />
                  To get started, enter a US city. This will grab the data for
                  the given city and begin the visualization. This data includes
                  chemical name, amount of release, date of release, and much
                  more!
                </h2>
              </div>
            </div>
          </div>
        ) : <Result
            onHomeClick={this.onHomeClick}
            city={this.state.city} state={this.state.state}
            data={this.state.data}
            geocoder={this.geocoder} map={this.map}
          />}
      </div>
    );
  }
}

export default App;
