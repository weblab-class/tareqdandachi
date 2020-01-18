import React, { Component } from "react";

// TODO: add css later
import { post } from "../../utilities";
import "./CircuitLogic.css";
import Draggable from 'react-draggable';

class CircuitLogic extends Component {
  constructor(props) {
    super(props);

    this.state = {
      qasm: "",
      gateArray: [],
    };
  }

  save = false;

  can_drop = (id) => {

    return document.getElementById(id).children.length < 5 && id.substring(0, 4) == "wire"

  }

  parse_circuit = () => {

    items = []

    wire_id_array = (id) => Array.from(document.getElementById(id).childNodes).map((item)=>item.id);

    branch1 = wire_id_array("wire1")

    branch2 = wire_id_array("wire2")

    branch3 = wire_id_array("wire3")

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

    save = ev.target.parentNode.id == "gateContainer"

  }

  drop = (ev) => {

    if (this.can_drop(ev.target.id)) {

      ev.preventDefault();
      var data = ev.dataTransfer.getData("text");
      item = save ? document.getElementById(data).cloneNode(true) : document.getElementById(data)
      item.id = item.getAttribute("gate") + (ev.target.id) + (ev.target.children.length)
      ev.target.appendChild(item);

      console.log(parse_circuit())

    }

  }

  discard = (ev) => {

    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");

    if (data) { document.getElementById(data).remove(); }

  }

  render() {

    const gateSelector = (
      <div id="gateContainer" class="gateContainer">
        <Draggable handle="#XGate"><div id="XGate" gate="x" class="gate x">X</div></Draggable>
        <div id="HGate" gate="h" class="gate h">H</div>
        <div id="CXGate" gate="cx" class="gate cx">CX</div>
        <div id="0Gate" gate="zero" class="gate zero">0</div>
        <div id="1Gate" gate="one" class="gate one">1</div>
      </div>
    )

    return (
      <div class="logicContainer">
        <div class="wires">
          <div id="wire1" class="wire"></div>
          <div id="wire2" class="wire"></div>
          <div id="wire3" class="wire"></div>
        </div>

        { gateSelector }
      </div>
    );
  }
}

export default CircuitLogic;
