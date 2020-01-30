import React, { Component } from "react";

// TODO: add css later
import { post } from "../../utilities";
import "./CircuitLogic.css";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBackspace, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons'

import Loading from "./Loading"

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

    this.props.setPaddlePosition(out_bell_states, 1024);

    if (this.props.opponent_simulation_values) {
      const out_opponent_bell_states = this.props.opponent_simulation_values[states.join('')];
      this.props.setOpponentPaddlePosition(out_opponent_bell_states, 1024);
    }

  }

  render() {
    console.log(this.props)
    if (this.props.opponent_simulation_values) {
      return <div>
        <Loading msg="First to reach 10 is the winner. The algorithm score is set by how well it does against the Classical AI." title={this.props.home_name + " vs. " + this.props.away_name}/>
        <br />
        <h4 style={{marginBottom: "0.25em", marginLeft: "0.2em"}}>Your Circuit</h4>
        <img src={"http://tareq.scripts.mit.edu/woop/id:"+this.props.circuit_id+".png?"+Date.now()} className="circuitPreview"/>
      </div>
    }

    return <div>
      <Loading msg="First to reach 20 is the winner. The algorithm score is set by how well it does against the Classical AI." title={"Simulating \“"+this.props.name+"\”"}/>
      <br />
      <img src={"http://tareq.scripts.mit.edu/woop/id:"+this.props.circuit_id+".png"} className="circuitPreview"/>
    </div>
  }

}

export default CircuitSim;
