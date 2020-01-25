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
    const out_bell_states = this.props.simulation_values[states.join('')];

    const out_opponent_bell_states = this.props.opponent_simulation_values[states.join('')];

    this.props.setPaddlePosition(out_bell_states, 1024);
    this.props.setOpponentPaddlePosition(out_opponent_bell_states, 1024);

  }

  render() {
    return null
  }

}

export default CircuitSim;
