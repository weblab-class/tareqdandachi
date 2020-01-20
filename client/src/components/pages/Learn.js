import React, { Component } from "react";

import "./Learn.css";

class Learn extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="learnBlockContainer">
        <div onClick={()=>{location.href="/learn/funk"}}>
          <img id="funk" src="http://upload.wikimedia.org/wikipedia/commons/c/ce/Transparent.gif" />
          <h1>Quantum Funk</h1>
        </div>
        <div onClick={()=>{location.href="/learn/gates"}}>
          <img id="gates" src="http://upload.wikimedia.org/wikipedia/commons/c/ce/Transparent.gif" />
          <h1>Quantum Gates</h1>
        </div>
        <div onClick={()=>{location.href="/learn/bloch"}}>
          <img id="bloch" src="http://upload.wikimedia.org/wikipedia/commons/c/ce/Transparent.gif" />
          <h1>Bloch Sphere</h1>
        </div>
        <div onClick={()=>{location.href="/learn/qasm"}}>
          <img id="qasm" src="http://upload.wikimedia.org/wikipedia/commons/c/ce/Transparent.gif" />
          <h1>Qiskit & QASM</h1>
        </div>
      </div>
    );
  }
}

export default Learn;
