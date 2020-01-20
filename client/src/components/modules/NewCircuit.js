import React, { Component } from "react";

import "./NewCircuit.css";
import { post } from "../../utilities";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

class NewCircuit extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: "",
    };
  }

  // called whenever the user types in the new circuit input box
  handleChange = (event) => {
    this.setState({
      value: event.target.value,
    });
  };

  // called when the user hits "Submit" for a new post
  handleSubmit = (event) => {
    event.preventDefault();
    this.addCircuit(this.state.value);
    this.setState({
      value: "",
    });
  };

  addCircuit = (value) => {
    const body = { circuit: {title: "BABU BABU", qasm: "OPENQASM 2.0", description: "This is not a babu boi... don't mess with it"}, user: this.props.user };
    console.log(value)
    post("/api/create_circuit", body).then((circuit) => {
      // display this comment on the screen
      console.log("PROPS", this.props)
      this.props.createNewCircuit(circuit);
    });
  };

  render() {
    return (
      <div
        className="NewCircuit-button u-pointer"
        onSubmit={this.addCircuit} onClick={this.handleSubmit}>
        <a>
          <FontAwesomeIcon icon={faPlus} className="icon"/> New Circuit
        </a>
      </div>
    );
  }
}

export default NewCircuit;
