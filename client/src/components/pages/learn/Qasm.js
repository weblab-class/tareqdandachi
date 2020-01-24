import React, { Component } from "react";
import ArticleButtons from "./ArticleButtons.js"

import SyntaxHighlighter from 'react-syntax-highlighter';
import { monokaiSublime, atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

import "../Learn.css";

class Qasm extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div class="learnpage">
        <h1>QASM & Qiskit</h1>
        <br/>
        <p>QASM (Quantum Assembly) is a language designed to create quantum circuits at a low-level. This web-app uses the specifications defined in OpenQASM 2.0 by IBM. The backend of the app uses the latest version of Qiskit (0.14.1) to parse the circuits and then simulate your algos.</p>

        <br/>
        <p>You will learn how to write QASM code while making complex circuits and then the backend simulators will simulate your circuit and parse the output into a circuit diagram you can visually debug. Since the backend is simulating tons of quantum states, it may take up to 5 minutes to actually render your circuit from the backend queue.</p>

        <SyntaxHighlighter language="armasm" style={atomOneDark} className="qasmCode" showLineNumbers={ true }>
{`OPENQASM 2.0;
include "qelib1.inc";

qreg q[3];
creg c[3];
load();

x q[0];
h q[1];
cx q[0], q[1];

cu1(pi/4) q[2],q[0];
y q[2];
s q[0];`}
        </SyntaxHighlighter>

        <br/>
        <p>The first two lines define the type of QASM code and what gate library to use, in this case we are using the latest standard QASM library by IBM. Lines 4 & 5 define quantum and classical registers respectively. Registers hold values, classical ones can hold classical bit values only, to do so, you measure the value of a qubit into a classsical register slot. The quantum registers is where most of your work should be. For this program to function properly, you will need to define qreg's and creg's with at least 3 bits, where the first three bits are the bits that control the movement of the paddle and handle the input from the paddle position. The syntax of register creation commands is: "register_command name_of_variable[number_of_bits]".</p>

        <br />
        <p>The load command is syntactic sugar that works only in this web-app for loading the states of the ball into the quantum circuit you built. In an actual program you would define the states using gate operations or prep operations. To perform single qubit operations the syntax is "gate qubit" where qubit takes in the variable name with the index of the qubit. Multiple qubit operations are created in a similar fashion, where you seperate the multiple qubits by commas. Usually, the first qubits are the control qubits and the last one is the target in case of controlled gates.</p>

        <br />
        <p>In case a gate takes in a hardcoded parameters to define the gate operation it is put in parenthesis, seperated by commas, after the gate call. The syntax is as follows: "gate(parameters) qubits;", similar to line 12. A good source of examples to start with is <a href="https://github.com/Qiskit/openqasm/tree/master/examples" className="u-link">Qiskit/openqasm/examples</a>, however you cannot use custom gate definitions and opaque gate definitions because they are too abstract for the compiler to handle.</p>

        <ArticleButtons left="Bloch Spheres" right="Build Your First Circuit" left_link="bloch" right_link="/"/>

      </div>
    );
  }
}

export default Qasm;
