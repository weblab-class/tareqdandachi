import React, { Component } from "react";

// TODO: add css later
import { post } from "../../utilities";
import "./CircuitLogic.css";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBackspace, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons'

class CircuitLogic extends Component {
  constructor(props) {
    super(props);

    this.state = {
      qasm: "",
      gateArray: [],
    };

    this.save = false;

  }

  componentDidUpdate(prevProps) {
    if (prevProps.ball_states !== this.props.ball_states) {
      this.evaluate_circuit()
    }
  }

  can_drop = (id) => {

    return document.getElementById(id).children.length < 5 && id.substring(0, 4) == "wire"

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
    const circuit = this.parse_circuit()

    const linearizeBloch = (val) => {
      if (val > 1) {return linearizeBloch(val-1)}
      if (val < 0) {return linearizeBloch(val+1)}
      return val
    }

    const applyH = (val, c) => { return val + 0.5 }
    const applyX = (val, c) => { return 1 - val }
    const applyI = (val, c) => { return val }
    const apply0 = (val, c) => { return 0 }
    const apply1 = (val, c) => { return 1 }
    const applyC = (val, c) => { return c==1 ? applyX(val) : val }

    const gateMap = {'h': applyH, 'x': applyX, 'z': apply0, 'o': apply1, 'c': applyC, "i": applyI}

    for (var i=0; i < circuit.length; i++) {

      const gate = circuit[i].charAt(0);
      const bit = circuit[i].charAt(circuit[i].length-2)-1;

      const gateFunction = gateMap[gate];

      states[bit] = linearizeBloch(gateFunction(states[bit], states[bit-1]))

    }

    this.props.setPaddlePosition(states, 1)

  }

  parse_circuit = () => {

    var items = []

    const wire_id_array = (id) => Array.from(document.getElementById(id).childNodes).map((item)=>item.id);

    const branch1 = wire_id_array("wire1")
    const branch2 = wire_id_array("wire2")
    const branch3 = wire_id_array("wire3")

    items = branch1.concat(branch2).concat(branch3)

    items.sort((x, y) => {
        var n = x.charAt(x.length-1) - y.charAt(y.length-1);
        if (n !== 0) {
            return n;
        }

        return x.charAt(x.length-2) - y.charAt(y.length-2);
    });

    return items

  }

  allowDrop = (ev) => {
    ev.preventDefault();
  }

  drag = (ev) => {

    ev.dataTransfer.setData("text", ev.target.id);

    // this.save = ev.target.parentNode.id == "gateContainer"

  }

  drop = (ev) => {

    if (this.can_drop(ev.target.id)) {

      ev.preventDefault();
      var data = ev.dataTransfer.getData("text");

      const item = ev.dataTransfer.getData("delete") ? document.getElementById(data) : document.getElementById(data).cloneNode(true)
      item.id = item.getAttribute("gate") + (ev.target.id) + (ev.target.children.length)
      item.addEventListener('dblclick', function (e) {
        e.target.parentNode.removeChild(e.target);
      });
      item.addEventListener('dragstart', function (e) {
        e.dataTransfer.setData("text", e.target.id);
        e.dataTransfer.setData("delete", true);
      });
      ev.target.appendChild(item);

    }

  }

  discard = (ev) => {

    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");

    if (data && data.includes("wire")) { document.getElementById(data).remove(); }

  }

  render() {

    const gateSelector = (
      <div id="gateContainer" className="gateContainer">
        <div id="XGate" gate="x" className="gate x" draggable="true" onDragStart={this.drag}>X</div>
        <div id="HGate" gate="h" className="gate h" draggable="true" onDragStart={this.drag}>H</div>
        <div id="CXGate" gate="cx" className="gate cx" draggable="true" onDragStart={this.drag}>CX</div>
        <div id="IGate" gate="i" className="gate i" draggable="true" onDragStart={this.drag}>I</div>
        <div id="0Gate" gate="zero" className="gate zero" draggable="true" onDragStart={this.drag}>0</div>
        <div id="1Gate" gate="one" className="gate one" draggable="true" onDragStart={this.drag}>1</div>
      </div>
    )

    return (
      <div className="logicContainer">
        <h3>Circuit Logic</h3>
        <div className="wires">
          <div id="wire1" className="wire" onDragLeave={this.discard} onDrop={this.drop} onDragOver={this.allowDrop}></div>
          <div id="wire2" className="wire" onDragLeave={this.discard} onDrop={this.drop} onDragOver={this.allowDrop}></div>
          <div id="wire3" className="wire" onDragLeave={this.discard} onDrop={this.drop} onDragOver={this.allowDrop}></div>
        </div>

        <h3>Available Gates</h3>
        <h5 style={{marginTop: "-0.75em"}}>Drag and drop gates onto wires, double click to delete gate</h5>
        { gateSelector }

        <h3>Keyboard Controls</h3>
        <div className="keyboardControls">
          <p><FontAwesomeIcon className="icon" icon={faArrowUp} /> Select wire above</p>
          <p><FontAwesomeIcon className="icon" icon={faArrowDown} /> Select wire below</p>
          <p><FontAwesomeIcon className="icon" icon={faBackspace} /> Delete gate on row</p>
          <p><b className="icon">X</b> Insert X Gate</p>
          <p><b className="icon">H</b> Insert H Gate</p>
          <p><b className="icon">C</b> Insert CX Gate</p>
          <p><b className="icon">I</b> Insert Id Gate</p>
          <p><b className="icon">0</b> Insert 0 Gate</p>
          <p><b className="icon">1</b> Insert 1 Gate</p>
        </div>
      </div>
    );
  }
}

export default CircuitLogic;
