import React, { Component } from 'react';
import Geocode from 'react-map-gl-geocoder'
import '../App.css'

const ACCESS_TOKEN = process.env.REACT_APP_ACCESS_TOKEN;

class Geocoder extends Component {
    containerRef = React.createRef();

    render() {
    return (
        <div className="header">
        <div className="header-bg">
            <h1>US Chemical Release Visualizer</h1>
            <div className="header-inner-bg">
            <h2>
                <strong>Note:</strong> This data is queried from the 
                <a href="https://www.epa.gov/toxics-release-inventory-tri-program">EPA Toxic Release Inventory (TRI)</a>.
                TRI tracks the management of certain toxic chemicals that may pose a threat to human health and the environment.
                More information may be found on the website.
            </h2>
            <div ref={this.containerRef} className="geocoder">
                <Geocode
                mapRef={this.props.map}
                containerRef={this.containerRef}
                onViewportChange={(viewport) => this.setState({viewport})}
                mapboxApiAccessToken={ACCESS_TOKEN}
                placeholder={"Enter a US city"}
                country={"us"}
                limit={6}
                />
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
        )
    }
}

export default Geocoder;