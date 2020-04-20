import React, { Component } from 'react';
import ResultPanel from "./ResultPanel";
import Switch from '@material-ui/core/Switch';

import "bootstrap/dist/css/bootstrap.min.css";

class Result extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }
  componentDidMount() {
    document
      .getElementById("result-geocoder")
      .appendChild(this.props.geocoder.onAdd(this.props.map));
  }
  render() {
    const headerStyle = {
      margin: "10px",
      fontFamily: "Titillium Web', sans-serif",
      fontWeight: "lighter",
      fontSize: "30px"
    }
    let resultPanel;
    if (this.props.showResults) {
      resultPanel = <ResultPanel onToggleResults={this.props.onToggleResults} data={this.props.data} showResults={this.props.showResults} />;
    } else {
      resultPanel = null;
    }
    return (
      <div className="container-fluid" style={{ padding: "10px" }}>
        <div className="container">
          <nav className="navbar navbar-light justify-content-center" style={{ backgroundColor: "rgba(255, 220, 220, 0.8)", borderRadius: "4px", border: "1px solid #000" }}>
            <a href="javascript:;" onClick={this.props.onHomeClick} style={{ textDecoration: "none", outline: "none", color: "rgba(0, 0, 0, 0.5)" }}>
              <i className="fa fa-chevron-left fa-lg" aria-hidden="true"></i>
            </a>
            <div id="result-geocoder" className="result-geocoder" style={{ paddingLeft: "15px", paddingRight: "30px" }}></div>
            <span style={{ fontWeight: "600" }}>Current Location: &nbsp;</span>
            <form className="form-inline" >
              <span style={{ paddingRight: "30px" }}>{`${this.props.city}, ${this.props.state}`}</span>
              <span style={{ fontWeight: "600" }}>Show Chart Components: &nbsp;</span>
              <div>
                <Switch checked={this.props.showResults} onChange={this.props.onToggleResults} color="white" />
              </div>
            </form>
          </nav>
        </div>
        {resultPanel}
      </div>
    )
  }
}

export default Result;