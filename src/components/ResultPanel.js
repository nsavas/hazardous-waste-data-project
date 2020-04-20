import React, { Component } from 'react';

import ReleaseMethodBarChart from "./ReleaseMethodBarChart";

import "bootstrap/dist/css/bootstrap.min.css";

export default class ResultPanel extends Component {
  render() {
    return (
      <div className="container results-panel">
        <div className="chart-components-release-type shadow-sm rounded" style={{ display: "block", backgroundColor: "rgba(220, 220, 220, 0.3)", height: "460px" }}>
          <div className="row justify-content-start" style={{ margin: "5px" }}>
            <div className="col-md-auto" style={{ paddingTop: "20px" }}>
              <h1 className="text-danger" >Release Type</h1>
              <p className="lead">These components explore the data by the method in which the toxic chemicals were released.</p>
            </div>
          </div>
          <hr className="my-2" />
          <div className="row justify-content-center">
            <div className="col">
              <ReleaseMethodBarChart data={this.props.data} />
            </div>
          </div>
        </div>
        <div className="chart-components-industry shadow-sm rounded" style={{ display: "block", backgroundColor: "rgba(220, 220, 220, 0.3)", height: "460px" }}>
          <div className="row justify-content-start" style={{ margin: "5px" }}>
            <div className="col-md-auto" style={{ paddingTop: "20px" }}>
              <h1 className="text-danger" >Industry</h1>
              <p className="lead">These components explore the data regarding the industry that the release was associated with.</p>
            </div>
          </div>
          <hr className="my-2" />
          <div className="row justify-content-center">
            <div className="col">
              <ReleaseMethodBarChart data={this.props.data} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}