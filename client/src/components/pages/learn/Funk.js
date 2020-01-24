import React, { Component } from "react";
import ArticleButtons from "./ArticleButtons.js"

import "../Learn.css";

import measure from "../../images/measure.svg"

class Funk extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div class="learnpage">
        <h1>Quantum Funk</h1>
        <br/>
        <p>Quantum Mechanics is WHACK, or probabilistic as Mathematicians like to call it. A classical bit, binary values that are used in classical computers are composed of two states: 0 or 1, up or down, heads or tails. However, quantum bits, or qubits, are composed of a superposition of these two states. A qubit can be a 0, 1 or both with different chances of occuring.</p>
        <br/>
        <h2>Measuring a State</h2>
        <p>Whenever you measure a state, you cause it to decohere, which means that you lose the superposition of these two states. When that happens the output is binary and the bits superposition is completely moved to that state. In quantum computation this measurement is saved into a classical register that uses that value to communicate with the classical devices connected to it.</p>

        <img src={ measure } height="40px" className="inline_image" />

        <br/>
        <h2>Shots</h2>
        <p>Since Quantum algorithms rely on the quantum nature of the computation, decoherence is bad in the system. It also means that we need to retain that superposition instead of having a probabilistic binary output. To solve this issues, quantum computation relies on the concept of shots. Shots are the number of times a quantum computer repeats a computation, all the 0s and 1s from the output are tallied into what is called 'bell counts' and sampling them over the total number of shots, you get an estimate of what the superposition looked like originally.</p>

        <br/>
        <h2>Copying, Entangling and More</h2>
        <p>The no cloning theorem states that a qubit's state can't be cloned. Since measuring its state will decohere it, this makes sense. However, it is possible to create complex behaviour by entanglement. Entanglement is when two qubit states affect each other. So if state A and B are entangled, measuring the state A will define what the state of B should be.</p>

        <br/>

        <ArticleButtons left="Main Learning Page" right="Quantum Gates" left_link="/learn" right_link="gates"/>

      </div>
    );
  }
}

export default Funk;
