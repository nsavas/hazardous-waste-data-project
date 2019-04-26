import React, { Component } from 'react'
import Map from './components/Map'

class App extends Component {
  constructor() {
    super();
    this.state = {}
  };

  componentDidMount() {
  }

  render() {
  return (
      <div className="app">
        <Map/>
      </div>
  );
  }
}

export default App;
