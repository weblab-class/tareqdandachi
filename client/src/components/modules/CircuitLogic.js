import React, { Component } from "react";

// TODO: add css later
import { post } from "../../utilities";
import "./CircuitLogic.css";

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
    }

    const applyH = (val) => { return val + 0.5 }
    const applyX = (val) => { return 1 - val }
    const apply0 = (val) => { return 0 }
    const apply1 = (val) => { return 1 }

    const gateMap = {'h': applyH, 'x': applyX, 'z': apply0, 'o': apply1}

    for (var i=0; i < circuit.length; i++) {

      const gate = circuit[i].charAt(0);
      const bit = circuit[i].charAt(circuit[i].length-2)-1;

      const gateFunction = gateMap[gate];

      console.log(gate, gateMap, gateFunction)

      states[bit] = gateFunction(states[bit])

    }

    this.props.setPaddlePosition(states)

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

    console.log(ev.target.parentNode.id, ev.target.parentNode.id == "gateContainer")

    this.save = ev.target.parentNode.id == "gateContainer"

  }

  drop = (ev) => {

    if (this.can_drop(ev.target.id)) {

      ev.preventDefault();
      var data = ev.dataTransfer.getData("text");
      const item = this.save ? document.getElementById(data).cloneNode(true) : document.getElementById(data)
      item.id = item.getAttribute("gate") + (ev.target.id) + (ev.target.children.length)
      ev.target.appendChild(item);

    }

  }

  discard = (ev) => {

    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");

    if (data) { document.getElementById(data).remove(); }

  }

  render() {

    const gateSelector = (
      <div id="gateContainer" className="gateContainer" onDrop={this.discard} onDragOver={this.allowDrop}>
        <div id="XGate" gate="x" className="gate x" draggable="true" onDragStart={this.drag}>X</div>
        <div id="HGate" gate="h" className="gate h" draggable="true" onDragStart={this.drag}>H</div>
        <div id="CXGate" gate="cx" className="gate cx" draggable="true" onDragStart={this.drag}>CX</div>
        <div id="0Gate" gate="zero" className="gate zero" draggable="true" onDragStart={this.drag}>0</div>
        <div id="1Gate" gate="one" className="gate one" draggable="true" onDragStart={this.drag}>1</div>
      </div>
    )

    return (
      <div className="logicContainer">
        <div className="wires">
          <div id="wire1" className="wire" onDragLeave={this.discard} onDrop={this.drop} onDragOver={this.allowDrop}></div>
          <div id="wire2" className="wire" onDragLeave={this.discard} onDrop={this.drop} onDragOver={this.allowDrop}></div>
          <div id="wire3" className="wire" onDragLeave={this.discard} onDrop={this.drop} onDragOver={this.allowDrop}></div>
        </div>

        { gateSelector }
      </div>
    );
  }
}

export default CircuitLogic;
