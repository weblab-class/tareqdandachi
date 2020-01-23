import React, { Component } from "react";
import ArticleButtons from "./ArticleButtons.js"

import "../Learn.css";
import "./BlochControls.css";
import BlochSphere from "./BlochSphere.js"

class Bloch extends Component {
  constructor(props) {
    super(props);
    this.state= { gate: "I" }
  }

  componentDidMount() { this.render() }
  componentDidUpdate() { this.render() }

  render() {

    const gateButtons = <div className="buttonContainer">
      <a onClick={() => this.setState({gate: "I"})} className={"gateButton i" + ((this.state.gate=="I") ? " selected" : "")}>I </a>
      <a onClick={() => this.setState({gate: "H"})} className={"gateButton h" + ((this.state.gate=="H") ? " selected" : "")}>H</a>
      <br />
      <a onClick={() => this.setState({gate: "X"})} className={"gateButton x" + ((this.state.gate=="X") ? " selected" : "")}>X</a>
      <a onClick={() => this.setState({gate: "RX"})} className={"gateButton rx" + ((this.state.gate=="RX") ? " selected" : "")}>Rx</a>
      <br />
      <a onClick={() => this.setState({gate: "Y"})} className={"gateButton y" + ((this.state.gate=="Y") ? " selected" : "")}>Y</a>
      <a onClick={() => this.setState({gate: "RY"})} className={"gateButton ry" + ((this.state.gate=="RY") ? " selected" : "")}>Ry</a>
      <br />
      <a onClick={() => this.setState({gate: "Z"})} className={"gateButton z" + ((this.state.gate=="Z") ? " selected" : "")}>Z</a>
      <a onClick={() => this.setState({gate: "RZ"})} className={"gateButton rz" + ((this.state.gate=="RZ") ? " selected" : "")}>Rz</a>
      <br />
      <a onClick={() => this.setState({gate: "S"})} className={"gateButton s" + ((this.state.gate=="S") ? " selected" : "")}>S</a>
      <a onClick={() => this.setState({gate: "Sdg"})} className={"gateButton sdg" + ((this.state.gate=="Sdg") ? " selected" : "")}>Sdg</a>
      <br />
      <a onClick={() => this.setState({gate: "T"})} className={"gateButton t" + ((this.state.gate=="T") ? " selected" : "")}>T</a>
      <a onClick={() => this.setState({gate: "Tdg"})} className={"gateButton tdg" + ((this.state.gate=="Tdg") ? " selected" : "")}>Tdg</a>
    </div>

    return (
      <div class="learnpage">
        <h1>Bloch Sphere</h1>
        <br/>
        <p>One way we can represent the superposition of states of a qubit is on what is called a <i>Block Sphere</i>. The top of the sphere is a 0 and is represented by the vector [1, 0], and the bottom is 1, represented by the vector [0, 1].</p>

        <p>Since quantum operations are <a href="gates" className="u-link">Unitary</a>, the state is usually on the surface of the bloch sphere and doesn't dip in. The different rotations are usually controlled by gates on a Spherical Co-ordinate system (R, theta, phi), where R is constant due to the unitary nature of operators.</p>

        <p>You can visualize these rotations on the interactive Bloch Sphere simulation below. You can select a gate on the left and see the original state (yellow) transpose to the final state (purple) after the application of the gate. You can use your mouse to hover around the sphere and look around the states. The green line points in the direction of +z, red to +y and blue to +x.</p>

        {gateButtons}

        <BlochSphere gate={this.state.gate}/>

        <br />

        <ArticleButtons left="Quantum Gates" right="Qiskit & QASM" left_link="gates" right_link="qasm"/>

      </div>
    );
  }
}

export default Bloch;
