import React, { Component } from "react";

import "../Learn.css";

class Gates extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div class="learnpage">
        <h1>Quantum Gates</h1>
        <br/>
        <p>Quantum programs and algorithms are a <i>sequence of quantum operators</i> applied in sequence on a bunch of <b>quantum states</b>, they form what is called a <b style={{color: 'var(--primary)'}}>Quantum Circuit</b>. All possible quantum operators have to be unitary and reversible. This means if you modify quantum states with a circuit, by reversing that the circuit you get the original states back.</p>

        <br/>
        <h2>X Gate</h2>
        <p>The Not gate (X), flips the states |0⟩ to |1⟩ and vice-versa. It is equivalent in definition to a classical not gate. It is represented as a 180 degree rotation on the bloch sphere.</p>

        <br/>
        <h2>Y Gate</h2>
        <p>LIPSUM</p>

        <br/>
        <h2>Z Gate</h2>
        <p>LIPSUM</p>

        <br/>
        <h2>Hadamard Gate</h2>
        <p>The Hadamard gate (H),  rotates the states |0⟩ and |1⟩ to |+⟩ and |−⟩, respectively. It is useful for making superpositions. As a Clifford gate, it is useful for moving information between the x and z bases.</p>

        <br/>
        <h2>CX Gate</h2>
        <p>LIPSUM</p>

        <br/>
        <h2>RX Gate</h2>
        <p>LIPSUM</p>

        <br/>
        <h2>U Gate</h2>
        <p>LIPSUM</p>

        <br/>
        <h2>S Gate</h2>
        <p>LIPSUM</p>

        <br/>
        <h2>T Gate</h2>
        <p>LIPSUM</p>

        <br/>
        <h2>How to flip two qubits?</h2>
        <p>LIPSUM</p>

      </div>
    );
  }
}

export default Gates;
