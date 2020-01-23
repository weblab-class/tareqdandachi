import React, { Component } from "react";

import "../Learn.css";
import "./BlochControls.css";
import BlochSphere from "./BlochSphere.js"

class Bloch extends Component {
  constructor(props) {
    super(props);
    this.state= { gate: "Z" }
  }

  componentDidMount() { this.render() }
  componentDidUpdate() { this.render() }

  render() {

    const gateButtons = <>
      <a onClick={() => this.setState({gate: "H"})} className="gateButton h">H</a>
      <a onClick={() => this.setState({gate: "X"})} className="gateButton x">X</a>
      <a onClick={() => this.setState({gate: "Y"})} className="gateButton y">Y</a>
      <a onClick={() => this.setState({gate: "Z"})} className="gateButton z">Z</a>
      <a onClick={() => this.setState({gate: "RX"})} className="gateButton rx">Rx</a>
      <a onClick={() => this.setState({gate: "RY"})} className="gateButton ry">Ry</a>
      <a onClick={() => this.setState({gate: "RZ"})} className="gateButton rz">Rz</a>
      <a onClick={() => this.setState({gate: "S"})} className="gateButton s">S</a>
      <a onClick={() => this.setState({gate: "Sdg"})} className="gateButton sdg">Sdg</a>
      <a onClick={() => this.setState({gate: "T"})} className="gateButton t">T</a>
      <a onClick={() => this.setState({gate: "Tdg"})} className="gateButton tdg">Tdg</a>
    </>

    return (
      <div class="learnpage">
        <h1>Bloch Sphere</h1>
        <br/>
        <p>Quantum programs and algorithms are a <i>sequence of quantum operators</i> applied in sequence on a bunch of <b>quantum states</b>, they form what is called a <b style={{color: 'var(--primary)'}}>Quantum Circuit</b>. All possible quantum operators have to be unitary and reversible. This means if you modify quantum states with a circuit, by reversing that the circuit you get the original states back.</p>

        {gateButtons}

        <BlochSphere gate={this.state.gate}/>

      </div>
    );
  }
}

export default Bloch;
