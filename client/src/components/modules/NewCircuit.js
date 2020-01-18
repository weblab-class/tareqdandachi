import React, { Component } from "react";

// TODO: add css later
import { post } from "../../utilities";

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
      <div className="u-flex" onSubmit={this.addCircuit}>
        <input
          type="text"
          placeholder={this.props.defaultText}
          value={this.state.value}
          onChange={this.handleChange}
          className="NewPostInput-input"
        />
        <button
          type="submit"
          className="NewPostInput-button u-pointer"
          value="Submit"
          onClick={this.handleSubmit}
        >
          Submit
        </button>
      </div>
    );
  }
}

export default NewCircuit;
