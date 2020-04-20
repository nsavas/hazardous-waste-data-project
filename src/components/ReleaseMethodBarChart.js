import React, { Component } from 'react';
import '../App.css';
import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  VerticalBarSeries,
  DiscreteColorLegend
} from 'react-vis/es/index';

class ReleaseMethodBarChart extends Component {
  render() {
    const { fugitiveair, stackair, water, underground, landfill, landtreatment, surfaceimpoundment, otherdisposal } = this.props.data.result;
    console.log(this.props.data);
    return (
      <XYPlot
        className="release-method-bar-chart"
        xType="ordinal"
        width={700}
        height={300}
        style={{ backgroundColor: "#ffffff", opacity: "0.8", padding: "5px", borderRadius: "10px", border: "1px solid #000" }}
      >
        <DiscreteColorLegend
          style={{ position: 'absolute', left: '40%', top: '10px', paddingBottom: "50px" }}
          orientation="horizontal"
          items={[
            {
              title: '  Total Release In Pounds',
              color: '#12939A'
            }
          ]}
        />
        <VerticalGridLines />
        <HorizontalGridLines />
        <XAxis />
        <YAxis width={60} />
        <VerticalBarSeries
          color="#12939A"
          barWidth={0.7}
          data={[
            { x: 'Fugitive Air', y: fugitiveair },
            { x: 'Stack Air', y: stackair },
            { x: 'Water', y: water },
            { x: 'Underground', y: underground },
            { x: 'Landfill', y: landfill },
            { x: 'Treatment', y: landtreatment },
            { x: 'Surface Impoundment', y: surfaceimpoundment },
            { x: 'Other', y: otherdisposal }
          ]}
        />
      </XYPlot>
    );
  }
}

export default ReleaseMethodBarChart;