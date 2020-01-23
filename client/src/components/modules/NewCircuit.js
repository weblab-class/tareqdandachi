import React, { Component } from "react";

import "./NewCircuit.css";
import { post } from "../../utilities";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    const body = { circuit: {title: "New Circuit", qasm: "OPENQASM 2.0;\ninclude \"qelib1.inc\";\n\nqreg q[3];\ncreg c[3];\nload();\n\n", description: "This is a new circuit created by " + this.props.user.name}, user: this.props.user };
    const toastId = toast("Creating New Circuit", {autoClose: false});
    post("/api/create_circuit", body).then((circuit) => {
      toast.update(toastId, { type: toast.TYPE.SUCCESS, autoClose: 1000, render: "Created New Circuit", hideProgressBar: true});
      this.props.createNewCircuit(circuit);
      location.href="/circuit-editor/"+circuit._id
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
