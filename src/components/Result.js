import React, { Component } from 'react';
import Form from "react-bootstrap/Form";

import ReleaseMethodBarChart from "./ReleaseMethodBarChart";

import "bootstrap/dist/css/bootstrap.min.css";

class Result extends Component {
  state = { showChartComponents: false }
  componentDidMount() {
    document
      .getElementById("result-geocoder")
      .appendChild(this.props.geocoder.onAdd(this.props.map));
  }
  onShowChartComponentsToggle = () => {
    this.setState(state => ({
      showChartComponents: !state.showChartComponents
    }));
  }
  render() {
    return (
      <div className="container-fluid" style={{ padding: "10px" }}>
        <div className="container">
          <nav className="navbar navbar-light justify-content-center" style={{ backgroundColor: "rgba(255, 220, 220, 0.8)", borderRadius: "4px", border: "1px solid #000" }}>
            <a href="javascript:;" onClick={this.props.onHomeClick} style={{ textDecoration: "none", outline: "none", color: "rgba(0, 0, 0, 0.5)" }}>
              <i className="fa fa-chevron-left fa-lg" aria-hidden="true"></i>
            </a>
            <form className="form-inline" >
              <div id="result-geocoder" className="result-geocoder" style={{ paddingLeft: "15px", paddingRight: "30px" }}></div>
              <span style={{ fontWeight: "600" }}>Current Location: &nbsp;</span>
              <span style={{ paddingRight: "30px" }}>{`${this.props.city}, ${this.props.state}`}</span>
              <span style={{ fontWeight: "600" }}>Show Chart Components: &nbsp;</span>
              <div class="custom-control custom-switch">
                <input type="checkbox" class="custom-control-input" id="showChartComponentsSwitch" onClick={this.onShowChartComponentsToggle} />
                <label for="showChartComponentsSwitch" className="custom-control-label"></label>
              </div>
            </form>
          </nav>
        </div>
        {(this.props.data.releaseMethodTotals && this.state.showChartComponents) ?
          <div className="container">
            <div className="row justify-content-center">
              <div className="col">
                <ReleaseMethodBarChart data={this.props.data.releaseMethodTotals} />
              </div>
            </div>
          </div>
          : null}
      </div>
    )
  }
}

export default Result;