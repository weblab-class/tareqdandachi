import React, { Component } from "react";

import "../Learn.css";

class Funk extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div class="learnpage">
        <h1>Quantum Funk</h1>
        <br/>
        <p>Quantum programs and algorithms are a <i>sequence of quantum operators</i> applied in sequence on a bunch of <b>quantum states</b>, they form what is called a <b style={{color: 'var(--primary)'}}>Quantum Circuit</b>. All possible quantum operators have to be unitary and reversible. This means if you modify quantum states with a circuit, by reversing that the circuit you get the original states back.</p>

      </div>
    );
  }
}

export default Funk;
