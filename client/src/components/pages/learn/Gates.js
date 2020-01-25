import React, { Component } from "react";
import ArticleButtons from "./ArticleButtons.js"

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
        <a className="gateButton next_desc i">0</a>
        <div className="gate_desc">
          <h2>0 Gate</h2>
          <p>The 0 gate sets the qubit to the statevector [1, 0], which translates to a value of [0] 100% of the times measured. The easiest way to set a bit to zero is to wait for a while until the systems <a href="funk" className="u-link">decoheres</a> and you are left with a 0.</p>
        </div>

        <br/>
        <a className="gateButton next_desc i">1</a>
        <div className="gate_desc">
          <h2>1 Gate</h2>
          <p>The 1 gate sets the qubit to the statevector [0, 1], which translates to a value of [1] 100% of the times measured.</p>
        </div>

        <br/>
        <a className="gateButton next_desc x">X</a>
        <div className="gate_desc">
          <h2>Pauli-X Gate</h2>
          <p>The Not gate (X), flips the states |0⟩ to |1⟩ and vice-versa. It is equivalent in definition to a classical not gate. It is represented as a 180 degree rotation on the bloch sphere. Mathematically it is equivalent to a rotation of <i>π radians</i> around the x-axis.</p>
        </div>

        <br/>
        <a className="gateButton next_desc y">Y</a>
        <div className="gate_desc">
          <h2>Pauli-Y Gate</h2>
          <p>Similar to the Pauli-X gate, however it is a rotation of <i>π radians</i> around the y-axis.</p>
        </div>

        <br/>
        <a className="gateButton next_desc z">Z</a>
        <div className="gate_desc">
          <h2>Pauli-Z Gate</h2>
          <p>A single qubit rotation of <i>π radians</i> around the z-axis.</p>
        </div>

        <br/>
        <a className="gateButton next_desc h">H</a>
        <div className="gate_desc">
          <h2>Hadamard Gate</h2>
          <p>The Hadamard gate (H),  rotates the states |0⟩ and |1⟩ to |+⟩ and |−⟩, respectively. It is useful for making superpositions. As a Clifford gate, it is useful for moving information between the x and z bases. It is expressed as a rotation of <i>π/2 radians</i> around the y-axis followed by a rotation of <i>π radians</i> around the x-axis.</p>
        </div>

        <br/>
        <a className="gateButton next_desc i">I</a>
        <div className="gate_desc">
          <h2>Identity Gate</h2>
          <p>The identity gate leaves the basis state of the qubit unchanged. It is useful for timing operations, making sure other operations happen when another qubit is ready only and for creating error models as it simulates a simple version of decoherence.</p>
        </div>

        <br/>
        <a className="gateButton next_desc rx">Rx</a>
        <div className="gate_desc">
          <h2>Rotation Operators</h2>
          <p>There are three rotation operators: Rx, Ry and Rz. The gates apply a single qubit rotation of angle θ around the axes x, y and z respectively.</p>
        </div>

        <br/>
        <a className="gateButton next_desc cx">CX</a>
        <div className="gate_desc">
          <h2>Controlled Not Gate</h2>
          <p>The CNOT gate is a two qubit operation, where the first qubit is usually referred to as the control qubit and the second qubit as the target qubit. If the control qubit is |1⟩, it applies a Pauli-X Gate on the target qubit. If the control qubit is |0⟩, it leaves the state of the target qubit unchanged (applies an identity).</p>
        </div>

        <br/>
        <a className="gateButton next_desc cz">CZ</a>
        <div className="gate_desc">
          <h2>Other Controlled Gates</h2>
          <p>More control gates can be constructed using the same methodolody, apply the operation if the control qubit is |1⟩ or else just apply the identity.</p>
        </div>

        <br/>
        <a className="gateButton next_desc crk">CRk</a>
        <div className="gate_desc">
          <h2>Controlled Phase Shift</h2>
          <p>This gate applies a phase shift with an angle θ if the control bit is |1⟩. A CR gate is similar but is applied to one axis only, this gate is a generalisation of CR.</p>
        </div>

        <br/>
        <a className="gateButton next_desc ccx">CCX</a>
        <div className="gate_desc">
          <h2>Toffoli gate</h2>
          <p>The Toffoli Gate, also known as a Controlled-Controlled Not, is a three qubit operation that works in a similar fashion to the Controlled Not Gate (CX), except it has 2 control qubits. If both controls are |1⟩, the target qubit has a Pauli-X applied to it, else no operation is applied on it.</p>
        </div>

        <br/>
        <a className="gateButton next_desc u">U</a>
        <div className="gate_desc">
          <h2>U Gates</h2>
          <p>The Quantum Experience standard header compiles circuits and implements them in terms of the abstract gates U and CX. The U is a single qubit gate that takes in three parameters and can cause any rotation on the bloch sphere based on the hard-coded parameters. In OpenQASM u3 applies the U gate, constructs like <b style={{fontFamily: "Roboto Mono"}}>[u1(z) == u3(0,0,z)]</b> and <b style={{fontFamily: "Roboto Mono"}}>[u2(y,z) == u3(0,y,z)]</b> exist.</p>
        </div>

        <br/>
        <a className="gateButton next_desc s">S</a>
        <div className="gate_desc">
          <h2>S Gate</h2>
          <p>The S gate is also known as the phase gate or the Z90 gate, because it represents a 90 degree rotation around the z-axis. The Sdg gate is the conjugate transpose of the S gate.</p>
        </div>

        <br/>
        <a className="gateButton next_desc t">T</a>
        <div className="gate_desc">
          <h2>T Gate</h2>
          <p>The T gate is related to the S gate by the relationship S=T². The Sdg gate is the conjugate transpose of the T gate.</p>
        </div>

        <br/>
        <a className="gateButton next_desc swap"><p style={{margin: "0px", width: "100%", textAlign:"center", fontSize: "0.8em"}}>swap</p></a>
        <div className="gate_desc">
          <h2>Qubit Swap</h2>
          <p>This is a two qubit operation that switches the states of its two inputs. This gate can be constructed by three sequential alternating CX gates.</p>
        </div>

        <ArticleButtons left="Quantum Funk" right="Bloch Spheres" left_link="funk" right_link="bloch"/>

      </div>
    );
  }
}

export default Gates;
