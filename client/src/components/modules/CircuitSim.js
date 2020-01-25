import React, { Component } from "react";

// TODO: add css later
import { post } from "../../utilities";
import "./CircuitLogic.css";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBackspace, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons'

class CircuitSim extends Component {
  constructor(props) {
    super(props);

  }

  componentDidMount() {
  }

  componentDidUpdate(prevProps) {
    if (prevProps.ball_states !== this.props.ball_states) {
      this.evaluate_circuit()
    }
  }

  get_inputs = () => {

    const get_bits = (num) => {

      var bits = (num).toString(2)

      while (bits.length < 3) { bits = "0" + bits}

      return bits

    }

    const get_state = (ql) => get_bits(ql[0]).split('').map(x => ql[1]**2*x)

    var qlx = this.props.ball_states[0];
    var qly = this.props.ball_states[1];

    if (qlx[0] == -1) { qlx[0] = 0 }
    if (qly[1] == 8) { qlx[0] = 7 }

    qlx = get_state(qlx);
    qly = get_state(qly);

    var qlo = qlx.map(function (num, idx) {
      return num + qly[idx];
    });

    var qlo_r = qlo.map(function (num) {
      return Math.round(num);
    });

    return qlo_r

  }

  evaluate_circuit = () => {

    var states = this.get_inputs()
    // const circuit = this.parse_circuit()
    //
    // const linearizeBloch = (val) => {
    //   if (val > 1) {return linearizeBloch(val-1)}
    //   if (val < 0) {return linearizeBloch(val+1)}
    //   return val
    // }
    //
    // const applyH = (val, c) => { return val + 0.5 }
    // const applyX = (val, c) => { return 1 - val }
    // const applyI = (val, c) => { return val }
    // const apply0 = (val, c) => { return 0 }
    // const apply1 = (val, c) => { return 1 }
    // const applyC = (val, c) => { return c==1 ? applyX(val) : val }
    //
    // const gateMap = {'h': applyH, 'x': applyX, 'z': apply0, 'o': apply1, 'c': applyC, "i": applyI}
    //
    // for (var i=0; i < circuit.length; i++) {
    //
    //   const gate = circuit[i].charAt(0);
    //   const bit = circuit[i].charAt(circuit[i].length-2)-1;
    //
    //   const gateFunction = gateMap[gate];
    //
    //   states[bit] = linearizeBloch(gateFunction(states[bit], states[bit-1]))
    //
    // }

    const out_bell_states = this.props.simulation_values[states.join('')];

    // const possible_out_states = ["000", "001", "010", "011", "100", "101", "110", "111"];
    //
    // const measurement_value = Math.random()*1024;
    //
    // var bitString = 0;
    //
    // for (var i=0; i < possible_out_states.length; i++) {
    //
    //   bitString = possible_out_states[i];
    //
    //   const prob_i = out_bell_states[bitString];
    //
    //   if (prob_i > measurement_value) { break }
    //
    // }

    this.props.setPaddlePosition(out_bell_states, 1024);

  }

  render() {
    return null
  }

}

export default CircuitSim;
